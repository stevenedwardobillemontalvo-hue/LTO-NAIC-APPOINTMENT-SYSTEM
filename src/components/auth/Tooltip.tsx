import { useEffect, useRef, useState } from "react";

export default function LTMSNumberTooltip() {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close tooltip pag click sa labas (mobile friendly)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="z-1 absolute right-2 top-1/2 -translate-y-1/2"
      onMouseEnter={() => setShow(true)} // desktop hover
      onMouseLeave={() => setShow(false)} // desktop hover out
    >
      <button
        type="button"
        onClick={() => setShow(prev => !prev)} // mobile click/tap
        className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 text-xs font-bold hover:bg-gray-100 active:bg-gray-200"
        aria-label="What is LTMS Number?"
      >
        ?
      </button>

      {show && (
        <div className="absolute right-0 top-7 z-50 w-72 bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
          An LTMS number refers to the LTO Client Number generated when
          registering for the Land Transportation Management System (LTMS) portal
          in the Philippines.
        </div>
      )}
    </div>
  );
}
