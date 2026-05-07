import React, { useState, useEffect, useRef, useMemo, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, PerspectiveCamera, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useMotionValue, useSpring, Reorder } from 'framer-motion';
import { Shield, Activity, Globe, Zap, Cpu, Terminal, AlertTriangle, Radio, BarChart3, Wifi, Lock, Volume2, VolumeX, Database, Hexagon, Maximize2, X, Play, Square, Command } from 'lucide-react';
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
  const { activeAlert, highAlert } = useContext(SystemContext);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * (highAlert ? 0.3 : 0.05);
      globeRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial 
          color={highAlert || activeAlert ? "#ef4444" : "#06b6d4"} 
          wireframe 
          opacity={highAlert ? 0.3 : 0.08} 
          transparent 
        />
      </Sphere>
      <mesh>
        <sphereGeometry args={[1.9, 64, 64]} />
        <MeshDistortMaterial
          color={highAlert || activeAlert ? "#ef4444" : "#0ea5e9"}
          speed={highAlert ? 4 : 2}
          distort={highAlert ? 0.8 : 0.3}
          radius={1}
          opacity={0.15}
          transparent
        />
      </mesh>
    </group>
  );
};

// --- Functional UI Components ---

const CommandTerminal = () => {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState(["> System initialized.", "> Quantum encryption active."]);
  const scrollRef = useRef();

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toUpperCase();
      let response = `> Command '${cmd}' not recognized.`;
      if (cmd === 'SCAN') response = "> Running deep packet inspection... Clean.";
      if (cmd === 'SHIELD') response = "> Deploying neural firewall... 100%.";
      if (cmd === 'CLEAR') { setLogs([]); setInput(""); return; }
      
      setLogs(prev => [...prev, `> ${input}`, response]);
      setInput("");
      setTimeout(() => { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 10);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col h-48 font-mono text-[9px]">
      <div className="flex items-center gap-2 mb-3 text-cyan-400">
        <Terminal size={12} />
        <span className="uppercase tracking-widest font-bold">Terminal_Alpha</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 text-slate-400 scrollbar-hide">
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
      <div className="flex items-center gap-2 mt-2 border-t border-white/5 pt-2">
        <span className="text-cyan-500">$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          placeholder="ENTER COMMAND..."
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>
    </div>
  );
};

const ThreatDetail = ({ threat, onClose }) => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-10 bg-black/40 backdrop-blur-md"
  >
    <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-8 relative">
       <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
       <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-red-500/10 text-red-500"><AlertTriangle size={32}/></div>
          <div>
             <h2 className="text-xl font-bold text-white uppercase tracking-widest">{threat.attack}</h2>
             <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Trace ID: {threat.id.toString().slice(2, 10)}</p>
          </div>
       </div>
       <div className="grid grid-cols-2 gap-6 font-mono text-[10px]">
          <div className="space-y-4">
             <div><span className="text-slate-500 uppercase block mb-1">Source IP</span><span className="text-white text-sm">{threat.src}</span></div>
             <div><span className="text-slate-500 uppercase block mb-1">Target GEO</span><span className="text-white text-sm">{threat.dstCountry}</span></div>
          </div>
          <div className="space-y-4">
             <div><span className="text-slate-500 uppercase block mb-1">Protocol</span><span className="text-cyan-400 text-sm">{threat.proto}</span></div>
             <div><span className="text-slate-500 uppercase block mb-1">Risk Factor</span><span className="text-red-500 text-sm">Critical-9.2</span></div>
          </div>
       </div>
       <button className="w-full mt-10 py-4 bg-cyan-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all rounded-xl">Initialize Counter-Protocol</button>
    </div>
  </motion.div>
);

