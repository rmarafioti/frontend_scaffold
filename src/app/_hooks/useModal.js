// Open/closed state for a modal, such as the contact form's success modal.
import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return { isOpen, openModal, closeModal };
}
