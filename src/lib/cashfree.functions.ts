import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderInput = z.object({
  plan: z.enum(["flex", "pro"]),
  email: z.string().email(),
  name: z.string(),
});

export type CreateCashfreeOrderInput = z.infer<typeof orderInput>;

export type CreateCashfreeOrderResult = {
  ok: boolean;
  paymentSessionId?: string;
  message?: string;
};

const PLANS: Record<CreateCashfreeOrderInput["plan"], { amount: number; label: string }> = {
  flex: { amount: 14, label: "Flex" },
  pro: { amount: 39, label: "Pro" },
};

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .validator(orderInput)
  .handler(async ({ data }): Promise<CreateCashfreeOrderResult> => {
    const clientId = process.env["CASHFREE_CLIENT_ID"];
    const clientSecret = process.env["CASHFREE_CLIENT_SECRET"];
    const env = (process.env["CASHFREE_ENV"] ?? "sandbox").toLowerCase();

    if (!clientId || !clientSecret) {
      return {
        ok: false,
        message:
          "Cashfree is not configured yet. Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET in .env.local.",
      };
    }

    const plan = PLANS[data.plan];
    const baseUrl =
      env === "production" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";
    const orderId = `UQR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const returnUrl = process.env["CASHFREE_RETURN_URL"] ?? "http://localhost:8080/billing";

    const response = await fetch(`${baseUrl}/pg/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
      },
      body: JSON.stringify({
        order_amount: plan.amount,
        order_currency: process.env["CASHFREE_CURRENCY"] ?? "INR",
        order_id: orderId,
        customer_details: {
          customer_id: `uqr_${data.email.replace(/[^a-zA-Z0-9]/g, "_")}`,
          customer_email: data.email,
          customer_name: data.name,
          customer_phone: "9999999999",
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: returnUrl,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Cashfree] create order failed", response.status, text);
      return { ok: false, message: "Could not create the payment session. Please try again." };
    }

    const json = (await response.json()) as { payment_session_id?: string; cf_order_id?: string };
    if (!json.payment_session_id) {
      return { ok: false, message: "Payment provider did not return a session." };
    }

    return { ok: true, paymentSessionId: json.payment_session_id };
  });
