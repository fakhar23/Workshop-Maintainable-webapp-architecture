import { useState } from "react";

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

function ContactSupportPage() {
  const [recipientEmail, setRecipientEmail] = useState(
    "fakharwebdev@protonmail.com",
  );
  const [personName, setPersonName] = useState("Fakhar");
  const [emailBody, setEmailBody] = useState("Fakhar contacted support.");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSending(true);
    setMessage("");
    setMessageType("");

    try {
      await sendEmailWithResend({
        to: recipientEmail,
        subject: `Support request from ${personName}`,
        body: `<p>${emailBody}</p>`,
      });

      setMessage("Support email sent.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Could not send support email.");
      setMessageType("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section>
      <h2>Contact Support</h2>

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
          {isSending ? "Sending..." : "Send support email"}
        </button>
      </form>

      {message && <p className={`status ${messageType}`}>{message}</p>}
    </section>
  );
}

export default ContactSupportPage;
