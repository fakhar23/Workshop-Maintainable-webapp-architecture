import { useState } from "react";
import { createOrderEmail } from "./emailMessages";
import { placeOrder, sendOrderEmail } from "./orderApi";
import { calculateFinalTotal } from "./orderPricing";
import { validateOrderForm } from "./orderValidation";
import "./OrderForm.css";

export default function OrderForm() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("Headphones");
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const validationError = validateOrderForm({
      customerName,
      email,
      quantity,
      couponCode,
    });

    if (validationError) {
      setError(validationError);
      return;
    }
    const finalTotal = calculateFinalTotal({
      product,
      quantity,
      couponCode,
    });

    try {
      setLoading(true);
      const data = await placeOrder({
        customerName,
        email,
        product,
        quantity,
        couponCode,
        total: finalTotal,
      });

      const orderEmail = createOrderEmail({
        customerName,
        product,
        quantity,
        finalTotal,
      });

      await sendOrderEmail({
        to: email,
        subject: orderEmail.subject,
        body: orderEmail.body,
      });

      setMessage(`Order placed successfully. Total: €${finalTotal}`);
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="order-page">
      <h1>Place Order</h1>

      <p>
        This is a simple demo order form. It intentionally contains too many
        responsibilities in one component.
      </p>

      {error && <div className="order-alert order-alert-error">{error}</div>}

      {message && (
        <div className="order-alert order-alert-success">{message}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="order-field">
          <label>Customer name</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Michael"
          />
        </div>

        <div className="order-field">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="michael@example.com"
          />
        </div>

        <div className="order-field">
          <label>Product</label>
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option>Headphones</option>
            <option>Keyboard</option>
            <option>Mouse</option>
          </select>
        </div>

        <div className="order-field">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="order-field">
          <label>Coupon code</label>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="STUDENT20 or VIP10"
          />
        </div>

        <button disabled={loading}>
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </main>
  );
}
