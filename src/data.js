export const ANALYTICS = [
  { id: 'attacks',   label: 'Total Attacks',     value: 2847391, suffix: '',   color: '#ef4444', glow: 'rgba(239,68,68,0.3)',   icon: '⚡', trend: '+12.4%', trendUp: true  },
  { id: 'risk',      label: 'AI Risk Score',      value: 87,      suffix: '%',  color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  icon: '🧠', trend: '+3.1%',  trendUp: true  },
  { id: 'threats',   label: 'Active Threats',     value: 342,     suffix: '',   color: '#a855f7', glow: 'rgba(168,85,247,0.3)',  icon: '🔴', trend: '-8.2%',  trendUp: false },
  { id: 'integrity', label: 'System Integrity',   value: 98.7,    suffix: '%',  color: '#10b981', glow: 'rgba(16,185,129,0.3)',  icon: '🛡', trend: '+0.3%',  trendUp: true  },
  { id: 'blocked',   label: 'Blocked Intrusions', value: 19482,   suffix: '',   color: '#22d3ee', glow: 'rgba(34,211,238,0.3)',  icon: '🔒', trend: '+22.7%', trendUp: true  },
  { id: 'nodes',     label: 'Protected Nodes',    value: 4096,    suffix: '',   color: '#818cf8', glow: 'rgba(129,140,248,0.3)', icon: '🌐', trend: '+5.0%',  trendUp: true  },
];

export const INITIAL_FEED = [
  { id:1,  time:'20:19:04', type:'CRITICAL', src:'185.220.101.42', srcCountry:'RU', dst:'10.0.0.1',        dstCountry:'US', attack:'SQL Injection',        proto:'TCP', port:3306 },
  { id:2,  time:'20:19:01', type:'WARNING',  src:'45.33.32.156',   srcCountry:'CN', dst:'192.168.1.55',    dstCountry:'DE', attack:'Brute Force SSH',      proto:'TCP', port:22   },
  { id:3,  time:'20:18:58', type:'INFO',     src:'203.0.113.77',   srcCountry:'KP', dst:'172.16.0.10',     dstCountry:'GB', attack:'Port Scan',            proto:'UDP', port:4444 },
  { id:4,  time:'20:18:55', type:'CRITICAL', src:'91.108.4.120',   srcCountry:'IR', dst:'10.10.0.5',       dstCountry:'US', attack:'Zero-Day Exploit',     proto:'TCP', port:443  },
  { id:5,  time:'20:18:52', type:'WARNING',  src:'198.51.100.22',  srcCountry:'BR', dst:'192.168.0.254',   dstCountry:'FR', attack:'DDoS Amplification',   proto:'UDP', port:53   },
  { id:6,  time:'20:18:48', type:'INFO',     src:'77.88.55.66',    srcCountry:'RU', dst:'10.0.1.20',       dstCountry:'JP', attack:'XSS Attempt',          proto:'TCP', port:80   },
  { id:7,  time:'20:18:44', type:'CRITICAL', src:'103.77.192.1',   srcCountry:'CN', dst:'172.31.0.1',      dstCountry:'CA', attack:'Ransomware C2',        proto:'TCP', port:8080 },
  { id:8,  time:'20:18:40', type:'WARNING',  src:'5.188.210.5',    srcCountry:'UA', dst:'192.168.10.1',    dstCountry:'AU', attack:'Credential Stuffing',  proto:'TCP', port:443  },
];

