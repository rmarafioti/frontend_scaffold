// The site's contact form: full name, email and message. Checks the fields in the browser, sends
// them through the sendContactMessage server action (which checks them again), then shows the
// success modal. No email SDK or key is ever in the browser.
"use client";

import { useState } from "react";

import FormModal from "./FormModal";
import { useModal } from "@/app/_hooks/useModal";
import { sendContactMessage } from "@/app/_lib/sendContactMessage";
import {
  hasErrors,
  validateContactMessage,
} from "@/app/_lib/validateContactMessage";

import styles from "@/app/_styling/contact_form.module.css";

const EMPTY_MESSAGE = { full_name: "", email: "", message: "" };
const NO_ERRORS = { full_name: false, email: false, message: false };

export default function ContactForm() {
  const [formValues, setFormValues] = useState(EMPTY_MESSAGE);
  const [validationError, setValidationError] = useState(NO_ERRORS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSendFailed, setHasSendFailed] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateContactMessage(formValues);
    setValidationError(errors);
    if (hasErrors(errors)) return;

    setIsLoading(true);
    setHasSendFailed(false);
    const result = await sendContactMessage(formValues);
    setIsLoading(false);

    if (!result.isSent) {
      // The server checks the fields again; show its errors if it found any.
      if (result.errors) setValidationError(result.errors);
      else setHasSendFailed(true);
      return;
    }

    setFormValues(EMPTY_MESSAGE);
    openModal();
  }

  return (
    <article>
      <h3 className={styles.header}>Form</h3>
      <p className={styles.sub_header}>
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet
        consectetur adipiscing elit quisque faucibus.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <label className={styles.label} htmlFor="contact-full-name">
          Full name*
        </label>
        <input
          id="contact-full-name"
          className={styles.name}
          type="text"
          name="full_name"
          autoComplete="name"
          value={formValues.full_name}
          onChange={handleInputChange}
        />
        <label className={styles.label} htmlFor="contact-email">
          Email*
        </label>
        <input
          id="contact-email"
          className={styles.email}
          type="email"
          name="email"
          autoComplete="email"
          value={formValues.email}
          onChange={handleInputChange}
        />
        <label className={styles.label} htmlFor="contact-message">
          Your message*
        </label>
        <textarea
          id="contact-message"
          className={styles.message}
          name="message"
          value={formValues.message}
          onChange={handleInputChange}
        />
        <p className={styles.required}>*Required</p>
        <input
          className={styles.send}
          type="submit"
          value={isLoading ? "Sending..." : "Send"}
          disabled={isLoading}
        />

        <div aria-live="polite">
          {validationError.full_name && (
            <p className={styles.required_error}>
              *Please enter your full name
            </p>
          )}
          {validationError.email && (
            <p className={styles.required_error}>*Please enter your email</p>
          )}
          {validationError.message && (
            <p className={styles.required_error}>*Please leave us a message</p>
          )}
          {hasSendFailed && (
            <p className={styles.required_error}>
              *Message failed to send. Please try again
            </p>
          )}
        </div>
      </form>
      <FormModal isOpen={isOpen} closeModal={closeModal} />
    </article>
  );
}
