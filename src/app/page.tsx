'use client';

import { motion } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Network, Laptop } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f7fb] font-jost text-[#14181F] selection:bg-[#0b3579]/20 selection:text-[#14181F]">

      {/* ================= HERO (Image Background) ================= */}
      <section className="relative w-full overflow-hidden flex flex-col justify-center min-h-[85vh]">

        {/* Background Image & Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-image.png"
            alt="Solvetude Architecture"
            className="w-full h-full object-cover"
          />

          {/* Soft white overlay for navy text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative flex justify-center align-middle z-10 mx-auto max-w-7xl px-6 py-24 lg:py-40 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-light leading-[1.05] tracking-tight text-white mb-8 font-serif text-center italic">
              Architecting <br className="hidden md:block" />
              <span
                className="font-light text-[#224c90]"
                style={{
                  WebkitTextStroke: "1px #0b3579",
                }}
              >
                Growth Marketing.
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-white/80 font-light max-w-2xl mb-12 text-center">
              Join the core engineering teams building high-throughput microservices, real-time event synchronization, and multi-agent AI platforms.
            </p>

            <div className="flex justify-center w-full">
              <Link
                href="/careers"
                className="group relative inline-flex items-center justify-center bg-white px-10 py-3 rounded-full text-[12px] font-bold uppercase tracking-[0.2em] text-[#0f2953] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_-5px_rgba(20,24,31,0.2)] hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                  View Open Roles
                  <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-[#0f2953] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ENGINEERING CULTURE ================= */}
      <section className="bg-[#f4f7fb] pb-32 pt-10" id="culture" >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-24">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#0f2953] font-semibold flex items-center gap-3 mb-6">
              The Culture
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#14181F] leading-[1.1] font-serif">
              How we operate.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Item 1 */}
            <div className="group border-t border-[#14181F]/10 pt-10 transition-colors duration-500 hover:border-[#0b3579]/50">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-8 text-[#0f2953] shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Terminal size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-normal text-[#14181F] mb-4 tracking-tight">Modern Stack</h3>
              <p className="text-[15px] leading-relaxed text-[#565C6B] font-light mb-8">
                We build high-concurrency systems with Go for core microservices, Python for recommendation models, and Next.js for client interfaces. No legacy codebases.
              </p>
              <ul className="space-y-3 text-[13px] text-[#14181F]/60 font-medium tracking-wide">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> Next.js & React</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> Go & Python</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> ElasticSearch & Redis</li>
              </ul>
            </div>

            {/* Item 2 */}
            <div className="group border-t border-[#14181F]/10 pt-10 transition-colors duration-500 hover:border-[#0b3579]/50">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-8 text-[#0f2953] shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Network size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-normal text-[#14181F] mb-4 tracking-tight">AI-Native</h3>
              <p className="text-[15px] leading-relaxed text-[#565C6B] font-light mb-8">
                AI isn&apos;t a tacked-on feature; it is our core architecture. You will orchestrate multi-agent systems using the Gemini API, automating complex workflows.
              </p>
              <ul className="space-y-3 text-[13px] text-[#14181F]/60 font-medium tracking-wide">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> Gemini API Integration</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> Multi-Agent Orchestration</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> Automated Data Pipelines</li>
              </ul>
            </div>

            {/* Item 3 */}
            <div className="group border-t border-[#14181F]/10 pt-10 transition-colors duration-500 hover:border-[#0b3579]/50">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-8 text-[#0f2953] shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Laptop size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-normal text-[#14181F] mb-4 tracking-tight">Hardware & Growth</h3>
              <p className="text-[15px] leading-relaxed text-[#565C6B] font-light mb-8">
                We equip our engineers with the best tools. Receive an Apple Silicon workstation, AWS Solutions Architect sponsorship, and autonomy to design end-to-end.
              </p>
              <ul className="space-y-3 text-[13px] text-[#14181F]/60 font-medium tracking-wide">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> Apple Silicon Workstations</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> AWS Certification Support</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0b3579]/40 group-hover:bg-[#0b3579] transition-colors" /> End-to-End Ownership</li>
              </ul>
            </div>
          </div>
        </div>
      </section >

      {/* ================= THE STANDARD (Philosophy) ================= */}
      <section className="mx-auto max-w-7xl px-6 py-32 lg:py-40 bg-[#f4f7fb]" >
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
          {/* Sticky Left Column */}
          <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#0f2953] font-semibold flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#0b3579]" />
              The Standard
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#14181F] leading-[1.1] font-serif">
              Built for <br className="hidden lg:block" />
              <span className="text-[#14181F]/40">engineers,</span><br className="hidden lg:block" /> by engineers.
            </h2>
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:w-2/3 flex flex-col">
            {[
              { num: "01", title: "Scale at Speed", desc: "We don't do legacy. You will build with Next.js App Router, Turbopack, and the latest AI-native SDKs from day one." },
              { num: "02", title: "System Design First", desc: "Our leadership writes code. We prioritize clean architecture, strict typing, and handling distributed queues over vanity metrics." },
              { num: "03", title: "Global Deployments", desc: "Push architecture that scales across Dubai, Abu Dhabi, and beyond. Your code directly impacts high-tier enterprise clients." },
              { num: "04", title: "Radical Autonomy", desc: "Take ownership of entire microservices. From local Docker environments to AWS production pipelines, you control the deployment." }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="group flex flex-col md:flex-row gap-6 md:gap-12 py-14 border-t border-[#14181F]/5 first:border-0 first:pt-0"
              >
                <span className="font-light text-5xl md:text-6xl text-[#14181F]/5 group-hover:text-[#0f2953] transition-colors duration-500 shrink-0">
                  {item.num}
                </span>
                <div className="pt-2 group-hover:translate-x-2 transition-transform duration-500">
                  <h3 className="text-2xl font-normal text-[#14181F] mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-[16px] leading-relaxed text-[#565C6B] font-light max-w-lg">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ================= REFINED BOTTOM CTA ================= */}
      <section className="relative w-full overflow-hidden bg-[#0f2953]" >
        {/* Subtle dot matrix background */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 md:py-40 text-center flex flex-col items-center" >
          <div className="bg-[#0b3579]/10 border border-[#0b3579]/20 px-4 py-2 rounded-full mb-10 flex items-center gap-2">
            <Cpu size={14} className="text-white" strokeWidth={2} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white font-semibold">
              init_career()
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-[1.1] mb-8 font-serif">
            Ready to commit your best work?
          </h2>

          <p className="text-[16px] text-white/60 font-light max-w-lg mb-14 leading-relaxed">
            Our AI-driven application process analyzes your background instantly. No cover letters. No bureaucracy. Just your skills.
          </p>

          <Link
            href="/careers"
            className="group relative inline-flex items-center justify-center bg-white px-10 py-5 rounded-full text-[12px] uppercase tracking-[0.2em] font-bold text-[#0f2953] overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(20,24,31,0.2)] hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-3">
              Deploy Your Application
              <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-[#193f7c] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="absolute z-20 flex items-center gap-3 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              Deploy Your Application
              <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        </div >
      </section >

    </div >
  );
}