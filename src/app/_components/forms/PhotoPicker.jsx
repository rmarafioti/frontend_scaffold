// Scaffold element (with _lib/shrinkPhoto.js): the contact form's optional photo picker. The
// visitor adds jpg, png or webp photos one at a time, up to 3: at 3 the picker is disabled, since a
// file input can't cap how many files are picked at once. Each photo is shrunk in the browser to a
// 1600 px jpg as it is added (docs/cms/contact.md → Photos), and can be removed. A site that
// takes no photos deletes this file, shrinkPhoto.js and the <PhotoPicker> line in ContactForm.jsx.
"use client";

import { useRef, useState } from "react";

import { shrinkPhoto } from "@/app/_lib/shrinkPhoto";

import styles from "@/app/_styling/contact_form.module.css";

const MAX_PHOTOS = 3;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// onChange receives the shrunk photos, in the order they were added; onErrorChange receives the
// message for a file that couldn't be added, or null; onPreparingChange tells the form to hold
// its Send button while a photo is being shrunk.
export default function PhotoPicker({
  onChange,
  onErrorChange,
  onPreparingChange,
}) {
  // Each entry is { id, name, photo }: the id keys the list, the name is the visitor's file name.
  const [entries, setEntries] = useState([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const nextId = useRef(0);

  const isFull = entries.length >= MAX_PHOTOS;

  function updateEntries(nextEntries) {
    setEntries(nextEntries);
    onChange(nextEntries.map((entry) => entry.photo));
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    // Cleared at once, so the same file can be picked again after it is removed.
    event.target.value = "";
    if (!file) return;

    onErrorChange(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onErrorChange("Please pick a jpg, png or webp photo");
      return;
    }

    setIsPreparing(true);
    onPreparingChange(true);
    const photo = await shrinkPhoto(file, "photo.jpg");
    setIsPreparing(false);
    onPreparingChange(false);

    if (!photo) {
      onErrorChange("That photo couldn't be used. Please pick another");
      return;
    }

    nextId.current += 1;
    updateEntries([...entries, { id: nextId.current, name: file.name, photo }]);
  }

  function handleRemove(id) {
    onErrorChange(null);
    updateEntries(entries.filter((entry) => entry.id !== id));
  }

  return (
    <div>
      <label className={styles.label} htmlFor="contact-photos">
        Photos (optional, up to {MAX_PHOTOS})
      </label>
      <input
        id="contact-photos"
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        disabled={isFull || isPreparing}
        onChange={handleFileChange}
      />
      <div aria-live="polite">
        {isPreparing && <p>Preparing photo...</p>}
        {isFull && <p>{MAX_PHOTOS} photos added, the most you can send.</p>}
      </div>
      {entries.length > 0 && (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              {entry.name}{" "}
              <button
                type="button"
                onClick={() => handleRemove(entry.id)}
                aria-label={`Remove ${entry.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
