import React, { forwardRef } from "react";

function Note({ content, initialPosition, ...props }, ref) {
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${initialPosition?.x}px`,
        top: `${initialPosition?.y}px`,
        border: "1px solid black",
        userSelect: "none",
        padding: 10,
        cursor: "move",
        backgroundColor: "beige",
      }}
      {...props}
    >
      📌{content}
    </div>
  );
}

export default forwardRef(Note);
