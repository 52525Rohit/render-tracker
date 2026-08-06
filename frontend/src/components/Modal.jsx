import { X } from "lucide-react";

function Modal({ id, title, children }) {
  return (
    <dialog
      id={id}
      className="m-auto w-full max-w-lg rounded-2xl border border-gray-100 p-0 shadow-2xl backdrop:bg-gray-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6">
        <form method="dialog">
          <button
            type="submit"
            className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </form>
        {title && (
          <h2 className="mb-5 pr-8 text-lg font-semibold text-gray-900">
            {title}
          </h2>
        )}
        {children}
      </div>
    </dialog>
  );
}

export default Modal;
