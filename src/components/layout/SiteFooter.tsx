import { Link } from "react-router-dom";
import humanaLogo from "../../assets/humana.png";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#09110A] text-neutral-400 border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Corporate Info */}
          <div className="lg:col-span-6 space-y-6">
            <Link to="/" className="inline-block" aria-label="Humana Home">
              <img
                src={humanaLogo}
                alt="Humana"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Connecting compassionate clinical, technology, and operational
              professionals with transformative healthcare careers.
            </p>

            {/* Address & Contact with proper label spacing */}
            <div className="pt-2 text-xs text-neutral-400 leading-relaxed space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-200 tracking-wider uppercase">
                  Corporate Headquarters
                </p>
                <p className="mt-2 text-neutral-400">
                  500 West Main Street, Louisville, KY 40202
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-200 tracking-wider uppercase">
                  Build Your Career @ Humana
                </p>
                <p className="mt-2">
                  <a
                    href="mailto:buildyourcareer@humana.com"
                    className="text-neutral-300 hover:text-white transition-colors hover:underline underline-offset-2"
                  >
                    buildyourcareer@humana.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Column 1: Careers */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Careers & Pathways
            </p>
            <ul className="mt-6 space-y-3.5 text-sm">
              <li>
                <Link
                  to="/benefits"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5 font-medium text-emerald-400/90"
                >
                  Benefits & Total Rewards
                </Link>
              </li>
              <li>
                <a
                  href="/#opportunities"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Explore Open Roles
                </a>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Direct Application
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  About Humana
                </Link>
              </li>
              <li>
                <a
                  href="/#opportunities"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Clinical & Nursing
                </a>
              </li>
              <li>
                <a
                  href="/#opportunities"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Technology & Health Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Trust & Compliance */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Trust & Legal
            </p>
            <ul className="mt-6 space-y-3.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Equal Opportunity Employer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Accessibility Standards
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Data Protection & Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors block py-0.5"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {year} Humana Inc. All rights reserved.</p>
          <p className="text-center sm:text-right">
            500 West Main Street, Louisville, KY 40202 · Equal Opportunity Employer
          </p>
        </div>
      </div>
    </footer>
  );
}
