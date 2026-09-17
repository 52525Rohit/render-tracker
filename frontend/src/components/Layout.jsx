import { Link } from "react-router-dom";
import { Aperture } from "lucide-react";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-[100] border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm">
            <Aperture size={18} />
          </div>
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-gray-900 hover:text-sky-600 transition-colors"
          >
            Render Time Calculator
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

export default Layout;
