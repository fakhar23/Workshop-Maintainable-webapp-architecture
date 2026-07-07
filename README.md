## Wrapper Pattern Workshop

This project starts in the intentionally bad Step 1 state.

Students will only work in these files:

- `src/pages/PlaceOrderPage.jsx`
- `src/pages/ContactSupportPage.jsx`
- `src/services/emailService.js`

The app has two pages:

- Place Order
- Contact Support

Both pages can send an email. At the start, both pages contain the same duplicated Resend email-sending code.

## Step 0: Set Up Env

Rename `.env.example` to `.env`.

```bash
mv .env.example .env
```

Then run the app:

```bash
npm install
npm run dev
```

## Step 1: Starting Point

The starter code has duplicated logic on purpose.

`PlaceOrderPage.jsx` has its own `sendEmailWithResend` function.

`ContactSupportPage.jsx` also has its own `sendEmailWithResend` function.

That means both pages know:

- Resend is being used
- the API endpoint
- the request headers
- the request body shape
- how errors are handled

This is the problem we are going to fix.

## Step 2: Move Resend Logic Into A Service

Open `src/services/emailService.js`.

Move the duplicated `sendEmailWithResend` function from the page files into this service file.

The service should export it:

```js
export async function sendEmailWithResend({ to, subject, body }) {
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
```

Then import it in both pages:

```js
import { sendEmailWithResend } from "../services/emailService";
```

The pages should still call:

```js
await sendEmailWithResend({
  to: recipientEmail,
  subject: `Order placed by ${personName}`,
  body: `<p>${emailBody}</p>`,
});
```

At the end of Step 2:

- duplicate email code is removed
- both pages use one shared function
- the function is still Resend-specific

## Step 3: Create A Generic Wrapper

Now rename the service function from:

```js
sendEmailWithResend
```

to:

```js
sendEmail
```

The service should export:

```js
export async function sendEmail({ to, subject, body }) {
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
    throw new Error(errorData.message || "Email request failed.");
  }
}
```

Update both pages to import:

```js
import { sendEmail } from "../services/emailService";
```

And call:

```js
await sendEmail({
  to: recipientEmail,
  subject: `Order placed by ${personName}`,
  body: `<p>${emailBody}</p>`,
});
```

At the end of Step 3:

- pages no longer know Resend exists
- Resend is hidden inside the service
- the service is now a wrapper around the third-party provider

## Step 4: Replace Resend With Mailjet

Now change only `src/services/emailService.js`.

Do not edit:

- `src/pages/PlaceOrderPage.jsx`
- `src/pages/ContactSupportPage.jsx`

Replace the Resend request inside `sendEmail` with a Mailjet request:

```js
export async function sendEmail({ to, subject, body }) {
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
    throw new Error(errorData.message || "Email request failed.");
  }
}
```

At the end of Step 4:

- the app has switched from Resend to Mailjet
- the pages did not change
- the wrapper protected the app from third-party SDK/API changes

That is the Wrapper Pattern.
