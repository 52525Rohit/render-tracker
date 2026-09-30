import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Toaster } from "react-hot-toast";

function Modal({ id, title, children }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  // showModal() bahar se call hota hai, isliye `open` attribute observe karte hain
  useEffect(() => {
    const el = ref.current;
    const obs = new MutationObserver(() => setOpen(el.open));
    obs.observe(el, { attributes: true, attributeFilter: ["open"] });
    return () => obs.disconnect();
  }, []);

  return (
    <dialog
      ref={ref}
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
      {/* dialog top layer mein hota hai, isliye open hone par toasts yahin render hote hain.
          Sirf open par mount — band dialog (display:none) toast height 0 kar deta hai aur toast chhup jaata hai */}
      {open && <Toaster />}
    </dialog>
  );
}

export default Modal;
