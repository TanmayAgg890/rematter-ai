import Link from "next/link"
import { Recycle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0B1713] text-[#F4F8F5] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight mb-3 focus-ring rounded">
              <div className="w-7 h-7 rounded-full bg-emerald-primary/20 flex items-center justify-center">
                <Recycle className="w-4 h-4 text-emerald-light" />
              </div>
              <span>ReMatter <span className="text-emerald-primary">AI</span></span>
            </Link>
            <p className="text-sm text-[#C0CEC5] leading-relaxed mb-4">
              Waste in. Possibilities out. Discover realistic reuse, repurpose, and verified recycling pathways tailored to your tools and goals.
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-[#18352A] border border-white/10 text-xs text-emerald-light font-medium">
              Circular Economy Platform
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-light mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-[#C0CEC5]">
              <li><Link href="/scan" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Start a Waste Scan</Link></li>
              <li><Link href="/explore" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Explore Materials</Link></li>
              <li><Link href="/recycling" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Recycling Facilities</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Personal Workspace</Link></li>
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-light mb-4">Circularity</h4>
            <ul className="space-y-2.5 text-sm text-[#C0CEC5]">
              <li><Link href="/#how-it-works" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">How It Works</Link></li>
              <li><Link href="/#feasibility" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Feasibility Scoring</Link></li>
              <li><Link href="/#responsible-recycling" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Safety-First Gates</Link></li>
              <li><Link href="/privacy" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Privacy & Data Policy</Link></li>
            </ul>
          </div>

          {/* Curation & Source Grounding */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-light mb-4">Verification</h4>
            <p className="text-xs text-[#C0CEC5] leading-relaxed mb-3">
              Facility directories are grounded in official CPCB (Central Pollution Control Board) and Producer Responsibility Organization (PRO) records.
            </p>
            <p className="text-xs text-[#C0CEC5] leading-relaxed">
              Deterministic scoring ensures safety cannot be overridden by cosmetic feasibility.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C0CEC5]">
          <div>
            © {new Date().getFullYear()} ReMatter AI. Built for the Circular Economy.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#F4F8F5] transition-colors focus-ring rounded">Privacy Notice</Link>
            <span>•</span>
            <span>Zero Hallucinated Facilities</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