const Sidebar = () => {
  const { highAlert, setHighAlert, soundEnabled, setSoundEnabled } = useContext(SystemContext);
  return (
    <div className="fixed left-0 top-0 h-full w-20 z-[60] flex flex-col items-center py-10 gap-10 border-r border-white/5 backdrop-blur-xl bg-black/20">
      <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/40">
        <span className="text-cyan-400 font-bold text-xl">N</span>
      </div>
      <div className="flex flex-col gap-10 flex-1 justify-center">
        <button 
          onClick={() => setHighAlert(!highAlert)}
          className={`p-3 rounded-xl transition-all ${highAlert ? 'text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-slate-500 hover:text-cyan-400'}`}
        >
          <Zap size={20} />
        </button>
        {[Globe, Activity, Shield, Terminal].map((Icon, i) => (
          <Icon key={i} size={20} className="text-slate-500 hover:text-cyan-400 cursor-pointer" />
        ))}
      </div>
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`p-3 rounded-full transition-all ${soundEnabled ? 'text-cyan-400' : 'text-slate-500'}`}
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [booting, setBooting] = useState(true);
  const [highAlert, setHighAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (booting) return;
    const interval = setInterval(() => {
      const newThreat = NEW_THREATS[Math.floor(Math.random() * NEW_THREATS.length)];
      const isCritical = Math.random() > 0.8;
      const item = {
        id: Math.random(),
        time: new Date().toLocaleTimeString([], { hour12: false }),
        type: isCritical ? 'CRITICAL' : 'THREAT',
        src: `172.16.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        ...newThreat
      };
      setFeed(prev => [item, ...prev.slice(0, 5)]);
      if (isCritical) {
        setActiveAlert(item);
        setTimeout(() => setActiveAlert(null), 3000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [booting]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 15);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 15);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <SystemContext.Provider value={{ highAlert, setHighAlert, soundEnabled, setSoundEnabled, activeAlert }}>
      <div className={`min-h-screen ${highAlert ? 'bg-[#1a0000]' : 'bg-[#020617]'} transition-colors duration-1000 text-white font-orbitron overflow-hidden`}>
        
        <AnimatePresence>
          {booting && (
            <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-10">
               <div className="w-24 h-24 border border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
               <div className="text-[12px] tracking-[0.8em] text-cyan-500">NEXUS_OS LOADED</div>
               <button onClick={() => setBooting(false)} className="px-12 py-4 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all">INITIALIZE ENGINE</button>
            </motion.div>
          )}
        </AnimatePresence>

        <Sidebar />
        
        <AnimatePresence>
          {selectedThreat && <ThreatDetail threat={selectedThreat} onClose={() => setSelectedThreat(null)} />}
        </AnimatePresence>

        {/* HUD Layer */}
        <div className="fixed inset-0 pointer-events-none z-10">
           <div className="absolute top-10 right-10 flex flex-col items-end gap-2 text-slate-500 font-mono text-[9px]">
              <div className="flex items-center gap-2">UPTIME: <span className="text-cyan-400 font-bold">{Math.floor(uptime/60)}m {uptime%60}s</span></div>
              <div className="flex items-center gap-2">SYSTEM CLOCK: <span className="text-white font-bold">{new Date().toLocaleTimeString()}</span></div>
           </div>
        </div>

        {/* 3D Scene */}
        <div className="fixed inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 7] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} color={highAlert ? "#ef4444" : "#22d3ee"} />
              <CyberGlobe />
              <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
            </Suspense>
          </Canvas>
        </div>

        <motion.main 
          style={{ rotateX: springY, rotateY: springX, perspective: 1000 }}
          className="relative z-20 pl-32 pr-12 pt-32 pb-10 grid grid-cols-12 gap-8 h-screen overflow-y-auto transform-gpu"
        >
          {/* Left Panel */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
             <div className="bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Threat Matrix</h3>
                   <div className={`w-2 h-2 rounded-full ${highAlert ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                </div>
                <div className="space-y-6">
                   {SYSTEM_STATUS.map(sys => (
                     <div key={sys.label} className="space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                           <span>{sys.label}</span>
                           <span style={{ color: highAlert ? '#ef4444' : sys.color }}>{sys.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full">
                           <motion.div animate={{ width: `${sys.value}%` }} className="h-full" style={{ backgroundColor: highAlert ? '#ef4444' : sys.color }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <CommandTerminal />
          </div>

          {/* Middle View */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-end pb-20">
             <AnimatePresence>
                {activeAlert && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="p-6 bg-red-600/20 border border-red-500 rounded-2xl backdrop-blur-xl mb-10">
                     <div className="text-[10px] font-bold text-red-500 uppercase tracking-[0.5em] mb-2 animate-pulse">Critical Breach Detected</div>
                     <div className="text-[14px] font-mono text-white text-center">{activeAlert.attack}</div>
                  </motion.div>
                )}
             </AnimatePresence>
             <div className="p-6 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-2xl flex gap-10">
                <div className="text-center">
                   <div className="text-[9px] text-slate-500 uppercase mb-1">Risk Score</div>
                   <div className={`text-xl font-bold ${highAlert ? 'text-red-500' : 'text-cyan-400'}`}>0.92/1.0</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                   <div className="text-[9px] text-slate-500 uppercase mb-1">Defense Level</div>
                   <div className="text-xl font-bold text-white">OMEGA-4</div>
                </div>
             </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
             <div className="bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Signal Intercept</h3>
                   <Activity size={14} className="text-cyan-500 animate-pulse" />
                </div>
                <div className="flex-1 space-y-4">
                   <AnimatePresence initial={false}>
                      {feed.map(item => (
                        <motion.div 
                          key={item.id} 
                          onClick={() => setSelectedThreat(item)}
                          initial={{ x: 20, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          className="p-3 bg-white/5 border border-white/5 hover:border-cyan-500/50 cursor-pointer transition-all rounded-lg text-[9px] font-mono group"
                        >
                           <div className="flex justify-between mb-1">
                              <span className={item.type === 'CRITICAL' ? 'text-red-400' : 'text-cyan-400'}>[{item.type}]</span>
                              <span className="text-slate-500">{item.time}</span>
                           </div>
                           <div className="truncate text-slate-300 group-hover:text-white transition-colors">{item.src} → {item.attack}</div>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
                <button className="mt-6 w-full py-4 bg-cyan-500 text-black font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all rounded-xl shadow-[0_0_15px_#22d3ee]">Manual Override</button>
             </div>
          </div>

        </motion.main>

        <div className="fixed top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_15px_#22d3ee] z-50" />
      </div>
    </SystemContext.Provider>
  );
};

export default App;
