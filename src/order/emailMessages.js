export function createOrderEmail({ customerName, product, quantity, finalTotal }) {
  return {
    subject: `Order placed by ${customerName}`,
    body: `
      Hello ${customerName},

      Your order has been placed successfully.

      Product: ${product}
      Quantity: ${quantity}
      Total: €${finalTotal}

      Thank you for shopping with us.
    `,
  };
}
