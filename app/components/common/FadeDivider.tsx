import React from "react";

const FadeDivider = () => {
  return (
    <div
      className="absolute top-3/4 right-0 bottom-0 left-0 z-10 w-full"
      style={{
        background: `linear-gradient(to bottom, transparent 0%, rgb(28, 28, 28) 100%)`,
      }}
    ></div>
  );
};

export default FadeDivider;
