import { useState } from "react";
import { sendEmail } from "../services/emailService";

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
      await sendEmail({
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
