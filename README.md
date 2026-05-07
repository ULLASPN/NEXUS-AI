# NEXUS AI Cyber Defense System

A **futuristic cinematic cybersecurity dashboard** built with **React + Vite**, **Tailwind CSS**, **Framer Motion**, and **GSAP**.  The UI follows a dark cyber‑punk aesthetic with neon glows, glass‑morphism cards, and smooth anti‑gravity animations – perfect for a hackathon demo.

---

## 📦 Project Structure (Very Simple)
```
📦 nexus-ai-dashboard
 ├─ 📂 public
 │   └─ index.html
 ├─ 📂 src
 │   ├─ App.jsx          # Main dashboard (all components in‑line)
 │   ├─ main.jsx         # React entry point
 │   ├─ index.css        # Tailwind + custom CSS (glass‑morphism, animations)
 │   └─ data.js          # Fake data for analytics, map, feed, etc.
 ├─ package.json          # Dependencies & scripts
 ├─ vite.config.js        # Vite config with React plugin
 ├─ tailwind.config.js    # Tailwind config + custom cyber theme
 ├─ postcss.config.js     # PostCSS plugins
 ├─ RUN_DASHBOARD.bat     # Double‑click script to install & run
 └─ README.md             # This file
```

## 🛠️ Prerequisites
- **Node.js ≥ 20** (download from https://nodejs.org/)
- **Git** (optional, for version control)
- Windows OS (the provided batch file works on PowerShell/Command Prompt)

## 🚀 Quick Start (One‑Click)
1. **Double‑click** `RUN_DASHBOARD.bat` in the project root.
   - The script will:
     - Install missing `node_modules` (`npm install`).
     - Start the Vite dev server (`npm run dev`).
2. When the terminal shows something like:
   ```
   > Local:   http://localhost:5173
   ```
   open that URL in your browser.

### Manual Alternative (if you prefer the console)
```powershell
cd "C:\Users\ullas\.gemini\antigravity\scratch\nexus-ai-dashboard"
# First time only
npm install
# Start the dev server
npm run dev
```
Then visit **http://localhost:5173**.

## 🎨 Design Highlights
- **Neon blue / purple / cyan glow** using Tailwind custom colors.
- **Glass‑morphism cards** (`backdrop-blur` + semi‑transparent borders).
- **Floating particles** (`.particle` with CSS keyframes).
- **Custom cursor** (dot + ring + mouse‑glow).
- **Animated world map** built with SVG + Framer Motion.
- **AI Orb** animated via GSAP + CSS pulse.
- **Live threat feed** with slide‑in animations.
- **Responsive layout** (grid adjusts from mobile → desktop).

## 🗂️ Adding New Components (Optional)
If you ever need to split the massive `App.jsx`:
1. Create a new file under `src/` (e.g., `Map.jsx`).
2. Export the component and import it in `App.jsx`.
3. Keep the folder flat – no extra nested directories unless absolutely required.

## 📦 Available Scripts (from `package.json`)
| Script | Description |
|-------|-------------|
| `dev` | Starts Vite dev server (hot‑module reloading). |
| `build` | Builds a production bundle (run only if you need a static site). |
| `preview` | Serves the production build locally. |

## 🧹 .gitignore (optional)
If you add the project to a Git repo, ignore the automatically generated files:
```
node_modules/
/.vite/
/dist/
*.log
.DS_Store
.env
```

---

### 🎉 Ready to Wow the Hackathon!
Double‑click `RUN_DASHBOARD.bat`, open the localhost link, and you’ll see a **movie‑level control center** ready for demo. Feel free to tweak the colors, add sound assets, or hook up a real WebSocket for live data.

---

*If you run into any issues (missing dependency, port conflict, etc.) just let me know and I’ll help you troubleshoot.*
