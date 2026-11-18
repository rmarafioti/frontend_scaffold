// The contact form's success modal, shown after a message is sent. Closes with its close button,
// a click on the backdrop, or Escape.
"use client";

import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";

import { formPhoto } from "@/app/_data/photos";

import styles from "@/app/_styling/form_modal.module.css";

export default function FormModal({ isOpen, closeModal }) {
  if (!isOpen) return null;

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeModal();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") closeModal();
  }

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-heading"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.success_modal}>
        <div className={styles.copy_section}>
          <div>
            <h2 id="form-modal-heading" className={styles.heading}>
              Message Sent!
            </h2>
            <p className={styles.message}>We will be in touch soon.</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Close"
            autoFocus
          >
            <IoCloseOutline aria-hidden="true" />
          </button>
        </div>
        <Image
          src={formPhoto.src}
          alt={formPhoto.alt}
          width={formPhoto.width}
          height={formPhoto.height}
          className={styles.form_photo}
        />
      </div>
    </div>
  );
}
