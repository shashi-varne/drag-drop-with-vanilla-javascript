import React, { createRef, useEffect, useRef } from "react";
import Note from "./note";

function Notes({ notes = [], setNotes = () => {} }) {
  const noteRefs = useRef([]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((n) => n.id === note.id);
      if (savedNote) {
        //use the same note from local storage because we don't want to change it's position
        return savedNote;
      } else {
        //rendering a note for the first time
        const position = determinteNewNotePosition();
        return { ...note, position };
      }
    });
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, [notes.length]);

  const determinteNewNotePosition = () => {
    const max_X = window.innerWidth - 250; //assuming the size of each note is 250px
    const max_Y = window.innerHeight - 250;
    return {
      x: Math.floor(Math.random() * max_X),
      y: Math.floor(Math.random() * max_Y),
    };
  };

  const handleDragStart = (note, e) => {
    const currentNoteRef = noteRefs?.current[note.id]?.current;
    const rect = currentNoteRef?.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const startPos = note.position;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      currentNoteRef.style.left = `${newX}px`;
      currentNoteRef.style.top = `${newY}px`;
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = currentNoteRef.getBoundingClientRect();
      const newPosition = { x: finalRect.left, y: finalRect.top };

      if (checkIfOverlapping(note.id)) {
        //overlapping notes
        currentNoteRef.style.left = `${startPos.x}px`;
        currentNoteRef.style.top = `${startPos.y}px`;
      } else {
        updateNotePosition(note.id, newPosition);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const checkIfOverlapping = (id) => {
    const currentNoteRef = noteRefs?.current[id]?.current;
    const currentRect = currentNoteRef?.getBoundingClientRect();
    return notes.some((note) => {
      if (note.id === id) return false;
      const otherNoteRef = noteRefs?.current[note.id]?.current;
      const otherRect = otherNoteRef.getBoundingClientRect();
      const isOverlapping =
        currentRect.right < otherRect.left ||
        currentRect.left > otherRect.right ||
        currentRect.bottom < otherRect.top ||
        currentRect.top > otherRect.bottom;

      return !isOverlapping;
    });
  };

  const updateNotePosition = (id, newPosition) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, position: newPosition } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div>
      {notes.map((note, i) => {
        return (
          <Note
            key={i}
            initialPosition={note.position}
            content={note.text}
            ref={
              noteRefs.current[note.id]
                ? noteRefs.current[note.id]
                : (noteRefs.current[note.id] = createRef())
            }
            onMouseDown={(e) => handleDragStart(note, e)}
          />
        );
      })}
    </div>
  );
}

export default Notes;
