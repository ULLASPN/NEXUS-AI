import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import {
  ANALYTICS,
  INITIAL_FEED,
  NEW_THREATS,
  AI_MESSAGES,
  CITIES,
  ATTACK_PAIRS,
  SYSTEM_STATUS
} from './data';

// --- Helper Components ---

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="cursor-dot"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})` }}
      />
      <div
        className="cursor-ring"
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})` }}
      />
      <div
        className="mouse-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
    </>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex items-center justify-between backdrop-blur-md border-b border-cyan-500/10 bg-cyber-bg/40">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 group cursor-pointer hover:bg-cyan-500/40 transition-all">
        <span className="text-cyan-400 font-bold text-xl group-hover:scale-110 transition-transform">N</span>
      </div>
      <div>
        <h1 className="text-xl font-orbitron font-bold tracking-wider gradient-text uppercase">Nexus AI</h1>
        <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.2em]">Cyber Defense System v4.0.2</p>
      </div>
    </div>

    <div className="hidden md:flex items-center gap-8">
      {['Dashboard', 'Threat Intel', 'Network', 'AI Matrix', 'Logs'].map((item, idx) => (
        <a key={item} href="#" className={`nav-link ${idx === 0 ? 'active' : ''}`}>{item}</a>
      ))}
    </div>

    <div className="flex items-center gap-6">
      <div className="status-badge online">
        <span className="status-dot green"></span>
        SYSTEM SECURE
      </div>
      <div className="w-10 h-10 rounded-full border border-cyan-500/20 overflow-hidden cursor-pointer hover:border-cyan-400 transition-colors">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
      </div>
    </div>
  </nav>
);

