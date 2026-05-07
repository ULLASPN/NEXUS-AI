import React, { useState, useEffect, useRef, useMemo, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Globe, Zap, Cpu, Terminal, AlertTriangle, Radio, BarChart3, Wifi, Lock, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import {
  ANALYTICS,
  INITIAL_FEED,
  NEW_THREATS,
  AI_MESSAGES,
  CITIES,
  ATTACK_PAIRS,
  SYSTEM_STATUS
} from './data';

// --- System Context for Global State ---
const SystemContext = createContext();

// --- 3D Components ---

const CyberGlobe = () => {
  const globeRef = useRef();
  const { activeAlert } = useContext(SystemContext);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    globeRef.current.rotation.y = t * 0.05;
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial 
          color={activeAlert ? "#ef4444" : "#06b6d4"} 
          wireframe 
          opacity={activeAlert ? 0.2 : 0.05} 
          transparent 
        />
      </Sphere>
      
      <mesh>
        <sphereGeometry args={[1.9, 64, 64]} />
        <MeshDistortMaterial
          color={activeAlert ? "#ef4444" : "#0ea5e9"}
          speed={2}
          distort={activeAlert ? 0.5 : 0.2}
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
          </mesh>
        );
      })}
    </group>
  );
};

// --- Functional UI Components ---

const Sidebar = () => {
  const { soundEnabled, setSoundEnabled } = useContext(SystemContext);
  return (
    <div className="fixed left-0 top-0 h-full w-20 z-50 flex flex-col items-center py-10 gap-10 border-r border-white/5 backdrop-blur-xl bg-black/20">
      <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/40">
        <span className="text-cyan-400 font-bold text-xl">N</span>
      </div>
      <div className="flex flex-col gap-10 flex-1 justify-center text-slate-500">
        <Globe size={20} className="cursor-pointer hover:text-cyan-400" />
        <Activity size={20} className="cursor-pointer hover:text-cyan-400" />
        <Shield size={20} className="cursor-pointer hover:text-cyan-400" />
        <Terminal size={20} className="cursor-pointer hover:text-cyan-400" />
      </div>
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`p-3 rounded-full transition-all ${soundEnabled ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500'}`}
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, color }) => (
  <div className="relative group p-6 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-white/5 text-cyan-400"><Icon size={18} /></div>
      <div className="text-[9px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{trend}</div>
    </div>
    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-orbitron font-bold text-white tracking-tighter">{value}</div>
  </motion.div>
);

// --- Main App ---

const App = () => {
  const [booting, setBooting] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [threatCount, setThreatCount] = useState(12482);

  // Simulation Engine
  useEffect(() => {
    if (booting) return;
    const interval = setInterval(() => {
      const newThreat = NEW_THREATS[Math.floor(Math.random() * NEW_THREATS.length)];
      const isCritical = Math.random() > 0.8;
      const item = {
        id: Math.random(),
        time: new Date().toLocaleTimeString([], { hour12: false }),
        type: isCritical ? 'CRITICAL' : 'THREAT',
        src: `10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        ...newThreat
      };
      
      setFeed(prev => [item, ...prev.slice(0, 5)]);
      if (isCritical) {
        setActiveAlert(item);
        setThreatCount(c => c + 1);
        setTimeout(() => setActiveAlert(null), 3000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [booting]);

  return (
    <SystemContext.Provider value={{ soundEnabled, setSoundEnabled, activeAlert }}>
      <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden font-orbitron">
        
        {/* Boot Sequence */}
        <AnimatePresence>
          {booting && (
            <motion.div 
              exit={{ opacity: 0, scale: 1.1 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6"
            >
              <div className="w-16 h-16 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <div className="text-[10px] tracking-[0.6em] text-cyan-500 animate-pulse">NEXUS SYSTEM OFFLINE</div>
              <button 
                onClick={() => setBooting(false)}
                className="px-10 py-3 border border-cyan-500 text-cyan-500 text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all"
              >
                INITIALIZE CORE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Sidebar />

        {/* Global Alert Notification */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-10 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-red-600 text-white rounded-full flex items-center gap-4 shadow-[0_0_30px_#ef4444]"
            >
              <AlertTriangle size={16} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Critical Breach: {activeAlert.attack}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Scene */}
        <div className="fixed inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <CyberGlobe />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Suspense>
          </Canvas>
        </div>

        {/* Main Interface */}
        <main className="relative z-10 pl-32 pr-12 pt-32 pb-10 grid grid-cols-12 gap-8 h-screen overflow-y-auto">
          
          {/* Stats Bar */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <StatCard label="Threat Vectors" value={threatCount.toLocaleString()} icon={AlertTriangle} trend="+8%" color="#ef4444" />
            <StatCard label="System Integrity" value="99.98%" icon={Shield} trend="Stable" color="#22d3ee" />
            
            <div className="flex-1 p-6 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl">
               <h3 className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-6">Subsystem Load</h3>
               <div className="space-y-6">
                  {SYSTEM_STATUS.map(sys => (
                    <div key={sys.label} className="space-y-2">
                       <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                          <span>{sys.label}</span>
                          <span style={{ color: sys.color }}>{sys.value}%</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${sys.value}%` }} className="h-full" style={{ backgroundColor: sys.color }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Center Focus (Globe Space) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-end items-center pb-20">
             <div className="px-10 py-6 bg-black/60 backdrop-blur-3xl border border-cyan-500/20 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-cyan-400 italic">
                  "{activeAlert ? `Warning: Unidentified source bypassing firewall.` : `Monitoring neural network for pattern anomalies...`}"
                </p>
             </div>
          </div>

          {/* Right Feed */}
          <div className="col-span-12 lg:col-span-3 flex flex-col">
             <div className="flex-1 p-6 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col">
                <h3 className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-6">Intercept Stream</h3>
                <div className="flex-1 space-y-4 overflow-hidden">
                   <AnimatePresence initial={false}>
                      {feed.map(item => (
                        <motion.div 
                          key={item.id} 
                          initial={{ x: 50, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          className="p-3 bg-white/5 border border-white/5 rounded-lg text-[9px] font-mono"
                        >
                           <div className="flex justify-between mb-1">
                              <span className={item.type === 'CRITICAL' ? 'text-red-400' : 'text-cyan-400'}>[{item.type}]</span>
                              <span className="text-slate-500">{item.time}</span>
                           </div>
                           <div className="truncate text-slate-300">{item.src} → {item.attack}</div>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
                <button className="mt-6 w-full py-3 bg-cyan-500/10 border border-cyan-500/30 text-[9px] text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/20 transition-all font-bold">Override System</button>
             </div>
          </div>

        </main>

        {/* HUD Elements */}
        <div className="fixed inset-0 pointer-events-none z-[80] border-[1px] border-white/5 m-4" />
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_#22d3ee]" />

      </div>
    </SystemContext.Provider>
  );
};

export default App;
