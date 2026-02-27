// src/components/BackgroundOrbs.jsx
import { motion } from "framer-motion";

function Orb({ className, duration }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 0.7, scale: 1.1, y: [0, -40, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}

function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)]" />
      <Orb
        duration={16}
        className="absolute -top-24 -left-16 h-72 w-72 bg-accent/30 rounded-full blur-3xl mix-blend-screen"
      />
      <Orb
        duration={20}
        className="absolute top-1/3 -right-24 h-80 w-80 bg-cyan-500/30 rounded-full blur-3xl mix-blend-screen"
      />
      <Orb
        duration={18}
        className="absolute bottom-[-120px] left-1/4 h-72 w-72 bg-emerald-500/25 rounded-full blur-3xl mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
    </div>
  );
}

export default BackgroundOrbs;