const ThreatMap = () => {
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pair = ATTACK_PAIRS[Math.floor(Math.random() * ATTACK_PAIRS.length)];
      const from = CITIES[pair[0]];
      const to = CITIES[pair[1]];
      const id = Math.random().toString(36).substr(2, 9);
      setAttacks(prev => [...prev.slice(-10), { id, from, to }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl border border-cyan-500/10 bg-cyber-bg/20 backdrop-blur-sm group">
      <div className="absolute top-4 left-6 z-10">
        <h3 className="section-label">Global Threat Matrix</h3>
        <p className="text-xs font-mono text-cyan-500/40 mt-1 uppercase tracking-widest">Real-time Visualization</p>
      </div>
      <svg viewBox="0 0 1000 500" className="w-full h-full opacity-60">
        {/* Simple World Map Path (Abstracted) */}
        <path d="M150,100 Q200,80 250,100 T350,120 T450,100 T550,130 T650,110 T750,140 T850,120" fill="none" stroke="rgba(14, 165, 233, 0.05)" strokeWidth="1" />
        {/* Nodes */}
        {CITIES.map((city, idx) => (
          <g key={idx}>
            <circle cx={city.x} cy={city.y} r="2" className="fill-cyan-500/40" />
            <circle cx={city.x} cy={city.y} r="4" className="fill-cyan-500/20 map-node" />
          </g>
        ))}
        {/* Attack Lines */}
        <AnimatePresence>
          {attacks.map((attack) => {
            const midX = (attack.from.x + attack.to.x) / 2;
            const midY = Math.min(attack.from.y, attack.to.y) - 50;
            return (
              <motion.path
                key={attack.id}
                d={`M${attack.from.x},${attack.from.y} Q${midX},${midY} ${attack.to.x},${attack.to.y}`}
                fill="none"
                stroke="url(#attackGradient)"
                strokeWidth="2"
                className="attack-line"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            );
          })}
        </AnimatePresence>
        <defs>
          <linearGradient id="attackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const AIOrb = () => {
  const [currentMessage, setCurrentMessage] = useState(AI_MESSAGES[0]);
  const orbRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <div className="relative group">
        {/* Glowing Rings */}
        <div className="absolute inset-0 ring-rotate rounded-full border border-cyan-500/30 scale-125"></div>
        <div className="absolute inset-0 ring-rotate-reverse rounded-full border border-purple-500/20 scale-150"></div>
        <div className="absolute inset-0 ring-rotate-fast rounded-full border-t-2 border-cyan-400/40 scale-110"></div>
        {/* Core Orb */}
        <div
          ref={orbRef}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 orb-pulse flex items-center justify-center overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <div className="w-16 h-1 bg-cyan-400/80 shadow-[0_0_15px_#22d3ee] rounded-full animate-spin-slow"></div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md p-6 glass-card border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">AI Strategic Advisor</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-medium text-slate-200 leading-relaxed italic"
          >
            "{currentMessage}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ label, value, suffix, color, icon, trend, trendUp }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-cyber-dark/50 border border-white/5 text-xl">
          {icon}
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">{label}</h4>
        <div className="flex items-baseline gap-1">
          <span className="counter-value text-2xl" style={{ color }}>
            {displayValue.toLocaleString(undefined, { maximumFractionDigits: suffix === '%' ? 1 : 0 })}
          </span>
          <span className="text-xs font-orbitron font-medium opacity-60">{suffix}</span>
        </div>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.random() * 40 + 60}%` }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </div>
  );
};

const AttackFeed = () => {
  const [feed, setFeed] = useState(INITIAL_FEED);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat = NEW_THREATS[Math.floor(Math.random() * NEW_THREATS.length)];
      const now = new Date();
      const time = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0') + ':' +
        now.getSeconds().toString().padStart(2, '0');
      const item = {
        id: Math.random(),
        time,
        type: Math.random() > 0.7 ? 'CRITICAL' : (Math.random() > 0.4 ? 'WARNING' : 'INFO'),
        src: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        ...newThreat
      };
      setFeed(prev => [item, ...prev.slice(0, 7)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-label">Live Threat Decryption</h3>
          <p className="text-[10px] font-mono text-cyan-500/40 mt-1 uppercase tracking-widest">Passive Interception Active</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden">
        <AnimatePresence initial={false}>
          {feed.map((item) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className={`feed-item p-3 rounded-lg flex flex-col gap-1 text-[11px] font-mono border border-white/5 ${
                item.type === 'CRITICAL' ? 'critical bg-red-500/5' : item.type === 'WARNING' ? 'warning bg-amber-500/5' : 'info bg-cyan-500/5'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={item.type === 'CRITICAL' ? 'text-red-400' : item.type === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'}>
                  [{item.type}]
                </span>
                <span className="text-slate-500">{item.time}</span>
              </div>
              <div className="flex gap-2 items-center text-slate-300">
                <span className="text-white font-bold">{item.src}</span>
                <span className="text-slate-600">→</span>
                <span>{item.attack}</span>
              </div>
              <div className="flex gap-3 text-slate-500 text-[10px]">
                <span>DEST: {item.dstCountry || 'LOCAL'}</span>
                <span>PROTO: {item.proto}</span>
                <span>PORT: {item.port}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
        <button className="text-[10px] font-orbitron text-cyan-500 hover:text-cyan-400 tracking-widest uppercase transition-colors">View All Archive</button>
      </div>
    </div>
  );
};

// Parallax wrapper for background layers
const ParallaxWrapper = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handle = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  useEffect(() => {
    const layers = document.querySelectorAll('.parallax-layer');
    const unsubX = mouseX.onChange((x) => {
      layers.forEach((el) => {
        const depth = parseFloat(el.dataset.depth) || 0;
        el.style.transform = `translate(${x * depth * 20}px, ${mouseY.get() * depth * 20}px)`;
      });
    });
    const unsubY = mouseY.onChange((y) => {
      layers.forEach((el) => {
        const depth = parseFloat(el.dataset.depth) || 0;
        el.style.transform = `translate(${mouseX.get() * depth * 20}px, ${y * depth * 20}px)`;
      });
    });
    return () => { unsubX(); unsubY(); };
  }, [mouseX, mouseY]);

  return <>{children}</>;
};

const App = () => {
  return (
    <ParallaxWrapper>
      <div className="min-h-screen w-full relative bg-cyber-bg selection:bg-cyan-500/30">
        <CustomCursor />
        {/* Background FX */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-20 parallax-layer" data-depth="0.02"></div>
          <div className="absolute inset-0 scanline-overlay parallax-layer" data-depth="0.04"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-purple-500/10 parallax-layer" data-depth="0.06"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle bg-cyan-500/20"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 12 + 8}s`,
                animationDelay: `${Math.random() * 8}s`,
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.4)'
              }}
            />
          ))}
        </div>
        <Navbar />
        {/* Ambient sound button */}
        <audio id="ambient-sound" loop preload="auto" src="/src/assets/ambient.mp3" volume="0.2"></audio>
        <button className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/30 transition-colors" onClick={() => { const a=document.getElementById('ambient-sound'); a.paused ? a.play() : a.pause(); }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
        </button>
        <main className="relative z-10 pt-32 pb-16 px-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-8 h-full">
          {/* Left Column: Analytics & Stats */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {ANALYTICS.map((stat) => (
                <AnalyticsCard key={stat.id} {...stat} />
              ))}
            </div>
            {/* System Health Block */}
            <div className="glass-card p-6">
              <h3 className="section-label mb-6">Subsystem Integrity</h3>
              <div className="space-y-4">
                {SYSTEM_STATUS.map((sys) => (
                  <div key={sys.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                      <span className="text-slate-400">{sys.label}</span>
                      <span style={{ color: sys.color }}>{sys.value}%</span>
                    </div>
                    <div className="progress-bar bg-white/5">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: sys.color, boxShadow: `0 0 8px ${sys.color}44` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sys.value}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Center Column: Map & Primary Interaction */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-8">
            <ThreatMap />
            <div className="flex-1 flex flex-col items-center justify-center">
              <AIOrb />
            </div>
            <div className="glass-card p-6 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 hex-clip bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                  <span className="text-cyan-400 text-xl">🛡</span>
                </div>
                <div>
                  <h4 className="text-sm font-orbitron font-bold">Active Defense Matrix</h4>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Adaptive Protocol Level 4-Alpha</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-cyan-500 text-cyber-bg text-xs font-bold font-orbitron uppercase hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]">Initialize Pulse</button>
                <button className="px-4 py-2 rounded-lg border border-white/10 text-white text-xs font-bold font-orbitron uppercase hover:bg-white/5 transition-all">Manual Override</button>
              </div>
            </div>
          </div>
          {/* Right Column: Feed & Operations */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">
            <AttackFeed />
            <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
              <h3 className="section-label">Operations Terminal</h3>
              <div className="space-y-3 font-mono text-[10px]">
                <div className="flex gap-2 text-green-400">
                  <span>&gt;</span>
                  <span className="animate-pulse">_</span>
                  <span>Nexus Core v4.0.2 ready.</span>
                </div>
                <div className="text-slate-500">Last login: 07-MAY-2026 20:19:38 from 127.0.0.1</div>
                <div className="cyber-divider"></div>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <span>NODE_ALPHA:</span> <span className="text-cyan-400">STABLE</span>
                  <span>NODE_BETA:</span> <span className="text-cyan-400">STABLE</span>
                  <span>ENCRYPTION:</span> <span className="text-purple-400">AES-4096</span>
                  <span>UPTIME:</span> <span className="text-slate-300">1,248:12:44</span>
                </div>
              </div>
              <div className="w-full h-24 bg-cyber-dark/80 rounded border border-white/5 p-2 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>
                <div className="flex items-end gap-[2px] h-full">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-cyan-500/30"
                      initial={{ height: '10%' }}
                      animate={{ height: [`${Math.random()*60+20}%`, `${Math.random()*60+20}%`] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Cinematic Overlays */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-cyber-bg to-transparent pointer-events-none z-[80]"></div>
        {/* Corner Accents */}
        <div className="fixed top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30 pointer-events-none"></div>
        <div className="fixed top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none"></div>
        <div className="fixed bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none"></div>
        <div className="fixed bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30 pointer-events-none"></div>
      </div>
    </ParallaxWrapper>
  );
};

export default App;
