import { useState } from "react";

// TODO: Step 2 - move this whole function into src/services/emailService.js.
// Step 1: this Resend-specific email function is duplicated in both page files on purpose.
async function sendEmailWithResend({ to, subject, body }) {
  const response = await fetch("/api/resend/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: import.meta.env.VITE_RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      html: body,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Resend request failed.");
  }
}

function PlaceOrderPage() {
  const [recipientEmail, setRecipientEmail] = useState(
    "fakharwebdev@protonmail.com",
  );
  const [personName, setPersonName] = useState("Fakhar");
  const [emailBody, setEmailBody] = useState("An order was placed by Fakhar.");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSending(true);
    setMessage("");
    setMessageType("");

    try {
      // TODO: Step 2 - after moving the function, import it from the service file.
      // TODO: Step 3 - later, rename this call to a generic sendEmail wrapper.
      await sendEmailWithResend({
        to: recipientEmail,
        subject: `Order placed by ${personName}`,
        body: `<p>${emailBody}</p>`,
      });

      setMessage("Order email sent.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Could not send order email.");
      setMessageType("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section>
      <h2>Place Order</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Recipient email address
          <input
            type="email"
            value={recipientEmail}
            onChange={(event) => setRecipientEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Student name
          <input
            type="text"
            value={personName}
            onChange={(event) => setPersonName(event.target.value)}
            required
          />
        </label>

        <label>
          Email body
          <textarea
            value={emailBody}
            onChange={(event) => setEmailBody(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send order email"}
        </button>
      </form>

      {message && <p className={`status ${messageType}`}>{message}</p>}
    </section>
  );
}

export default PlaceOrderPage;
