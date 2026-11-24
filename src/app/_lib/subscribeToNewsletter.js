// Server action: the only place a newsletter subscriber is added. It drops bots caught by the
// honeypot, checks the email again, then adds it through Buttondown's API with the server-only
// BUTTONDOWN_API_KEY. Buttondown sends the confirmation email and handles unsubscribes. Changing
// vendor changes only this file.
"use server";

import { headers } from "next/headers";

import { isEmail } from "./isEmail";

// FILL: the newsletter vendor (docs/site.md). The template uses Buttondown.
const BUTTONDOWN_SUBSCRIBERS_URL = "https://api.buttondown.com/v1/subscribers";
// Pinned, so Buttondown can't rename the fields below under us.
const BUTTONDOWN_API_VERSION = "2026-11-10";

// The visitor's IP, which Buttondown's spam check reads. Without it, every signup comes from the
// host's few servers and may be blocked. On Vercel the first x-forwarded-for entry is the visitor.
async function visitorIp() {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  return forwardedFor?.split(",")[0].trim() || undefined;
}

// Returns { isSubscribed: true } once Buttondown has the email (it then sends its confirmation
// email), or { isSubscribed: false }, with isInvalidEmail when the email is bad. `website` is the
// form's hidden honeypot: only a bot fills it, and it is told it succeeded. Nothing is logged.
export async function subscribeToNewsletter({ email, website }) {
  if (website) return { isSubscribed: true };
  if (!isEmail(email)) return { isSubscribed: false, isInvalidEmail: true };

  try {
    const response = await fetch(BUTTONDOWN_SUBSCRIBERS_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
        "X-API-Version": BUTTONDOWN_API_VERSION,
      },
      body: JSON.stringify({
        email_address: email,
        ip_address: await visitorIp(),
      }),
    });
    // 201 is a new subscriber. An email already on the list answers 400, reported as a failure.
    return { isSubscribed: response.status === 201 };
  } catch {
    // A network failure is reported the same way as an error response.
    return { isSubscribed: false };
  }
}
