import { useState } from "react";
import "./OrderForm.css";

export default function FinalFrom3() {
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

    console.log("Order form submitted");

    // validation inside component
    if (customerName.trim().length < 2) {
      setError("Customer name must be at least 2 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    if (quantity > 5) {
      setError("You can only order up to 5 items.");
      return;
    }

    // business rules inside component
    let price = 0;

    if (product === "Headphones") {
      price = 80;
    }

    if (product === "Keyboard") {
      price = 120;
    }

    if (product === "Mouse") {
      price = 50;
    }

    let total = price * quantity;

    if (couponCode === "STUDENT20") {
      total = total * 0.8;
    }

    if (couponCode === "VIP10") {
      total = total * 0.9;
    }

    if (couponCode && couponCode !== "STUDENT20" && couponCode !== "VIP10") {
      setError("Invalid coupon code.");
      return;
    }

    // more business rule inside component
    let shippingCost = 10;

    if (total >= 100) {
      shippingCost = 0;
    }

    const finalTotal = total + shippingCost;

    try {
      setLoading(true);

      console.log("Sending order to API");

      // API call inside component
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({
            customerName,
            email,
            product,
            quantity,
            couponCode,
            total: finalTotal,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to place order.");
      }

      const data = await response.json();

      console.log("Order API response:", data);

      // email message logic inside component
      const emailSubject = `Order placed by ${customerName}`;
      const emailBody = `
        Hello ${customerName},

        Your order has been placed successfully.

        Product: ${product}
        Quantity: ${quantity}
        Total: €${finalTotal}

        Thank you for shopping with us.
      `;

      console.log("Sending email with subject:", emailSubject);
      console.log("Email body:", emailBody);

      // fake email sending inside component
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          to: email,
          subject: emailSubject,
          body: emailBody,
        }),
        headers: {
          "Content-Type": "application/json",
        },
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
