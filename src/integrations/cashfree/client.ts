let sdkPromise: Promise<void> | null = null;

type CashfreeSdk = {
  redirect: (options: { paymentSessionId: string }) => Promise<void>;
};

declare global {
  interface Window {
    Cashfree?: new (options: { mode: "sandbox" | "production" }) => CashfreeSdk;
  }
}

function loadSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;
  if (typeof window === "undefined" || window.Cashfree) return Promise.resolve();
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the Cashfree SDK."));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export async function startCashfreeCheckout(paymentSessionId: string) {
  await loadSdk();
  if (!window.Cashfree) throw new Error("Cashfree SDK unavailable.");
  const mode = import.meta.env["VITE_CASHFREE_ENV"] === "production" ? "production" : "sandbox";
  const cashfree = new window.Cashfree({ mode });
  await cashfree.redirect({ paymentSessionId });
}
