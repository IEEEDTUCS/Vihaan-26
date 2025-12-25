export default function FunkyButton({ text, variant = "primary" }) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      className={`
        px-6
        py-2
        rounded-lg
        border
        text-[13px]
        tracking-[0.25em]
        font-medium
        uppercase
        bg-transparent
        transition-colors
        duration-200
        ${
          isPrimary
            ? "border-white text-white hover:bg-white hover:text-black"
            : "border-[#C2FF4A] text-[#C2FF4A] hover:bg-[#678f16] hover:text-black"
        }
      `}
    >
      {text}
    </button>
  );
}
