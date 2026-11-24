// Whether a value looks like an email address. Shared by the contact form and the newsletter
// signup, in the browser and on the server, so every email is checked the same way.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return typeof value === "string" && EMAIL_PATTERN.test(value);
}
