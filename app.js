// Shared JavaScript for lincolncj.github.io
// Handles navigation, pocket interactions, and lockdown feature

// Lockdown feature configuration
const LOCKDOWN_CONFIG = {
  enabled: false, // Set to true to enable password protection
  password: 'secretpassword123', // Change this password as needed
  isUnlocked: false
};

// Navigation functionality
function initNavigation() {
  const navDropdown = document.getElementById('navDropdown');
  const navButton = document.getElementById('navButton');
  const navMenu = document.getElementById('navMenu');

  if (!navDropdown || !navButton || !navMenu) return;

  navButton.addEventListener('click', (e) => {
    e.preventDefault();
    navDropdown.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!navDropdown.contains(e.target)) {
      navDropdown.classList.remove('open');
    }
  });
}

// Common pocket game functionality
function initPocketGame(config) {
  // Check lockdown before allowing interaction
  if (LOCKDOWN_CONFIG.enabled && !LOCKDOWN_CONFIG.isUnlocked) {
    return;
  }

  const pocket = document.getElementById('pocket');
  const speech = document.getElementById('speech');
  const checkBtn = document.getElementById('checkBtn');
  const feedBtn = document.getElementById('feedBtn');
  const fullscreen = document.getElementById('fullscreenReveal');

  if (!pocket || !speech || !checkBtn || !feedBtn || !fullscreen) return;

  const {
    lines = [],
    confettiEmoji = '🎉',
    confettiFunction = null,
    feedMessage = 'Thanks!'
  } = config;

  function sayRandom() {
    if (lines.length === 0) return;
    const line = lines[Math.floor(Math.random() * lines.length)];
    speech.textContent = line;
  }

  function defaultConfetti(count = 22) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'confetti';
      s.textContent = confettiEmoji;
      const duration = 2600 + Math.random() * 2200;
      const size = 18 + Math.random() * 20;
      const startX = Math.random() * 100;
      const delay = Math.random() * 400;

      s.style.left = startX + 'vw';
      s.style.fontSize = size + 'px';
      s.style.animationDuration = duration + 'ms';
      s.style.animationDelay = delay + 'ms';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), duration + delay + 150);
    }
  }

  const dropConfetti = confettiFunction || defaultConfetti;

  checkBtn.addEventListener('click', () => {
    // Pop the item
    pocket.classList.add('active');
    checkBtn.disabled = true;

    // Chat a bit
    sayRandom();

    // Confetti for comedic effect
    dropConfetti(28);

    // Dramatic "full screen" reveal
    setTimeout(() => fullscreen.classList.add('show'), 1200);
  });

  feedBtn.addEventListener('click', () => {
    dropConfetti(18);
    // Make the character say thanks if visible
    if (pocket.classList.contains('active')) {
      speech.textContent = feedMessage;
      speech.style.opacity = 1;
    }
  });

  // Click anywhere on the fullscreen to close and reset
  fullscreen.addEventListener('click', () => {
    fullscreen.classList.remove('show');
    
    // Handle video if present (for Brian's page)
    const video = document.getElementById('brianVideo');
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.autoplay = false;
      video.loop = false;
    }
    
    // Reset after a moment
    setTimeout(() => {
      pocket.classList.remove('active');
      checkBtn.disabled = false;
      speech.style.opacity = 0;
    }, 400);
  });

  // Make the speech bubble fade back out after a while
  const observer = new MutationObserver(() => {
    speech.style.opacity = 1;
    clearTimeout(speech._hideTimer);
    speech._hideTimer = setTimeout(() => speech.style.opacity = 0, 2500);
  });
  observer.observe(speech, { childList: true });
}

// Lockdown functionality
function checkLockdown() {
  if (!LOCKDOWN_CONFIG.enabled) {
    LOCKDOWN_CONFIG.isUnlocked = true;
    return true;
  }

  if (LOCKDOWN_CONFIG.isUnlocked) {
    return true;
  }

  // Show password prompt
  const userPassword = prompt('This site is locked. Please enter the password:');
  
  if (userPassword === LOCKDOWN_CONFIG.password) {
    LOCKDOWN_CONFIG.isUnlocked = true;
    return true;
  } else if (userPassword !== null) {
    alert('Incorrect password. Access denied.');
  }
  
  return false;
}

// Initialize lockdown check and page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check lockdown first
  if (!checkLockdown()) {
    // If lockdown is enabled and user didn't enter correct password,
    // hide the page content and show a locked message
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #222;
        color: #fff;
        font-family: system-ui, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <h1>🔒 Site Locked</h1>
        <p>This site is currently locked and requires a password to access.</p>
        <button onclick="location.reload()" style="
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        ">Try Again</button>
      </div>
    `;
    return;
  }

  // Initialize navigation
  initNavigation();
});

// Page-specific configurations
const PAGE_CONFIGS = {
  mouse: {
    lines: [
      "squeak!",
      "I pay pocket rent.",
      "Tiny roommate privileges.",
      "100% mouse. 0% hamster.",
      "Hey Grant, got snacks?"
    ],
    confettiEmoji: '🧀',
    feedMessage: "Cheesy gratitude!"
  },
  
  chocolate: {
    lines: [
      "I love chocolate!",
      "But I can't eat it...",
      "Cause I'll get fat!",
      "This is my dilemma.",
      "Why is life so cruel?",
      "Chocolate is my spirit animal.",
      "If lost, please return to nearest chocolate bar.",
      "I tried to give up chocolate, but I'm not a quitter.",
      "Will work for chocolate.",
      "Chocolate understands me.",
      "Chocolate doesn't judge me."
    ],
    confettiEmoji: '🍫',
    feedMessage: "But I can't eat it cause I'll get fat!"
  },
  
  eggplant: {
    lines: [
      "It's just a vegetable, I swear!",
      "My name is SO unfortunate...",
      "Stop snickering! It's an eggplant!",
      "Yes, BLAYCOCK... why did my parents do this?!",
      "The jokes never end! 😭",
      "It's not funny! ...okay it's a little funny",
      "🍆 + 'cock' = my eternal suffering",
      "I can't escape the phallic humor!",
      "Why couldn't I be Jeffrey Smith?!",
      "Everyone thinks it's HILARIOUS! 🙄",
      "Eggplants are healthy, okay?!",
      "Purple produce persecution!"
    ],
    confettiEmoji: '🍆',
    feedMessage: "More eggplants?! You're terrible!"
  },
  
  skunk: {
    lines: [
      "Pee-yew!",
      "Sorry about the smell...",
      "It's not my fault!",
      "That's just how skunks are!",
      "Want to be friends anyway?",
      "I promise I won't spray you!",
      "Well... probably won't spray you.",
      "My cologne is eau de skunk!",
      "Natural defense mechanism!",
      "Scent-sational, isn't it?",
      "Don't judge me by my smell!"
    ],
    confettiEmoji: '💨',
    feedMessage: "Thanks for the stink bombs!"
  }
};

// Helper function to initialize a specific page
function initPage(pageType) {
  if (!PAGE_CONFIGS[pageType]) {
    console.warn(`Unknown page type: ${pageType}`);
    return;
  }
  
  initPocketGame(PAGE_CONFIGS[pageType]);
}