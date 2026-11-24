// Checks a contact message's fields. Shared by the contact form (in the browser) and by
// sendContactMessage (on the server), so both apply the same rules.
import { isEmail } from "./isEmail";

function isMissing(value) {
  return typeof value !== "string" || value.trim() === "";
}

// Returns one boolean per field, true when that field has an error.
export function validateContactMessage({ full_name, email, message }) {
  return {
    full_name: isMissing(full_name),
    email: !isEmail(email),
    message: isMissing(message),
  };
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