export const NEW_THREATS = [
  { attack:'Man-in-the-Middle',   srcCountry:'CN', dstCountry:'US', proto:'TCP',  port:8443 },
  { attack:'DNS Poisoning',       srcCountry:'RU', dstCountry:'DE', proto:'UDP',  port:53   },
  { attack:'API Abuse',           srcCountry:'KP', dstCountry:'JP', proto:'HTTPS',port:443  },
  { attack:'Trojan Dropper',      srcCountry:'IR', dstCountry:'GB', proto:'TCP',  port:21   },
  { attack:'Cryptojacking',       srcCountry:'BR', dstCountry:'US', proto:'TCP',  port:3333 },
  { attack:'Phishing Campaign',   srcCountry:'NG', dstCountry:'CA', proto:'SMTP', port:587  },
  { attack:'Buffer Overflow',     srcCountry:'RO', dstCountry:'FR', proto:'TCP',  port:135  },
  { attack:'LDAP Injection',      srcCountry:'TR', dstCountry:'AU', proto:'TCP',  port:389  },
  { attack:'Zero-Day CVE-2024',   srcCountry:'CN', dstCountry:'US', proto:'TCP',  port:445  },
  { attack:'Supply Chain Attack', srcCountry:'RU', dstCountry:'DE', proto:'TCP',  port:5985 },
];

export const AI_MESSAGES = [
  'Anomaly detected in subnet 10.0.4.0/24 — initiating deep packet inspection.',
  'Threat actor TG-3524 identified. Blocking 47 associated IPs.',
  'ML model confidence: 94.2% — classifying as APT lateral movement.',
  'Honeypot triggered at DMZ node 172.16.8.12. Recording payload.',
  'Zero-day signature matched. Deploying virtual patch protocol.',
  'Correlating 1,240 events across 14 endpoints — threat cluster forming.',
  'AI Defense Matrix online. All perimeter sensors nominal.',
  'Predictive model flagged 3 hosts for pre-emptive quarantine.',
  'Decrypting obfuscated C2 beacon on port 443. Origin: TOR exit node.',
  'Adaptive firewall rules updated — 2,847 new block entries applied.',
];

// World map city coordinates (x%, y% on the SVG 1000x500 viewBox)
export const CITIES = [
  { name:'New York',    x: 220, y: 175, country:'US' },
  { name:'Los Angeles', x: 130, y: 200, country:'US' },
  { name:'London',      x: 455, y: 148, country:'GB' },
  { name:'Moscow',      x: 560, y: 140, country:'RU' },
  { name:'Beijing',     x: 740, y: 175, country:'CN' },
  { name:'Tokyo',       x: 808, y: 185, country:'JP' },
  { name:'Sydney',      x: 820, y: 360, country:'AU' },
  { name:'Mumbai',      x: 640, y: 230, country:'IN' },
  { name:'Dubai',       x: 600, y: 225, country:'AE' },
  { name:'Berlin',      x: 490, y: 148, country:'DE' },
  { name:'Paris',       x: 462, y: 158, country:'FR' },
  { name:'São Paulo',   x: 265, y: 330, country:'BR' },
  { name:'Toronto',     x: 205, y: 165, country:'CA' },
  { name:'Seoul',       x: 795, y: 177, country:'KR' },
  { name:'Singapore',   x: 745, y: 278, country:'SG' },
  { name:'Cairo',       x: 535, y: 215, country:'EG' },
  { name:'Nairobi',     x: 552, y: 285, country:'KE' },
  { name:'Buenos Aires',x: 255, y: 360, country:'AR' },
  { name:'Pyongyang',   x: 790, y: 168, country:'KP' },
  { name:'Tehran',      x: 590, y: 200, country:'IR' },
];

export const ATTACK_PAIRS = [
  [4,0],[4,2],[4,9],[3,0],[3,9],[3,2],[18,5],[18,0],[19,0],[19,2],[1,0],[1,8],[11,0],[11,2],[6,5],[7,5],[14,5],
];

export const SYSTEM_STATUS = [
  { label:'Firewall',       value: 100, color:'#10b981' },
  { label:'IDS/IPS',        value: 98,  color:'#10b981' },
  { label:'AI Engine',      value: 94,  color:'#22d3ee' },
  { label:'Threat Intel',   value: 87,  color:'#f59e0b' },
  { label:'VPN Tunnels',    value: 100, color:'#10b981' },
  { label:'Endpoint Sec.',  value: 91,  color:'#22d3ee' },
];
