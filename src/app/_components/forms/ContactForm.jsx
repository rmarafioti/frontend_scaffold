// The site's contact form: full name, email, message and optional photos. Checks the fields in
// the browser, sends them through the sendContactMessage server action (which checks them again
// and sends them through the CMS), then shows the success modal. No key is ever in the browser.
// A hidden honeypot field catches bots.
"use client";

import { useState } from "react";

import FormModal from "./FormModal";
import PhotoPicker from "./PhotoPicker";
import { useModal } from "@/app/_hooks/useModal";
import { sendContactMessage } from "@/app/_lib/sendContactMessage";
import {
  hasErrors,
  validateContactMessage,
} from "@/app/_lib/validateContactMessage";

import styles from "@/app/_styling/contact_form.module.css";

const EMPTY_MESSAGE = {
  full_name: "",
  email: "",
  message: "",
  contactCode: "",
};
const NO_ERRORS = {};
// The order the field errors are listed in.
const ERROR_FIELDS = ["full_name", "email", "message", "photos"];

// The form's values and photos as FormData, which a server action accepts with files.
function toFormData(formValues, photos) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(formValues)) {
    formData.append(name, value);
  }
  for (const photo of photos) {
    formData.append("photos", photo);
  }
  return formData;
}

export default function ContactForm() {
  const [formValues, setFormValues] = useState(EMPTY_MESSAGE);
  const [photos, setPhotos] = useState([]);
  // Changed after a send, so the photo picker remounts with an empty file input.
  const [photoPickerKey, setPhotoPickerKey] = useState(0);
  const [isPreparingPhotos, setIsPreparingPhotos] = useState(false);
  // The message for a file the photo picker couldn't add (a wrong type, unreadable). The photos
  // already added are unaffected, so it doesn't stop a send.
  const [photoError, setPhotoError] = useState(null);
  const [validationError, setValidationError] = useState(NO_ERRORS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSendFailed, setHasSendFailed] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const isSendDisabled = isLoading || isPreparingPhotos;
  // A refused pick is shown in the photos slot, before any message from the server.
  const shownErrors = {
    ...validationError,
    photos: photoError ?? validationError.photos,
  };

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
    const result = await sendContactMessage(toFormData(formValues, photos));
    setIsLoading(false);

    if (!result.isSent) {
      // The server and the CMS check the fields again; show their errors if they found any.
      if (result.errors) setValidationError(result.errors);
      else setHasSendFailed(true);
      return;
    }

    setFormValues(EMPTY_MESSAGE);
    setPhotos([]);
    setPhotoError(null);
    setPhotoPickerKey((key) => key + 1);
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
        <PhotoPicker
          key={photoPickerKey}
          onChange={setPhotos}
          onErrorChange={setPhotoError}
          onPreparingChange={setIsPreparingPhotos}
        />
        {/* The honeypot: off screen and out of the tab order, so only a bot fills it. */}
        <input
          className={styles.honeypot}
          type="text"
          name="contactCode"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={formValues.contactCode}
          onChange={handleInputChange}
        />
        <p className={styles.required}>*Required</p>
        <input
          className={styles.send}
          type="submit"
          value={isLoading ? "Sending..." : "Send"}
          disabled={isSendDisabled}
        />

        <div aria-live="polite">
          {ERROR_FIELDS.filter((field) => shownErrors[field]).map((field) => (
            <p key={field} className={styles.required_error}>
              *{shownErrors[field]}
            </p>
          ))}
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
