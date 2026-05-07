import React, { useState, useEffect, useRef, useMemo, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, PerspectiveCamera, Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useMotionValue, useSpring, useDragControls } from 'framer-motion';
import { Shield, Activity, Globe, Zap, Cpu, Terminal, AlertTriangle, Radio, BarChart3, Wifi, Lock, Volume2, VolumeX, Database, Hexagon, Maximize2, X, Play, Square, Command, MousePointer2 } from 'lucide-react';
import {
  ANALYTICS,
  INITIAL_FEED,
  NEW_THREATS,
  AI_MESSAGES,
  CITIES,
  ATTACK_PAIRS,
  SYSTEM_STATUS
} from './data';

// --- System Context ---
const SystemContext = createContext();

// --- 3D Components ---

const CyberGlobe = () => {
  const globeRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { activeAlert, highAlert, setPingCount } = useContext(SystemContext);
  useCursor(hovered);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * (highAlert ? 0.3 : 0.05);
    }
  });

  const handlePing = () => {
    setPingCount(p => p + 1);
    // Visual feedback for ping can be handled here or via context
  };

  return (
    <group 
      ref={globeRef} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={handlePing}
    >
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial 
          color={highAlert || activeAlert ? "#ef4444" : hovered ? "#22d3ee" : "#06b6d4"} 
          wireframe 
          opacity={hovered ? 0.4 : 0.1} 
          transparent 
        />
      </Sphere>
      <mesh>
        <sphereGeometry args={[1.9, 64, 64]} />
        <MeshDistortMaterial
          color={highAlert || activeAlert ? "#ef4444" : "#0ea5e9"}
          speed={highAlert ? 4 : 2}
          distort={highAlert ? 0.8 : 0.2}
          radius={1}
          opacity={0.15}
          transparent
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-md border border-cyan-500/50 p-2 rounded text-[8px] font-mono text-cyan-400 whitespace-nowrap">
            SCANNING NODE: {Math.floor(Math.random() * 1000)}/ALPHA
          </div>
        </Html>
      )}
    </group>
  );
};

// --- Draggable Card Wrapper ---
const DraggableHUD = ({ children, className = "" }) => (
  <motion.div
    drag
    dragMomentum={false}
    whileDrag={{ scale: 1.05, zIndex: 100 }}
    className={`cursor-grab active:cursor-grabbing ${className}`}
  >
    {children}
  </motion.div>
);

const GlassCard = ({ children, title, icon: Icon, color = "#22d3ee" }) => (
  <div className="relative group bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 overflow-hidden transition-all hover:border-cyan-500/30 shadow-2xl">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5" style={{ color }}><Icon size={16} /></div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{title}</h3>
      </div>
      <div className="flex gap-1">
         <div className="w-1 h-1 rounded-full bg-white/10" />
         <div className="w-1 h-1 rounded-full bg-white/10" />
      </div>
    </div>
    {children}
  </div>
);

// --- Main App ---

