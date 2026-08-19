import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLANS, PAID_PLAN_IDS, type PlanId } from "@/lib/plans";

const PLAN_PRICES: Record<string, number> = Object.fromEntries(
  PAID_PLAN_IDS.map((id) => [id, PLANS[id].amount]),
);

const paidPlanEnum = z.enum(["day", "week", "month", "year"]);

const orderInput = z.object({
  plan: paidPlanEnum,
});

export type CreateCashfreeOrderInput = z.infer<typeof orderInput>;

export type CreateCashfreeOrderResult = {
  ok: boolean;
  paymentSessionId?: string;
  message?: string;
};

function cashfreeBaseUrl() {
  const env = (process.env["CASHFREE_ENV"] ?? "sandbox").toLowerCase();
  return env === "production" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";
}

function cashfreeHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-version": "2025-01-01",
    "x-client-id": process.env["CASHFREE_CLIENT_ID"]!,
    "x-client-secret": process.env["CASHFREE_CLIENT_SECRET"]!,
  };
}

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .validator(orderInput)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<CreateCashfreeOrderResult> => {
    try {
      const clientId = process.env["CASHFREE_CLIENT_ID"];
      const clientSecret = process.env["CASHFREE_CLIENT_SECRET"];

      if (!clientId || !clientSecret) {
        return {
          ok: false,
          message:
            "Cashfree is not configured yet. Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET in .env.local.",
        };
      }

      const serverAmount = PLAN_PRICES[data.plan];
      if (serverAmount === undefined) {
        return { ok: false, message: "Invalid plan selected." };
      }

      const claims = (context.claims ?? {}) as Record<string, unknown>;
      const customerEmail = typeof claims["email"] === "string" ? claims["email"] : context.userId;
      const meta = claims["user_metadata"] as Record<string, unknown> | undefined;
      const customerName =
        typeof meta?.["full_name"] === "string" ? meta["full_name"] : customerEmail;

      const rand = new Uint8Array(6);
      crypto.getRandomValues(rand);
      const randPart = Array.from(rand, (b) => b.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, 8);
      const orderId = `UQR-${Date.now()}-${randPart}`;
      const baseReturnUrl = process.env["CASHFREE_RETURN_URL"] ?? "http://localhost:8080/billing";

      const response = await fetch(`${cashfreeBaseUrl()}/pg/orders`, {
        method: "POST",
        headers: cashfreeHeaders(),
        body: JSON.stringify({
          order_amount: String(serverAmount),
          order_currency: process.env["CASHFREE_CURRENCY"] ?? "INR",
          order_id: orderId,
          customer_details: {
            customer_id: `uqr_${customerEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
            customer_email: customerEmail,
            customer_name: String(customerName),
            customer_phone: "9999999999",
          },
          order_meta: {
            return_url: `${baseReturnUrl}?order_id={order_id}&plan=${data.plan}`,
          },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("[Cashfree] create order failed", response.status, text);
        let detail = "Could not create the payment session. Please try again.";
        try {
          const errJson = JSON.parse(text) as Record<string, unknown>;
          const msg = errJson["message"] ?? errJson["error"];
          if (typeof msg === "string" && msg) detail = msg;
        } catch {
          // keep default
        }
        return { ok: false, message: detail };
      }

      const json = (await response.json()) as {
        payment_session_id?: string;
        cf_order_id?: string;
      };
      if (!json.payment_session_id) {
        console.error("[Cashfree] no payment_session_id in response", json);
        return { ok: false, message: "Payment provider did not return a session." };
      }

      return { ok: true, paymentSessionId: json.payment_session_id };
    } catch (err) {
      console.error("[Cashfree] createCashfreeOrder crashed", err);
      return { ok: false, message: "An unexpected error occurred. Please try again." };
    }
  });

export type VerifyPaymentResult = {
  ok: boolean;
  plan?: string;
  message?: string;
};

export const verifyCashfreePayment = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string().min(1), plan: paidPlanEnum }))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<VerifyPaymentResult> => {
    const clientId = process.env["CASHFREE_CLIENT_ID"];
    const clientSecret = process.env["CASHFREE_CLIENT_SECRET"];

    if (!clientId || !clientSecret) {
      return { ok: false, message: "Cashfree is not configured." };
    }

    const response = await fetch(`${cashfreeBaseUrl()}/pg/orders/${data.orderId}`, {
      method: "GET",
      headers: cashfreeHeaders(),
    });

    if (!response.ok) {
      console.error("[Cashfree] order fetch failed", response.status);
      return { ok: false, message: "Could not verify payment status." };
    }

    const order = (await response.json()) as {
      order_status?: string;
      order_id?: string;
      customer_details?: { customer_id?: string };
    };

    const status = (order.order_status ?? "").toUpperCase();
    if (status !== "PAID") {
      return { ok: false, message: `Payment status: ${status || "unknown"}` };
    }

    const claims = (context.claims ?? {}) as Record<string, unknown>;
    const customerEmail = typeof claims["email"] === "string" ? claims["email"] : context.userId;
    const expectedCustomerId = `uqr_${customerEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const actualCustomerId = order.customer_details?.customer_id;

    if (!actualCustomerId || actualCustomerId !== expectedCustomerId) {
      console.error("[Billing] orderId ownership mismatch or missing customer_id");
      return { ok: false, message: "This order does not belong to your account." };
    }

    const expectedAmount = PLAN_PRICES[data.plan];
    const orderAmount = Number((order as Record<string, unknown>)["order_amount"]);
    if (expectedAmount !== undefined && orderAmount !== expectedAmount) {
      console.error("[Billing] payment amount mismatch", {
        expected: expectedAmount,
        got: orderAmount,
      });
      return { ok: false, message: "Payment amount does not match the selected plan." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;
    const planDef = PLANS[data.plan as PlanId];
    const expiresAt = planDef.durationDays
      ? new Date(Date.now() + planDef.durationDays * 86400000).toISOString()
      : null;

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ plan: data.plan, plan_expires_at: expiresAt })
      .eq("id", userId);

    if (updateError) {
      console.error("[Billing] failed to update plan", updateError);
      return { ok: false, message: "Payment verified but could not update your plan." };
    }

    return { ok: true, plan: data.plan };
  });
