// Scaffold element: state for a photo gallery modal (which photo is shown, open/closed, next and
// previous, wrapping around at either end). Takes the site's own photos from _data/.
import { useState } from "react";

export function usePhotoGallery(photos) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const currentImageObj = photos[currentIndex];

  function openModal(index) {
    setCurrentIndex(index);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }

  function handlePrev() {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }

  return {
    handleNext,
    handlePrev,
    openModal,
    closeModal,
    currentImageObj,
    currentIndex,
    isOpen,
    photos,
  };
}
