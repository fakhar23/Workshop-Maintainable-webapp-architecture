export async function placeOrder(order) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to place order.");
  }

  return response.json();
}

export async function sendOrderEmail({ to, subject, body }) {
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      to,
      subject,
      body,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
