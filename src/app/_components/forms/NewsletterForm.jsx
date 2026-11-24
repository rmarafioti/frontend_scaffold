// The newsletter signup form: one email field. Checks the email in the browser, then sends it
// through the subscribeToNewsletter server action, which adds it at the vendor. No vendor key is
// ever in the browser. A hidden honeypot field catches bots.
"use client";

import { useState } from "react";

import { isEmail } from "@/app/_lib/isEmail";
import { subscribeToNewsletter } from "@/app/_lib/subscribeToNewsletter";

// The contact form's field, button and message styles, so both forms look the same.
import formStyles from "@/app/_styling/contact_form.module.css";
import styles from "@/app/_styling/newsletter_form.module.css";

const EMPTY_SIGNUP = { email: "", website: "" };

export default function NewsletterForm() {
  const [formValues, setFormValues] = useState(EMPTY_SIGNUP);
  const [status, setStatus] = useState("idle");
  const isLoading = status === "loading";

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isEmail(formValues.email)) {
      setStatus("invalidEmail");
      return;
    }

    setStatus("loading");
    const result = await subscribeToNewsletter(formValues);

    if (!result.isSubscribed) {
      setStatus(result.isInvalidEmail ? "invalidEmail" : "failed");
      return;
    }

    setFormValues(EMPTY_SIGNUP);
    setStatus("subscribed");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={formStyles.label} htmlFor="newsletter-email">
        Subscribe to the newsletter
      </label>
      <div className={styles.row}>
        <input
          id="newsletter-email"
          className={`${formStyles.email} ${styles.field}`}
          type="email"
          name="email"
          autoComplete="email"
          value={formValues.email}
          onChange={handleInputChange}
        />
        <input
          className={`${formStyles.send} ${styles.button}`}
          type="submit"
          value={isLoading ? "Subscribing..." : "Subscribe"}
          disabled={isLoading}
        />
      </div>
      {/* The honeypot: off screen and out of the tab order, so only a bot fills it. */}
      <input
        className={styles.honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={formValues.website}
        onChange={handleInputChange}
      />

      <div aria-live="polite">
        {status === "subscribed" && (
          <p className={formStyles.required_error}>
            Thanks! Check your inbox to confirm your subscription.
          </p>
        )}
        {status === "invalidEmail" && (
          <p className={formStyles.required_error}>
            *Please enter a valid email
          </p>
        )}
        {status === "failed" && (
          <p className={formStyles.required_error}>
            *Couldn&apos;t subscribe this email. Please try again
          </p>
        )}
      </div>
    </form>
  );
}
