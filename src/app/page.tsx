'use client';

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Globe, Zap, Briefcase } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f7fb] font-jost text-[#14181F] selection:bg-[#0b3579]/30 selection:text-white">
      {/* ================= HERO (Cinematic & Editorial) ================= */}
      <section className="relative w-full overflow-hidden flex flex-col justify-center min-h-[95vh]">

        {/* Animated Ambient Background */}
        <div className="absolute inset-0 z-0 bg-[#0f2953]/80">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src="/hero-image.png"
            alt="Solvetude Global Enterprise"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          {/* Elegant gradient fade to ground the text */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0f2953] via-transparent to-transparent opacity-90" />
        </div>

        {/* Hero Content */}
        <div className="relative flex justify-center align-middle z-10 mx-auto max-w-7xl px-6 py-24 lg:py-40 w-full mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Premium Pill */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-[#4676c8] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white">
                Careers at Solvetude
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-light leading-[1.05] tracking-tight text-white mb-8 font-serif">
              Do your life&apos;s <br className="hidden md:block" />
              <span className="font-serif text-[#699af0]" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}>
                greatest work.
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-white/70 font-light max-w-2xl mx-auto mb-14">
              Join a global collective of strategists, creatives, operators, and technologists building the next generation of enterprise solutions.
            </p>

            <div className="flex justify-center w-full">
              <Link
                href="/careers"
                className="group relative inline-flex items-center justify-center bg-white px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-[#0b3579] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_-5px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                  Explore Opportunities
                  <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-[#0b3579] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= COMPANY CULTURE (Cross-Functional DNA) ================= */}
      <section className="bg-[#f4f7fb] py-32" id="culture">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mb-24">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#0b3579] font-semibold flex items-center gap-3 mb-6">
              Our DNA
            </span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[#14181F] leading-[1.1] font-serif">
              An ecosystem of <span className="text-[#0b3579]  font-serif">excellence.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="group bg-white p-10 md:p-12 rounded-4xl border border-[#14181F]/3 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(11,53,121,0.1)] hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-[#f4f7fb] flex items-center justify-center mb-8 text-[#0b3579] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#0b3579] group-hover:text-white">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-light text-[#14181F] mb-4 tracking-tight font-serif">Obsessive Craft</h3>
              <p className="text-[15px] leading-relaxed text-[#565C6B] font-light">
                Whether drafting a marketing narrative, designing a UI, closing a deal, or architecting a database, we treat every deliverable as a masterclass in precision.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group bg-white p-10 md:p-12 rounded-4xl border border-[#14181F]/3 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(11,53,121,0.1)] hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-[#f4f7fb] flex items-center justify-center mb-8 text-[#0b3579] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#0b3579] group-hover:text-white">
                <Zap size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-light text-[#14181F] mb-4 tracking-tight font-serif">AI-Empowered</h3>
              <p className="text-[15px] leading-relaxed text-[#565C6B] font-light">
                AI isn&apos;t just for engineers. From HR to Sales, our entire workforce leverages intelligent agents to eliminate busywork and amplify strategic thinking.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-white p-10 md:p-12 rounded-4xl border border-[#14181F]/3 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(11,53,121,0.1)] hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-[#f4f7fb] flex items-center justify-center mb-8 text-[#0b3579] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#0b3579] group-hover:text-white">
                <Globe size={22} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-light text-[#14181F] mb-4 tracking-tight font-serif">Global Canvas</h3>
              <p className="text-[15px] leading-relaxed text-[#565C6B] font-light">
                Operate on a global stage. The strategies you devise and the systems you build will directly impact top-tier enterprise clients across international markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE STANDARD (Universal Philosophy) ================= */}
      <section className="mx-auto max-w-7xl px-6 py-32 lg:py-40 bg-[#f4f7fb]">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">

          {/* Sticky Left Column */}
          <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#0b3579] font-semibold flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#0b3579]" />
              The Standard
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#14181F] leading-[1.1] font-serif">
              Built for <br className="hidden lg:block" />
              <span className="text-[#14181F]/30  font-serif">visionaries,</span><br className="hidden lg:block" /> driven by impact.
            </h2>
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:w-2/3 flex flex-col">
            {[
              { num: "01", title: "Execution Over Ideation", desc: "Ideas are cheap; execution is everything. We value individuals who can take a concept from a whiteboard to a measurable, market-ready outcome." },
              { num: "02", title: "Cross-Disciplinary Empathy", desc: "Silos don't exist here. Marketers understand product, engineers understand design, and everyone understands the ultimate goal: the user." },
              { num: "03", title: "Meritocratic Growth", desc: "Your career trajectory is dictated by your output, not your tenure. We actively sponsor learning, certifications, and leadership pathways." },
              { num: "04", title: "Radical Autonomy", desc: "We hire adults and treat them as such. You will have the freedom to design your workflow, test hypotheses, and own your successes and failures." }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="group flex flex-col md:flex-row gap-6 md:gap-12 py-14 border-t border-[#14181F]/10 first:border-0 first:pt-0"
              >
                <span className="font-light text-5xl md:text-6xl text-[#14181F]/10 group-hover:text-[#0b3579] transition-colors duration-500 shrink-0 font-serif">
                  {item.num}
                </span>
                <div className="pt-2 group-hover:translate-x-4 transition-transform duration-500">
                  <h3 className="text-2xl font-normal text-[#14181F] mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-[16px] leading-relaxed text-[#565C6B] font-light max-w-lg">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REFINED BOTTOM CTA ================= */}
      <section className="relative w-full overflow-hidden bg-[#0f2953] rounded-t-[40px] md:rounded-t-[80px]">
        {/* Subtle geometric background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 md:py-48 text-center flex flex-col items-center">
          <div className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10 flex items-center gap-3 shadow-lg backdrop-blur-sm">
            <Briefcase size={14} className="text-[#699af0]" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white font-semibold">
              Open Opportunities
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight leading-[1.05] mb-8 font-serif">
            Ready to shape <br className="hidden md:block" /> the <span className="text-[#699af0]  font-serif">future?</span>
          </h2>

          <p className="text-[17px] text-white/60 font-light max-w-xl mb-14 leading-relaxed">
            Discover roles across Engineering, Product, Marketing, and Operations. Bring your expertise to a team that demands nothing but your best.
          </p>

          <Link
            href="/careers"
            className="group relative inline-flex items-center justify-center bg-white px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold text-[#0b3579] overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.25)] hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-3">
              View All Openings
              <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-[#0b3579] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute z-20 flex items-center gap-3 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              View All Openings
              <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

