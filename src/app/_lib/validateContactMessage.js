// Checks a contact message's fields. Shared by the contact form (in the browser) and by
// sendContactMessage (on the server), so both apply the same rules. The length limits match the
// CMS's (docs/cms/contact.md → The contact route), so the visitor sees them before sending.
import { isEmail } from "./isEmail";

const NAME_MAX_LENGTH = 100;
const MESSAGE_MAX_LENGTH = 5000;

function isMissing(value) {
  return typeof value !== "string" || value.trim() === "";
}

function nameError(full_name) {
  if (isMissing(full_name)) return "Please enter your full name";
  if (full_name.length > NAME_MAX_LENGTH)
    return `Please keep your name under ${NAME_MAX_LENGTH} characters`;
  return null;
}

function messageError(message) {
  if (isMissing(message)) return "Please leave us a message";
  if (message.length > MESSAGE_MAX_LENGTH)
    return `Please keep your message under ${MESSAGE_MAX_LENGTH} characters`;
  return null;
}

// Returns one entry per field: the message to show, or null when the field is fine.
export function validateContactMessage({ full_name, email, message }) {
  return {
    full_name: nameError(full_name),
    email: isEmail(email) ? null : "Please enter a valid email",
    message: messageError(message),
  };
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
