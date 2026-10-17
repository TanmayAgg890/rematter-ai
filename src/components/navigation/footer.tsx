import Link from "next/link"
import { Recycle, Heart, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-forest text-ivory border-t border-forest-700/60 pt-16 pb-12">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight mb-3">
              <div className="w-7 h-7 rounded-full bg-leaf-green/30 flex items-center justify-center">
                <Recycle className="w-4 h-4 text-lime-fresh" />
              </div>
              <span>ReMatter <span className="text-lime-fresh">AI</span></span>
            </Link>
            <p className="text-sm text-ivory/70 leading-relaxed mb-4">
              Waste in. Possibilities out. Discover realistic reuse, repurpose, and verified recycling pathways tailored to your tools and goals.
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-forest-700/60 text-xs text-lime-fresh font-medium">
              Hackathon Edition v2.1
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lime-fresh mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-ivory/80">
              <li><Link href="/scan" className="hover:text-lime-fresh transition-colors">Start a Waste Scan</Link></li>
              <li><Link href="/explore" className="hover:text-lime-fresh transition-colors">Explore Possibilities</Link></li>
              <li><Link href="/recycling" className="hover:text-lime-fresh transition-colors">Recycling Facilities</Link></li>
              <li><Link href="/dashboard" className="hover:text-lime-fresh transition-colors">Project Dashboard</Link></li>
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lime-fresh mb-4">Circularity</h4>
            <ul className="space-y-2.5 text-sm text-ivory/80">
              <li><Link href="/#feasibility" className="hover:text-lime-fresh transition-colors">Feasibility Scoring</Link></li>
              <li><Link href="/#three-levels" className="hover:text-lime-fresh transition-colors">Three-Level System</Link></li>
              <li><Link href="/#responsible-recycling" className="hover:text-lime-fresh transition-colors">Safety-First Gates</Link></li>
              <li><Link href="/privacy" className="hover:text-lime-fresh transition-colors">Privacy & Data Policy</Link></li>
            </ul>
          </div>

          {/* Technology & Attribution */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-lime-fresh mb-4">Attribution</h4>
            <p className="text-xs text-ivory/60 leading-relaxed mb-3">
              Sculpture Hero engine created by{" "}
              <a
                href="https://guglielmogiannattasio.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-fresh hover:underline inline-flex items-center gap-1"
              >
                guglielmogiannattasio.it <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <p className="text-xs text-ivory/60 leading-relaxed">
              Recycling facility records grounded in official CPCB (Central Pollution Control Board) & PRO directories.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-700/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <div>
            © {new Date().getFullYear()} ReMatter AI. Built with care for a circular planet.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ivory transition-colors">Privacy Notice</Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Zero fake statistics <Heart className="w-3 h-3 text-lime-fresh fill-lime-fresh" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
