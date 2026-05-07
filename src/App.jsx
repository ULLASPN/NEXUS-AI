import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, PerspectiveCamera, Stars, Text, Trail, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { Shield, Activity, Globe, Zap, Cpu, Terminal, AlertTriangle, Radio, BarChart3, Wifi, Lock } from 'lucide-react';
import {
  ANALYTICS,
  INITIAL_FEED,
  NEW_THREATS,
  AI_MESSAGES,
  CITIES,
  ATTACK_PAIRS,
  SYSTEM_STATUS
} from './data';

// --- 3D Components ---

const CyberGlobe = () => {
  const globeRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    globeRef.current.rotation.y = t * 0.1;
    globeRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
  });

  return (
    <group ref={globeRef}>
      {/* Outer Glow / Wireframe */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial color="#06b6d4" wireframe opacity={0.05} transparent />
      </Sphere>
      
      {/* Inner Distorted Core */}
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <MeshDistortMaterial
          color="#0ea5e9"
          speed={2}
          distort={0.3}
          radius={1}
          opacity={0.1}
          transparent
        />
      </mesh>

      {/* City Nodes */}
      {CITIES.map((city, i) => {
        const phi = (90 - city.y / 5.5) * (Math.PI / 180);
        const theta = (city.x / 2.7 + 180) * (Math.PI / 180);
        const x = 2 * Math.sin(phi) * Math.cos(theta);
        const y = 2 * Math.cos(phi);
        const z = 2 * Math.sin(phi) * Math.sin(theta);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" />
            <pointLight distance={0.5} intensity={0.5} color="#22d3ee" />
          </mesh>
        );
      })}
    </group>
  );
};

const ParticleField = () => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y += 0.001;
    ref.current.rotation.x += 0.0005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#22d3ee" transparent opacity={0.4} />
    </points>
  );
};

// --- UI Components ---

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
        className="cursor-dot fixed pointer-events-none z-[9999] w-1.5 h-1.5 bg-cyan-400 rounded-full" 
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%) scale(${isPointer ? 2.5 : 1})`, transition: 'transform 0.15s ease-out' }}
      />
      <div 
        className="cursor-ring fixed pointer-events-none z-[9999] w-8 h-8 border border-cyan-400/30 rounded-full mix-blend-screen" 
        style={{ left: mousePos.x, top: mousePos.y, transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`, transition: 'transform 0.25s ease-out, left 0.1s, top 0.1s' }}
      />
    </>
  );
};

const CinematicIntro = ({ onComplete }) => {
  const [text, setText] = useState("");
  const fullText = "INITIALIZING NEXUS CORE... STATUS: OPTIMAL... LINK ESTABLISHED.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-6"
    >
      <div className="w-64 h-1 bg-white/5 relative overflow-hidden rounded-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cyan-500 shadow-[0_0_15px_#22d3ee]"
        />
      </div>
      <div className="font-mono text-cyan-500 text-[10px] tracking-[0.3em] uppercase animate-pulse">
        {text}
      </div>
    </motion.div>
  );
};

const Sidebar = () => (
  <div className="fixed left-0 top-0 h-full w-20 z-50 flex flex-col items-center py-10 gap-10 border-r border-white/5 backdrop-blur-xl bg-black/20">
    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
      <span className="text-cyan-400 font-bold text-xl">N</span>
    </div>
    <div className="flex flex-col gap-8 flex-1 justify-center">
      {[Globe, Activity, Shield, Terminal, Cpu].map((Icon, i) => (
        <motion.div 
          key={i}
          whileHover={{ scale: 1.2, color: "#22d3ee" }}
          className="cursor-pointer text-slate-500 transition-colors"
        >
          <Icon size={20} />
        </motion.div>
      ))}
    </div>
    <div className="text-[10px] font-mono text-slate-600 rotate-90 whitespace-nowrap mb-10 tracking-[0.5em]">
      V4.0.2-ALPHA
    </div>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-20 right-0 z-40 px-10 py-6 flex items-center justify-between">
    <div className="flex items-center gap-10">
      <div className="flex flex-col">
        <h1 className="text-xl font-orbitron font-bold tracking-widest text-white uppercase">Nexus AI</h1>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[8px] font-mono text-green-500/80 uppercase tracking-widest">Quantum Link: Stable</span>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-6 ml-10">
        {['Overview', 'Analysis', 'Security', 'Hardware'].map((item) => (
          <a key={item} href="#" className="text-[10px] font-orbitron font-medium text-slate-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">{item}</a>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Global Risk Level</span>
        <span className="text-xs font-orbitron font-bold text-white uppercase">Moderate / Alpha-6</span>
      </div>
      <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-colors">
        <Wifi size={16} className="text-cyan-400" />
      </div>
    </div>
  </nav>
);

const GlassCard = ({ children, className = "", title = "" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`relative group ${className}`}
  >
    <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
    <div className="relative h-full bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-orbitron font-bold text-cyan-400 uppercase tracking-widest">{title}</h3>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
             <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
          </div>
        </div>
      )}
      {children}
    </div>
  </motion.div>
);

const StatCard = ({ label, value, color, icon: Icon, trend }) => (
  <GlassCard>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-white/5 text-cyan-400">
        <Icon size={18} />
      </div>
      <div className="text-[9px] font-mono font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
        {trend}
      </div>
    </div>
    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-orbitron font-bold text-white tracking-tighter">{value}</div>
    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "65%" }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="h-full" 
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      />
    </div>
  </GlassCard>
);

