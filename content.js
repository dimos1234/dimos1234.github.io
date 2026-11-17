export const profile = {
  name: "Adam Shaltout",
  intro: "Software engineer, indie game developer, and digital creator. I build backend systems, GPU kernels, programming languages, and immersive 2D/3D worlds.",
  email: "mailto:adam.shaltout@mail.utoronto.ca",
  github: "https://github.com/dimos1234",
  linkedin: "https://www.linkedin.com/in/adam-shaltout-59a3a9332/"
};
export const projects = [
  {title:"Flash Attention", stack:"C++ / CUDA", tag:"Personal Project", paragraphs:["Implemented a tiled Flash Attention forward-pass CUDA kernel using shared memory and online softmax to avoid materializing quadratic attention matrices.","Achieved a 1.26× speedup and 11.5× reduction in peak GPU memory versus a naive CUDA baseline at sequence length 2048 in FP32."],url:"https://github.com/dimos1234/Flash-Attention"},
  {title:"Skript",stack:"Python",tag:"Personal Project",paragraphs:["A whimsical, personality-driven programming language with a Python interpreter.","Features anime-inspired syntax, miku entry points, :3 line terminators, leek-spin loops, and emoticon-based arrays."],url:"https://github.com/dimos1234/Skript"},
  {title:"Spin to Win",stack:"Verilog / DE1-SoC",tag:"Hardware Project",paragraphs:["A hardware arcade wheel game with three difficulty levels.","Built in Quartus Prime with Verilog, implementing the menu's finite-state machine directly on a DE1-SoC board."]},
  {title:"CUDA-2D-Convolution",stack:"C++ / CUDA",tag:"Personal Project",paragraphs:["A ground-up 2D convolution implementation with direct GPU memory and parallel execution management.","Optimized using CUDA shared memory, tiling, and thread synchronization."],url:"https://github.com/dimos1234/CUDA-2D-Convolution"},
  {title:"Skikai Desktop",stack:"Python / LLM APIs / TTS",tag:"Personal Project",paragraphs:["A proactive AI companion with multi-modal LLM integration for full desktop control.","Uses local TTS, screen vision, and API calls to speak, react to the screen, write programs, and solve technical problems with approximately one-second latency."],url:"https://github.com/dimos1234/Skikai-Dektop"},
  {title:"SkikaiOS",stack:"Python / Unity / Quest 3",tag:"Personal Project",paragraphs:["A modular AR companion OS for Meta Quest 3 built for low-latency spatial intelligence.","Entirely LLM-driven: skills are Python modules that the system auto-registers and executes dynamically, replacing hardcoded logic."],url:"https://github.com/dimos1234/SkikaiOS"},
  {title:"Toronto GIS",stack:"C++ / EZGL",tag:"University of Toronto",paragraphs:["Foundational Toronto mapping software using EZGL for the GUI and vanilla C++ for the backend.","Includes search, street and intersection data extraction, and points-of-interest rendering."]}
];
export const experience = [
  {title:"AI/ML Engineering Intern",fullTitle:"Applied AI/ML Engineering Intern",stack:"Pulsenics Inc. | Toronto, ON",tag:"May 2026 - Aug 2026",paragraphs:["Automated account generation using n8n, Docker, and the Claude API, replacing a manual operations workflow and saving 18+ hours per week.","Engineered web scrapers using Exa AI, Apify, and Adzuna APIs, feeding a Node.js/Supabase pipeline for targeted lead discovery across 500+ accounts."]},
  {title:"Data Analyst Intern",stack:"Pulsenics Inc. | Toronto, ON",tag:"May 2025 - Aug 2025",paragraphs:["Developed an automated Distribution of Relaxation Times analysis application in Python.","Built a GBR model to predict average electrochemical cell capacities with R² = 0.85.","Automated processing of 10,000+ lines of electrochemical data with Python and Pandas."]},
  {title:"Operations Volunteer",stack:"Pulsenics Inc. | Toronto, ON",tag:"Jan 2025 - April 2025",paragraphs:["Prospected leads using Apollo and LinkedIn Sales Navigator, explored a potential new electrochemical market, and used advanced Excel formulae to organize 200+ leads."]},
  {title:"Website Developer",fullTitle:"Website Maintenance Developer",stack:"GTA Photo 3D | Toronto, ON",tag:"Jan 2021 - Sep 2024",paragraphs:["Maintained a professional real-estate photography portfolio, improved SEO, and integrated responsive pages and interactive galleries using HTML, CSS and JavaScript."]}
];
export const games = [
  {title:"I Wish I Was A Cat",stack:"Unity / C#",tag:"In development",paragraphs:["A narrative-driven horror game exploring grief and procrastination, with custom hand-drawn 2D artwork and sprites.","Seamless movement between 2D and 3D planes creates a disorienting, inception-style experience."]},
  {title:"Project: Skikai",stack:"AI / LLM Integration",tag:"Experimental",paragraphs:["A personality-driven AI companion exploring dynamic conversation states and responsive, living interactions."],url:"https://github.com/dimos1234/Skikai-Dektop"},
  {title:"Game Development Log",stack:"Coding / 2D / 3D",tag:"YouTube",paragraphs:["Follow the process of building games from scratch, from coding mechanics to custom 2D/3D design."],url:"https://www.youtube.com/watch?v=MXx1YIIhuWM"}
];
export const art = [
  {title:"Skikai Desktop Art",stack:"Digital illustration",paragraphs:["Custom artwork for my AI companion. Drawing has become central to my game development process."],image:"assets/images/skikai.png",url:"https://github.com/dimos1234/Skikai-Dektop"},
  {title:"Birdbrain / Teto",stack:"Digital illustration",paragraphs:["An illustration from my growing collection of character art and digital sketches."],image:"assets/images/birdbrain-teto.png"},
  {title:"Miku",stack:"Digital illustration",paragraphs:["Character artwork from my digital canvas."],image:"assets/images/miku-pose.png"}
];
export const life = [
  {title:"Martial Arts",stack:"Wushu / Tricking / Calisthenics",paragraphs:["I competed internationally in Wushu/Kung Fu growing up and placed third at worlds. These days I'm into tricking and calisthenics, still chasing flips."]},
  {title:"Music & Games",stack:"Piano / Vocaloid / Games",paragraphs:["Outside coding I'm usually playing games, watching anime, or at the piano. I enjoy picking apart fast Vocaloid songs by ear and figuring them out on keys."]},
  {title:"Keyboards & Cubing",stack:"Mechanical keyboards / Speedcubing",paragraphs:["I speedcube and build custom mechanical keyboards. I enjoy taking things apart, modding them, and dialing in how they feel."]}
];
export const collections = { projects, experience, games, art, life };
