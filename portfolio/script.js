// --- Scroll Reveal Animation ---
// This watches for elements entering the screen and adds the 'show' class
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

// Grab all elements that have the 'hidden' class
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// --- Typing Effect for the Hero Section ---
const text = "Code. Design. Create.";
const typingElement = document.getElementById("typewriter");
let index = 0;

function typeWriter() {
    if (typingElement && index < text.length) {
        typingElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100); // 100ms delay between each letter
    }
}

// Start the typing effect after a tiny delay when the page loads
window.onload = () => {
    setTimeout(typeWriter, 500);
};

// --- Konami Code Easter Egg ---
// The sequence of keys the user needs to press
// --- Console Greeting ---
console.log("%c[System Online] Looking under the hood? Try the Konami code on the main page.", "color: #39C5BB; font-size: 14px; font-weight: bold;");

// --- Master Easter Egg Tracker ---
let typedKeys = '';
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

document.addEventListener('keydown', function(e) {
    // 1. Konami Code Tracker
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            activateActionTheme();
            konamiPosition = 0; 
        }
    } else {
        konamiPosition = 0;
    }

    // 2. Keyword Tracker
    typedKeys += e.key.toLowerCase();
    if (typedKeys.length > 20) typedKeys = typedKeys.slice(-20); // Keep memory clean

    // Undertale / Undyne Trigger
    if (typedKeys.includes('undyne')) {
        activateSpearOfJustice();
        typedKeys = typedKeys.replace('undyne', ''); // Reset
    }

    // Vocaloid / Rhythm Trigger (39 = San-Kyu / Miku)
    if (typedKeys.includes('39')) {
        rhythmGameDrop();
        typedKeys = typedKeys.replace('39', ''); // Reset
    }

    // Minecraft / Builder Trigger
    if (typedKeys.includes('craft')) {
        document.body.style.fontFamily = "'Courier New', Courier, monospace";
        typedKeys = typedKeys.replace('craft', ''); // Reset
    }
});

// --- Easter Egg Functions ---

function activateActionTheme() {
    const root = document.documentElement;
    root.style.setProperty('--accent-teal', '#D64A4C'); // Swap to Red
    root.style.setProperty('--action-red', '#39C5BB');  // Swap to Teal
    root.style.setProperty('--bg-main', '#191A1E');     // Dark Mode
    root.style.setProperty('--text-main', '#FFFFFF');
    root.style.setProperty('--bg-alt', '#2A2B30');      
    alert("System Override: Action Mode Activated.");
}

function activateSpearOfJustice() {
    const root = document.documentElement;
    root.style.setProperty('--accent-teal', '#00B4D8'); // Fierce Spear Blue
    root.style.setProperty('--action-red', '#EF233C');  // HP Red
    root.style.setProperty('--bg-main', '#000000');     // Pitch Black Underground
    root.style.setProperty('--text-main', '#FFFFFF');
    root.style.setProperty('--bg-alt', '#0a0a0a');      
    alert("Ngahhhh!! Spear of Justice Mode Activated.");
}

function rhythmGameDrop() {
    // Creates a falling note effect
    const symbols = ['🎵', '🎶', '✨', '⚡'];
    const drop = document.createElement('div');
    
    drop.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    drop.style.position = 'fixed';
    drop.style.left = Math.random() * 90 + 'vw';
    drop.style.top = '-50px';
    drop.style.fontSize = '3rem';
    drop.style.zIndex = '9999';
    drop.style.pointerEvents = 'none'; // So it doesn't block clicks
    drop.style.transition = 'top 2s linear, transform 2s linear';
    
    document.body.appendChild(drop);

    // Trigger the fall
    setTimeout(() => {
        drop.style.top = '120vh';
        drop.style.transform = `rotate(${Math.random() * 360}deg)`;
    }, 50);

    // Clean up
    setTimeout(() => {
        drop.remove();
    }, 2050);
}

// --- osu! Global Click Effect ---
document.addEventListener('mousedown', function(e) {
    // The center hit circle
    const circle = document.createElement('div');
    circle.classList.add('osu-hit');
    circle.style.left = e.pageX + 'px';
    circle.style.top = e.pageY + 'px';
    document.body.appendChild(circle);

    // The shrinking approach circle
    const approach = document.createElement('div');
    approach.classList.add('osu-approach');
    approach.style.left = e.pageX + 'px';
    approach.style.top = e.pageY + 'px';
    document.body.appendChild(approach);

    setTimeout(() => {
        circle.remove();
        approach.remove();
    }, 300);
});

// --- Miku / Teto Theme Switcher & Animations ---
const vocalToggle = document.getElementById('vocal-toggle');
let isTetoMode = false;

if (vocalToggle) {
    vocalToggle.addEventListener('click', () => {
        const root = document.documentElement;
        isTetoMode = !isTetoMode;

        if (isTetoMode) {
            root.style.setProperty('--accent-teal', '#D64A4C'); // Teto Red
            root.setAttribute('data-theme', 'teto'); // Changes grid color
            vocalToggle.innerText = '[ 04 ] Mode';
            vocalToggle.style.backgroundColor = '#D64A4C';
            spawnIcons('🥖'); // Baguettes
        } else {
            root.style.setProperty('--accent-teal', '#39C5BB'); // Miku Teal
            root.removeAttribute('data-theme');
            vocalToggle.innerText = '[ 01 ] Mode';
            vocalToggle.style.backgroundColor = '#39C5BB';
            spawnIcons('葱'); // Leek (Negi)
        }
    });
}

// function spawnIcons(emoji) {
//     // Spawns 5 falling icons when toggled
//     for (let i = 0; i < 5; i++) {
//         setTimeout(() => {
//             const item = document.createElement('div');
//             item.innerText = emoji;
//             item.style.position = 'fixed';
//             item.style.left = Math.random() * 90 + 'vw';
//             item.style.top = '-50px';
//             item.style.fontSize = '2.5rem';
//             item.style.pointerEvents = 'none';
//             item.style.transition = 'top 3s linear, transform 3s linear';
//             item.style.zIndex = '9999';
//             document.body.appendChild(item);
            
//             setTimeout(() => {
//                 item.style.top = '120vh';
//                 item.style.transform = `rotate(${Math.random() * 720}deg)`;
//             }, 50);
            
//             setTimeout(() => item.remove(), 3050);
//         }, i * 200); // Staggers the drops
//     }
// }

// --- Undyne Dodge Button ---
// --- Tighter Undyne Dodge ---
const undyneBtn = document.getElementById('undyne-btn');

if (undyneBtn) {
    undyneBtn.addEventListener('mouseover', () => {
        // Shrunk the dodge distance so it stays inside the 300x150 box
        const x = Math.floor(Math.random() * 120) - 60; 
        const y = Math.floor(Math.random() * 60) - 30; 
        
        undyneBtn.style.transform = `translate(${x}px, ${y}px)`;
    });

    undyneBtn.addEventListener('click', () => {
        alert("* The wind is howling... (You finally clicked it!)");
    });
}

// --- Horror Sanity Glitch ---
const glitchTrigger = document.getElementById('glitch-trigger');

if (glitchTrigger) {
    glitchTrigger.addEventListener('click', () => {
        document.body.classList.add('sanity-loss');
        
        // Return to normal after 2 seconds
        setTimeout(() => {
            document.body.classList.remove('sanity-loss');
        }, 2000);
    });
}

/* bottom of script.js */
// Switches themes every 10 seconds