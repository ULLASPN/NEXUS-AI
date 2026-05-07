import React, { useState, useEffect, useRef, useMemo, Suspense, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, PerspectiveCamera, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Shield, Activity, Globe, Zap, Cpu, Terminal, AlertTriangle, Radio, BarChart3, Wifi, Lock, Volume2, VolumeX, Database, Hexagon } from 'lucide-react';
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

const FloatingShards = () => {
  const shards = useMemo(() => {
    return [...Array(15)].map(() => ({
      position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: Math.random() * 0.2 + 0.05
    }));
  }, []);

  return (
    <group>
      {shards.map((shard, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2} position={shard.position}>
          <mesh rotation={shard.rotation} scale={shard.scale}>
            <octahedronGeometry />
            <meshStandardMaterial color="#22d3ee" wireframe transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const CyberGlobe = () => {
  const globeRef = useRef();
  const { activeAlert } = useContext(SystemContext);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial 
          color={activeAlert ? "#ef4444" : "#06b6d4"} 
          wireframe 
          opacity={activeAlert ? 0.25 : 0.08} 
          transparent 
        />
      </Sphere>
      
      <mesh>
        <sphereGeometry args={[1.9, 64, 64]} />
        <MeshDistortMaterial
          color={activeAlert ? "#ef4444" : "#0ea5e9"}
          speed={2}
          distort={activeAlert ? 0.6 : 0.3}
          radius={1}
          opacity={0.15}
          transparent
        />
      </mesh>

      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// --- Anti-Gravity UI Components ---

const AntiGravityWrapper = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      style={{ rotateX: springY, rotateY: springX, perspective: 1000 }}
      className="w-full h-full transform-gpu"
    >
      {children}
    </motion.div>
  );
};

const FloatingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const GlassCard = ({ children, title, icon: Icon, color = "#22d3ee" }) => (
  <div className="relative group bg-slate-950/20 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 overflow-hidden transition-all hover:border-cyan-500/30">
    <div className="absolute top-0 left-0 w-full h-1 opacity-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5" style={{ color }}><Icon size={16} /></div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{title}</h3>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse" />
    </div>
    {children}
  </div>
);

// --- Main App ---

const App = () => {
  const [booting, setBooting] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);
  const [feed, setFeed] = useState(INITIAL_FEED);

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

  return (
    <SystemContext.Provider value={{ activeAlert }}>
      <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden font-orbitron cursor-none">
        
        {/* Anti-Gravity Mouse Follower */}
        <CustomCursor />

        {/* Boot Sequence */}
        <AnimatePresence>
          {booting && (
            <motion.div 
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-8"
            >
              <motion.div 
                animate={{ rotate: 360, borderColor: ['#22d3ee', '#a855f7', '#22d3ee'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-b-2 rounded-full flex items-center justify-center"
              >
                 <Hexagon className="text-cyan-500 animate-pulse" size={32} />
              </motion.div>
              <div className="text-[12px] tracking-[0.8em] text-cyan-500 uppercase">Anti-Gravity Protocol v4.2</div>
              <button 
                onClick={() => setBooting(false)}
                className="group relative px-12 py-4 overflow-hidden"
              >
                 <div className="absolute inset-0 border border-cyan-500/50 group-hover:scale-110 transition-transform" />
                 <span className="relative text-xs font-bold text-cyan-400 tracking-[0.4em]">ENABLE SYSTEM</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Scene (Background) */}
        <div className="fixed inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 7] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#22d3ee" />
              <CyberGlobe />
              <FloatingShards />
              <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
            </Suspense>
          </Canvas>
        </div>

        {/* HUD Elements (Floating Overlays) */}
        <div className="fixed inset-0 z-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-48 h-48 border border-cyan-500/5 rounded-full animate-spin-slow" />
           <div className="absolute bottom-10 right-10 w-64 h-64 border border-purple-500/5 rounded-full animate-reverse-spin" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        {/* Main UI (Perspective Wrapper) */}
        <AntiGravityWrapper>
          <main className="relative z-20 px-20 pt-32 pb-10 grid grid-cols-12 gap-10 min-h-screen items-center">
            
            {/* Left Stats Section */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-10">
              <FloatingCard delay={0}>
                <GlassCard title="Defense Matrix" icon={Shield} color="#22d3ee">
                   <div className="text-3xl font-bold mb-2">99.8%</div>
                   <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Active nodes synchronized</div>
                </GlassCard>
              </FloatingCard>

              <FloatingCard delay={0.5}>
                <GlassCard title="AI Prediction" icon={Cpu} color="#a855f7">
                   <div className="text-3xl font-bold mb-2">94.2%</div>
                   <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Confidence interval: Alpha</div>
                </GlassCard>
              </FloatingCard>

              <FloatingCard delay={1}>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
                   <h4 className="text-[8px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">Network Integrity</h4>
                   <div className="flex gap-1 h-12 items-end">
                      {[...Array(20)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                          className="flex-1 bg-cyan-500/40 rounded-t"
                        />
                      ))}
                   </div>
                </div>
              </FloatingCard>
            </div>

            {/* Middle (Globe Focus) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center">
               <AnimatePresence>
                 {activeAlert && (
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 1.2, opacity: 0 }}
                     className="mb-20 p-6 bg-red-600/20 border border-red-500 rounded-2xl backdrop-blur-xl text-center"
                   >
                      <AlertTriangle className="text-red-500 mx-auto mb-2 animate-bounce" size={32} />
                      <div className="text-xs font-bold tracking-[0.5em] text-red-500 uppercase">Critical Intrusion Detected</div>
                      <div className="text-[10px] font-mono text-white mt-1 uppercase">{activeAlert.attack}</div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Right Feed Section */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-10">
               <FloatingCard delay={0.3}>
                 <GlassCard title="Intercept Logs" icon={Terminal}>
                    <div className="space-y-4 max-h-[300px] overflow-hidden">
                       <AnimatePresence initial={false}>
                          {feed.map(item => (
                            <motion.div 
                              key={item.id} 
                              initial={{ x: 30, opacity: 0 }} 
                              animate={{ x: 0, opacity: 1 }} 
                              className={`p-3 bg-white/5 border-l-2 text-[9px] font-mono ${item.type === 'CRITICAL' ? 'border-red-500 bg-red-500/5' : 'border-cyan-500'}`}
                            >
                               <div className="flex justify-between text-slate-500 mb-1">
                                  <span>{item.type}</span>
                                  <span>{item.time}</span>
                                </div>
                               <div className="text-white truncate">{item.src} → {item.attack}</div>
                            </motion.div>
                          ))}
                       </AnimatePresence>
                    </div>
                 </GlassCard>
               </FloatingCard>

               <FloatingCard delay={0.8}>
                 <GlassCard title="Database Status" icon={Database} color="#f59e0b">
                    <div className="flex items-center gap-4">
                       <div className="flex-1">
                          <div className="text-2xl font-bold">4.8 PB</div>
                          <div className="text-[8px] font-mono text-slate-500 uppercase">Encrypted storage</div>
                       </div>
                       <Zap size={24} className="text-amber-500 animate-pulse" />
                    </div>
                 </GlassCard>
               </FloatingCard>
            </div>

          </main>
        </AntiGravityWrapper>

        {/* Global Overlays */}
        <div className="fixed top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_20px_#22d3ee] z-50" />
        <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </div>
    </SystemContext.Provider>
  );
};

// --- Helper: Custom Cursor ---
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
    <div 
      ref={cursorRef} 
      className="fixed pointer-events-none z-[9999] w-10 h-10 border border-cyan-400/50 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
    >
       <div className="w-1 h-1 bg-cyan-400 rounded-full" />
    </div>
  );
};

export default App;
