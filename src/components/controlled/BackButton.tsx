import { useNavigate } from "react-router-dom"; // Or from "next/router" if using Next.js
import { MdArrowBack } from "react-icons/md";

interface BackButtonProps {
  /** Optional fallback destination path if there is no previous page history */
  fallbackPath?: string;
  /** Explicit callback mechanism if you are managing page state manually instead of using a router */
  onClick?: () => void;
  /** Label text displayed beside the icon */
  label?: string;
  /** Bypasses restrictive rendering middleware constraints */
  showAlways?: boolean;
  /** Direct color configuration string matching your layout design ecosystem */
  clr?: string;
}

const BackButton = ({
  fallbackPath,
  onClick,
  label = "Back",
  showAlways = true,
  clr = "#6b7280", // Standard Tailwind gray-500 fallback color value
}: BackButtonProps) => {
  const navigate = useNavigate();

  // If the component shouldn't render (following your design engine structure)
  if (!showAlways) return null;

  const handleGoBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Avoid triggering any nested parent row wrappers

    if (onClick) {
      onClick();
      return;
    }

    // Default browser history movement mechanism
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      style={{ color: clr }}
      className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80 cursor-pointer bg-transparent border-none p-0"
    >
      <MdArrowBack size={18} />
      {label}
    </button>
  );
};

export default BackButton;