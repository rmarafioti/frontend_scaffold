// Server action: the only place the contact form's message is sent. It drops bots caught by the
// honeypot, checks the fields again, then sends them through the Headless CMS's contact route
// (docs/cms/contact.md), which emails them to the site owners. Server-only: the API key never
// reaches the browser. Nothing is logged.
"use server";

import { hasErrors, validateContactMessage } from "./validateContactMessage";

// The CMS's field paths, mapped onto the form's field names. A path not listed here (an extra,
// a label) is a bug in the site's code rather than the visitor's, so it shows the general error.
function formFieldFor(path) {
  if (path === "name") return "full_name";
  if (path === "email" || path === "message") return path;
  if (/^images\.\d+\.content$/.test(path)) return "photos";
  return null;
}

// Turns a 400's `fields` into the form's errors, or null when none of them maps to a field.
function fieldErrorsFrom(fields) {
  const errors = {};
  for (const [path, message] of Object.entries(fields ?? {})) {
    const field = formFieldFor(path);
    if (field && !errors[field]) errors[field] = message;
  }
  return hasErrors(errors) ? errors : null;
}

// Each shrunk photo the form sent, as the CMS's { content } in base64. The browser sends an
// empty file part when no photo was picked, so those are skipped.
async function imagesFrom(formData) {
  const photos = formData.getAll("photos").filter((file) => file.size > 0);
  return Promise.all(
    photos.map(async (file) => ({
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );
}

// Returns { isSent: true }, or { isSent: false } with `errors` (a message per form field) when a
// field is invalid. { isSent: false } without errors means the form shows its general error.
export async function sendContactMessage(formData) {
  // A bot filled the hidden honeypot field: answer as if sent, send nothing.
  if (formData.get("contactCode")) return { isSent: true };

  const fields = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };
  const errors = validateContactMessage(fields);
  if (hasErrors(errors)) return { isSent: false, errors };

  // Not wired up to the CMS yet: the message can't go anywhere, so never pretend it was sent.
  if (!process.env.HEADLESS_CMS_API_URL) return { isSent: false };

  const images = await imagesFrom(formData);

  try {
    const response = await fetch(
      `${process.env.HEADLESS_CMS_API_URL}/api/public/contact`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HEADLESS_CMS_API_KEY}`,
          "X-CSRF-Protection": "1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.full_name,
          email: fields.email,
          message: fields.message,
          ...(images.length > 0 && { images }),
        }),
      },
    );
    if (response.ok) return { isSent: true };
    if (response.status !== 400) return { isSent: false };

    const { error } = await response.json();
    const fieldErrors = fieldErrorsFrom(error?.fields);
    return fieldErrors
      ? { isSent: false, errors: fieldErrors }
      : { isSent: false };
  } catch {
    // A network failure (or an unreadable error body) is reported like an error response.
    return { isSent: false };
  }
}
