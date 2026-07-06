// This wrapper is the app's generic email sending function.
export async function sendEmail({ to, subject, body }) {
  // Old Resend logic kept here for the workshop:
  // const response = await fetch("/api/resend/emails", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     from: import.meta.env.VITE_RESEND_FROM_EMAIL || "onboarding@resend.dev",
  //     to,
  //     subject,
  //     html: body,
  //   }),
  // });

  const response = await fetch("/api/mailjet/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      subject,
      html: body,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Mailjet request failed.");
  }
}
