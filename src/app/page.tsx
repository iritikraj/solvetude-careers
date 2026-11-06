'use client';

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Heart, Laptop, Users, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen font-sans text-[#111111] selection:bg-[#0b3579] selection:text-white">

      <section className="relative isolate min-h-screen md:min-h-screen w-full flex flex-col justify-center px-6 lg:px-12 pb-0 overflow-hidden">

        {/* Next.js Image Component - Anchored strictly to the bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 w-full h-full"
        >
          <Image
            src="/solvetude-careers.png"
            alt="Solvetude Careers"
            fill
            priority
            className="object-contain object-bottom md:pb-20 pb-20 md:object-bottom-right"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-350 mx-auto w-full">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h1 className="text-[18vw] md:text-[8vw] font-serif lg:text-[7vw] leading-none tracking-normal text-[#111111] mb-6 mt-20 md:mt-0">
              Bring your <br />
              <span className="text-[#0b3579]">passion.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="justify-between gap-10 mt-12"
          >
            <p className="text-xl md:text-2xl text-[#666666] font-medium max-w-xl leading-relaxed">
              We provide the stage, the technology, and the team.
              You bring the drive to build something that actually matters.
            </p>
            <Link
              href="/careers"
              className="group flex items-center mt-12 md:mt-20 justify-center gap-4 bg-[#111111] text-white px-5 md:px-10 py-2.5 md:py-5 rounded-full text-sm md:font-bold uppercase tracking-widest hover:bg-[#0b3579] transition-all duration-300 w-fit shrink-0 mb-32 md:mb-0"
            >
              See Open Roles
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ================= 3. LIFE AT THE COMPANY (Bento Box Grid - Apple Style) ================= */}
      <section className="pb-32 pt-24 px-6 lg:px-12 max-w-350 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-16"
        >
          Life at Solvetude.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-80">

          {/* Card 1: Wide Image/Video Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 bg-[#F3F4F6] rounded-4xl p-10 flex flex-col justify-end relative overflow-hidden group"
          >
            {/* Placeholder for real office photo */}
            <div className="absolute inset-0 bg-[#E5E7EB] transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            <div className="relative z-10 text-white">
              <h3 className="text-3xl font-bold mb-2">Autonomy by Default</h3>
              <p className="text-white/80 font-medium text-lg">We don&apos;t micromanage. We hire brilliant people and get out of their way.</p>
            </div>
          </motion.div>

          {/* Card 2: Wellness/Perks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
            className="bg-[#0b3579] rounded-4xl p-10 text-white flex flex-col justify-between"
          >
            <Heart size={32} className="text-pink-400" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Total Wellness</h3>
              <p className="text-white/70 font-medium">Premium health coverage, mental health days, and flexible schedules.</p>
            </div>
          </motion.div>

          {/* Card 3: Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-4xl p-10 flex flex-col justify-between shadow-sm"
          >
            <Laptop size={32} className="text-[#0b3579]" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Best-in-Class Gear</h3>
              <p className="text-gray-500 font-medium">Apple Silicon, ultrawide monitors, and the budget to build your perfect setup.</p>
            </div>
          </motion.div>

          {/* Card 4: Wide Culture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 bg-linear-to-br from-[#111111] to-[#333333] rounded-4xl p-10 flex flex-col justify-between text-white"
          >
            <Users size={32} className="text-white/50" />
            <div>
              <h3 className="text-3xl font-bold mb-2">Radical Inclusion</h3>
              <p className="text-white/70 font-medium text-lg max-w-xl">Diverse teams build better products. We are actively fostering an environment where every voice shapes our roadmap.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= 4. GLOBAL HUBS (Dynamic Typography) ================= */}
      <section className="py-32 text-[#111111]">
        <div className="max-w-350 mx-auto px-6 lg:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
              Where we <br /><span className="text-[#0b3579]">operate.</span>
            </h2>
            <p className="text-white/60 font-medium max-w-sm text-lg">
              Our teams are distributed across major tech hubs. Work where you feel most inspired.
            </p>
          </div>

          <div className="border-t border-white/10">
            {/* Hub Row 1 */}
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/10 hover:px-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-6">
                <MapPin size={24} className="text-black/20 group-hover:text-[#0b3579] transition-colors" />
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Abu Dhabi, UAE</h3>
              </div>
              <span className="mt-4 md:mt-0 text-black/40 font-medium">Headquarter</span>
            </div>

            {/* Hub Row 3 */}
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/10 hover:px-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-6">
                <MapPin size={24} className="text-black/20 group-hover:text-[#0b3579] transition-colors" />
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Remote</h3>
              </div>
              <span className="mt-4 md:mt-0 text-black/40 font-medium">Global Talent</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#0b3579] text-white pt-32 pb-16 px-4 md:px-8 mt-20 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-350 mx-auto flex flex-col items-center text-center">
          <h2 className="text-[12vw] md:text-7xl font-black tracking-tighter uppercase leading-none mb-12">
            Ready to <br />
            <span className="text-white/70">Apply?</span>
          </h2>

          <Link href="/careers" className="group flex items-center gap-4 bg-black text-white px-10 py-6 rounded-full text-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300 ease-out mb-24">
            View All Jobs
            <MoveRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}