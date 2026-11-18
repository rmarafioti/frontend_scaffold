// Server action: the only place the contact form's message is sent. It checks the fields again,
// then sends them through EmailJS's REST API with the server-only EMAILJS_* keys. Changing how
// messages are sent changes only this file.
"use server";

import { hasErrors, validateContactMessage } from "./validateContactMessage";

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

// Sends the message. Returns { isSent: true }, or { isSent: false } with the field errors when a
// field is invalid. Nothing is logged, so the keys and the message never reach the logs.
export async function sendContactMessage({ full_name, email, message }) {
  const errors = validateContactMessage({ full_name, email, message });
  if (hasErrors(errors)) return { isSent: false, errors };

  try {
    const response = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        // The field names the site's EmailJS template reads.
        template_params: { full_name, email, message },
      }),
    });
    return { isSent: response.ok };
  } catch {
    // A network failure is reported the same way as an error response.
    return { isSent: false };
  }
}
