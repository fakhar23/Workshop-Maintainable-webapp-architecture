import { useState } from "react";
import * as Sentry from "@sentry/react";

const productDetailsUrl = "https://fakestoreapi.com/products/1";

function App() {
  const [status, setStatus] = useState("Ready");
  const [productDetails, setProductDetails] = useState(null);
  const [shouldCrashRender, setShouldCrashRender] = useState(false);

  if (shouldCrashRender) {
    throw new Error("Unhandled product details render crash caught by Sentry");
  }

  function logProductCheckoutEvent() {
    const payload = {
      action: "demo_console_log",
      screen: "Product details",
      productId: "sku-workshop-001",
      cartValue: 49.99,
      createdAt: new Date().toISOString(),
    };

    console.log("Product page console log", payload);
    console.info("Customer viewed ecommerce product details");
    console.warn("Low stock warning: only 3 items left");
    setStatus("Console messages written. Check DevTools and Sentry breadcrumbs.");
  }

  async function loadProductDetails() {
    setStatus("Loading product details...");
    setProductDetails(null);

    console.log("Starting product details request", {
      url: productDetailsUrl,
    });

    try {
      const response = await fetch(productDetailsUrl);

      if (!response.ok) {
        throw new Error(`Product details request failed with ${response.status}`);
      }

      const data = await response.json();
      console.log("Product details loaded", data);
      setProductDetails(data);
      setStatus(
        "Product details loaded. Check the Network tab and Sentry breadcrumbs.",
      );
    } catch (error) {
      console.error("Product details request failed", error);
      Sentry.captureException(error);
      setStatus(error.message);
    }
  }

  function captureExpiredCouponError() {
    const error = new Error("Expired coupon code used at checkout");

    console.error("Capturing expired coupon error", error);
    Sentry.captureException(error, {
      tags: {
        demo_type: "handled_error",
        coupon_state: "expired",
      },
      extra: {
        couponCode: "SUMMER-SALE-OLD",
        productId: "sku-workshop-001",
      },
    });
    setStatus("Expired coupon error sent with custom tags and extra data.");
  }

  function crashProductDetails() {
    console.log("About to crash product details render");
    setShouldCrashRender(true);
  }

  return (
    <main>
      <section className="demo-panel">
        <div className="demo-copy">
          <p className="eyebrow">Sentry ecommerce demo</p>
          <h1>Replay, console, errors, and product network breadcrumbs</h1>
          <p>
            Click around like a shopper, load product details, then trigger an
            error. In Sentry you should see UI clicks, console logs, fetch
            activity, traces, and replay data for the session.
          </p>
        </div>

        <div className="actions" aria-label="Sentry ecommerce demo actions">
          <button type="button" onClick={logProductCheckoutEvent}>
            <span>🖥️ Write console.log</span>
            <small>Writes console output, info messages, and warnings.</small>
          </button>
          <button type="button" onClick={loadProductDetails}>
            <span>🌐 Load product details</span>
            <small>Makes a product API call visible in the Network tab.</small>
          </button>
          <button type="button" onClick={captureExpiredCouponError}>
            <span>🎟️ Load expired coupon</span>
            <small>Throws and reports a handled coupon error.</small>
          </button>
          <button type="button" className="danger" onClick={crashProductDetails}>
            <span>💥 Crash Product Details</span>
            <small>Throws an unhandled render error.</small>
          </button>
        </div>

        <div className="status">
          <span>Status</span>
          <p>{status}</p>
        </div>

        {productDetails && (
          <pre aria-label="Product details response">
            {JSON.stringify(productDetails, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}

export default App;