const AttackFeed = () => {
  const [feed, setFeed] = useState(INITIAL_FEED);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat = NEW_THREATS[Math.floor(Math.random() * NEW_THREATS.length)];
      const item = {
        id: Math.random(),
        time: new Date().toLocaleTimeString([], { hour12: false }),
        type: Math.random() > 0.7 ? 'CRITICAL' : 'THREAT',
        src: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        ...newThreat
      };
      setFeed(prev => [item, ...prev.slice(0, 5)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {feed.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-3 rounded-xl border border-white/5 flex flex-col gap-1 transition-all ${item.type === 'CRITICAL' ? 'bg-red-500/5' : 'bg-white/5'}`}
          >
            <div className="flex justify-between text-[8px] font-mono">
              <span className={item.type === 'CRITICAL' ? 'text-red-400' : 'text-cyan-400'}>[{item.type}]</span>
              <span className="text-slate-500">{item.time}</span>
            </div>
            <div className="text-[10px] font-mono text-slate-200">
              <span className="text-white font-bold">{item.src}</span>
              <span className="mx-2 text-slate-600">→</span>
              <span>{item.attack}</span>
            </div>
            <div className="text-[8px] font-mono text-slate-500 flex gap-4 mt-1">
              <span>PRT: {item.port}</span>
              <span>GEO: {item.dstCountry}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <CustomCursor />
      <AnimatePresence>
        {loading && <CinematicIntro onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Sidebar />
      <Navbar />

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#020617']} />
            <fog attach="fog" args={['#020617', 5, 15]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
               <CyberGlobe />
            </Float>
            <ParticleField />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Suspense>
        </Canvas>
      </div>

      <main className="relative z-10 pl-24 pr-10 pt-32 pb-10 grid grid-cols-12 gap-6 max-w-[1800px] mx-auto">
        {/* Top Analytics Row */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Live Threats" value="12,482" color="#ef4444" icon={AlertTriangle} trend="+12%" />
          <StatCard label="System Integrity" value="99.98%" color="#22d3ee" icon={Shield} trend="Stable" />
          <StatCard label="Network Load" value="48.2 GB/s" color="#a855f7" icon={Wifi} trend="+5.4%" />
          <StatCard label="AI Confidence" value="94.5%" color="#0ea5e9" icon={Cpu} trend="+1.2%" />
        </div>

        {/* Center: Hero Visualization Area (Empty space for 3D Globe) */}
        <div className="col-span-12 lg:col-span-8 h-[500px] flex items-center justify-center pointer-events-none">
           {/* The 3D globe in the background sits here visually */}
        </div>

        {/* Right: Live Feed */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <GlassCard title="Live Intercept Feed" className="flex-1">
             <AttackFeed />
          </GlassCard>
        </div>

        {/* Bottom Section */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-6">
          <GlassCard title="Hardware Status">
            <div className="space-y-4 py-2">
              {SYSTEM_STATUS.slice(0, 4).map((sys) => (
                <div key={sys.label} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono uppercase">
                    <span className="text-slate-400">{sys.label}</span>
                    <span style={{ color: sys.color }}>{sys.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.value}%` }}
                      className="h-full" 
                      style={{ backgroundColor: sys.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          
          <GlassCard title="AI Strategic Insight">
            <div className="h-full flex flex-col justify-center">
               <div className="text-[11px] font-mono text-cyan-400 italic leading-relaxed">
                 "Detected anomalous traffic patterns in Sector-7. Implementing proactive node isolation. Current defensive posture: Adaptive-Alpha."
               </div>
               <div className="mt-4 flex gap-4">
                  <button className="flex-1 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-orbitron font-bold text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/30 transition-all">Authorize</button>
                  <button className="flex-1 py-2 rounded-lg border border-white/10 text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5 transition-all">Dismiss</button>
               </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <GlassCard title="Active Defense Protocols">
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Neural Firewall', status: 'Active', icon: Lock },
                 { label: 'Deep Packet Scan', status: 'Running', icon: Radio },
                 { label: 'Quantum Encryption', status: 'Stable', icon: Shield },
                 { label: 'Real-time Decryption', status: 'Idle', icon: Terminal },
               ].map((protocol) => (
                 <div key={protocol.label} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <protocol.icon size={14} />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-white">{protocol.label}</div>
                      <div className="text-[8px] font-mono text-slate-500 uppercase">{protocol.status}</div>
                    </div>
                 </div>
               ))}
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Futuristic Scanlines & Vignette */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 scanline-overlay opacity-20" />
      </div>
    </div>
  );
};

export default App;
