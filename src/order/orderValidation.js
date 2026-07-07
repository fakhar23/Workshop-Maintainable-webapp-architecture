export function validateOrderForm({ customerName, email, quantity, couponCode }) {
  if (customerName.trim().length < 2) {
    return "Customer name must be at least 2 characters.";
  }

  if (!email.includes("@")) {
    return "Please enter a valid email address.";
  }

  if (quantity < 1) {
    return "Quantity must be at least 1.";
  }

  if (quantity > 5) {
    return "You can only order up to 5 items.";
  }

  if (couponCode && couponCode !== "STUDENT20" && couponCode !== "VIP10") {
    return "Invalid coupon code.";
  }

  return "";
}