const App = () => {
  const [booting, setBooting] = useState(true);
  const [highAlert, setHighAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [pingCount, setPingCount] = useState(0);

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
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 10);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <SystemContext.Provider value={{ highAlert, setHighAlert, soundEnabled, setSoundEnabled, activeAlert, setPingCount }}>
      <div className={`min-h-screen ${highAlert ? 'bg-[#1a0000]' : 'bg-[#020617]'} transition-colors duration-1000 text-white font-orbitron overflow-hidden`}>
        
        <CustomCursor />

        <AnimatePresence>
          {booting && (
            <motion.div exit={{ opacity: 0, y: -100 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-10">
               <motion.div 
                 animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                 transition={{ duration: 5, repeat: Infinity }}
                 className="w-24 h-24 border border-cyan-500/20 border-t-cyan-500 rounded-full"
               />
               <button 
                 onClick={() => setBooting(false)} 
                 className="px-16 py-4 border border-cyan-500 text-cyan-500 font-bold uppercase tracking-[0.5em] hover:bg-cyan-500 hover:text-black transition-all"
               >
                 Authorize Core
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global HUD Layer */}
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-20 bg-black/40 backdrop-blur-xl px-10 py-4 rounded-full border border-white/5">
           <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-500 uppercase">System Uptime</span>
              <span className="text-xs font-mono">02:44:12:08</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-500 uppercase">Quantum Pings</span>
              <span className="text-xs font-mono text-cyan-400">{pingCount}</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[8px] text-slate-500 uppercase">Encryption</span>
              <span className="text-xs font-mono text-purple-400">AES-4096</span>
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

        {/* Draggable HUD Modules */}
        <motion.main 
          style={{ rotateX: springY, rotateY: springX, perspective: 1000 }}
          className="relative z-10 p-10 h-screen w-full grid grid-cols-12 gap-10 items-center overflow-hidden"
        >
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-10">
            <DraggableHUD>
              <GlassCard title="System Metrics" icon={Activity}>
                 <div className="space-y-6">
                    {SYSTEM_STATUS.slice(0, 3).map(sys => (
                      <div key={sys.label} className="space-y-2">
                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                           <span>{sys.label}</span>
                           <span style={{ color: highAlert ? '#ef4444' : sys.color }}>{sys.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full"><motion.div animate={{ width: `${sys.value}%` }} className="h-full" style={{ backgroundColor: highAlert ? '#ef4444' : sys.color }} /></div>
                      </div>
                    ))}
                 </div>
              </GlassCard>
            </DraggableHUD>

            <DraggableHUD>
              <div className="bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 h-48 flex flex-col">
                 <h3 className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-4">Neural Command</h3>
                 <div className="flex-1 font-mono text-[9px] text-slate-500 overflow-hidden">
                    <div>> Scanning neural pathways...</div>
                    <div>> Pattern recognition active.</div>
                    <div className="text-cyan-500 mt-2">> root@nexus: ~ $ _</div>
                 </div>
              </div>
            </DraggableHUD>
          </div>

          {/* Center (Globe) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center">
             <AnimatePresence>
                {activeAlert && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="p-8 bg-red-600/20 border border-red-500 rounded-3xl backdrop-blur-xl mb-40 text-center shadow-[0_0_50px_rgba(239,68,68,0.4)]">
                     <AlertTriangle className="text-red-500 mx-auto mb-4 animate-bounce" size={40} />
                     <div className="text-[10px] font-bold text-red-500 uppercase tracking-[0.6em] mb-2">Security Breach</div>
                     <div className="text-lg font-mono text-white">{activeAlert.attack}</div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-10">
            <DraggableHUD>
              <GlassCard title="Live Intercept" icon={Radio}>
                 <div className="space-y-4">
                    {feed.map(item => (
                      <div key={item.id} className={`p-3 bg-white/5 border-l-2 text-[9px] font-mono ${item.type === 'CRITICAL' ? 'border-red-500' : 'border-cyan-500'}`}>
                         <div className="flex justify-between mb-1 opacity-50"><span>{item.type}</span><span>{item.time}</span></div>
                         <div className="truncate">{item.src} → {item.attack}</div>
                      </div>
                    ))}
                 </div>
              </GlassCard>
            </DraggableHUD>

            <DraggableHUD>
              <div className="p-6 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center gap-6">
                 <button 
                  onClick={() => setHighAlert(!highAlert)}
                  className={`w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.4em] transition-all ${highAlert ? 'bg-red-500 text-white shadow-[0_0_20px_#ef4444]' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'}`}
                 >
                   {highAlert ? 'DISABLE ALARM' : 'INITIATE LOCKDOWN'}
                 </button>
                 <div className="flex gap-4 w-full">
                    <button className="flex-1 py-3 border border-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"><Maximize2 size={14} className="mx-auto"/></button>
                    <button className="flex-1 py-3 border border-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"><Lock size={14} className="mx-auto"/></button>
                 </div>
              </div>
            </DraggableHUD>
          </div>

        </motion.main>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 text-[10px] font-mono text-slate-600 tracking-[0.8em] uppercase">
           Drag HUD modules to rearrange workspace
        </div>

      </div>
    </SystemContext.Provider>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef();
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div ref={cursorRef} className="fixed pointer-events-none z-[9999] w-12 h-12 border border-cyan-500/20 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-75">
       <div className="w-1 h-1 bg-cyan-400 rounded-full" />
    </div>
  );
};

export default App;
