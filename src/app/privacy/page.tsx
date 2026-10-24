"use client"

import Link from "next/link"
import { ShieldCheck, Lock, Trash2, ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-platinum hover:text-lavender-accent transition-colors mb-4 focus-ring rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl font-display font-semibold text-[#F5F3F3] mb-2">
          Privacy & Data Retention Notice
        </h1>
        <p className="text-platinum text-sm">
          Last updated: October 2026 • Plain language commitment
        </p>
      </div>

      <div className="bg-[#211D1C]/80 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-sm space-y-8 text-sm leading-relaxed text-platinum">
        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-lavender-accent" />
            <span>1. What We Collect and Process</span>
          </h2>
          <p className="mb-2">
            ReMatter AI processes user-provided inputs strictly to deliver circular upcycling and recycling recommendations:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Photos of waste items:</strong> Analyzed ephemerally via vision models to assess material category, visible condition, and recycling marks.</li>
            <li><strong>Text descriptions:</strong> Item details, quantities, and user constraints (skills, tools, budget, time).</li>
            <li><strong>Optional geolocation:</strong> Requested only when you explicitly click "Use My Location" in the recycling center locator.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lavender-accent" />
            <span>2. Zero Training on User Uploads</span>
          </h2>
          <p>
            Your images and personal project inputs are <strong>never</strong> used to train public or foundation AI models. Third-party inference calls through the Gemini API occur securely with ephemeral processing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-lavender-accent" />
            <span>3. Guest Storage & Instant Deletion</span>
          </h2>
          <p className="mb-2">
            By default, your scan and preferences reside in your browser's local session storage. You have complete control to wipe this data at any moment:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Clicking "Delete Scan" in your Dashboard immediately purges all current scan records and cached previews.</li>
            <li>Signed-in accounts can delete saved ideas or account history at any time with cascading deletion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lavender-accent" />
            <span>4. CPCB & PRO Certified Hubs</span>
          </h2>
          <p>
            Recycling facility coordinates and contact numbers are verified against official regulatory registries. We do not sell user data to commercial recyclers or brokers.
          </p>
        </section>
      </div>
    </div>
  )
}
