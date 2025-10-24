let cookies = 0;
let autoClickers = 0;
let multiplier = 1;
let achievements = [];
let playerName = "Player";
let isAdmin = false;
const autoClickerCost = 50;
const ADMIN_CODE = "admin123"; // The secret admin code

const ACHIEVEMENTS = {
    ROOKIE: { name: "Cookie Rookie", requirement: 100, description: "Earn 100 cookies" },
    BAKER: { name: "Amateur Baker", requirement: 1000, description: "Earn 1,000 cookies" },
    MASTER: { name: "Cookie Master", requirement: 10000, description: "Earn 10,000 cookies" }
};

// Load saved data
function loadGame() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            cookies = data.cookies || 0;
            autoClickers = data.autoClickers || 0;
            updateDisplay();
        })
        .catch(() => {
            cookies = 0;
            autoClickers = 0;
            saveGame();
        });
}

// Save game data
function saveGame() {
    const data = {
        cookies: cookies,
        autoClickers: autoClickers
    };
    
    fetch('data.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

function updateDisplay() {
    document.getElementById('counter').textContent = `Cookies: ${Math.floor(cookies)}`;
    const autoClickerBtn = document.getElementById('autoClickerBtn');
    autoClickerBtn.disabled = cookies < autoClickerCost;
}

function createFloatingText(value) {
    const cookie = document.getElementById('cookie');
    const rect = cookie.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    
    const text = document.createElement('div');
    text.textContent = '+' + value;
    text.className = 'floating-text';
    text.style.left = x + 'px';
    text.style.top = y + 'px';
    
    document.body.appendChild(text);
    setTimeout(() => document.body.removeChild(text), 1000);
}

function clickCookie() {
    const amount = 1 * multiplier;
    cookies += amount;
    createFloatingText(amount);
    updateDisplay();
    saveGame();
    checkAchievements();
    
    // Add sparkle effect
    const cookie = document.getElementById('cookie');
    cookie.style.filter = 'brightness(1.5) drop-shadow(0 0 15px gold)';
    setTimeout(() => {
        cookie.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.3))';
    }, 100);
}

function buyAutoClicker() {
    if (cookies >= autoClickerCost) {
        cookies -= autoClickerCost;
        autoClickers++;
        updateDisplay();
        saveGame();
    }
}

// Golden Cookie functionality
function spawnGoldenCookie() {
    const goldenCookie = document.getElementById('goldenCookie');
    if (goldenCookie.classList.contains('hidden')) {
        const gameContainer = document.querySelector('.game-container');
        const rect = gameContainer.getBoundingClientRect();
        
        goldenCookie.style.left = (Math.random() * (rect.width - 80)) + 'px';
        goldenCookie.style.top = (Math.random() * (rect.height - 80)) + 'px';
        goldenCookie.classList.remove('hidden');
        
        setTimeout(() => {
            if (!goldenCookie.classList.contains('hidden')) {
                goldenCookie.classList.add('hidden');
            }
        }, 5000);
    }
}

function clickGoldenCookie() {
    const goldenCookie = document.getElementById('goldenCookie');
    goldenCookie.classList.add('hidden');
    multiplier = 2;
    document.getElementById('multiplier').textContent = '2x Cookies for 30 seconds!';
    
    setTimeout(() => {
        multiplier = 1;
        document.getElementById('multiplier').textContent = '';
    }, 30000);
}

// Achievement system
function checkAchievements() {
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (cookies >= achievement.requirement && !achievements.includes(key)) {
            achievements.push(key);
            displayAchievement(achievement);
        }
    }
}

function displayAchievement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = 'achievement';
    achievementDiv.textContent = `🏆 ${achievement.name} - ${achievement.description}`;
    document.getElementById('achievementsList').appendChild(achievementDiv);
}

// Auto clicker functionality
setInterval(() => {
    if (autoClickers > 0) {
        const amount = autoClickers * 0.1 * multiplier;
        cookies += amount;
        updateDisplay();
        saveGame();
        checkAchievements();
    }
}, 100);

// Login system
function initializeLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('startGame').addEventListener('click', handleLogin);
}

function handleLogin() {
    const nameInput = document.getElementById('playerName');
    const adminInput = document.getElementById('adminCode');
    const loginModal = document.getElementById('loginModal');
    
    playerName = nameInput.value.trim() || "Player";
    isAdmin = adminInput.value === ADMIN_CODE;
    
    loginModal.style.opacity = '0';
    loginModal.style.transform = 'scale(0.9)';
    setTimeout(() => {
        loginModal.remove();
    }, 300);
    
    document.getElementById('playerInfo').textContent = `Welcome, ${playerName}!`;
    
    if (isAdmin) {
        document.getElementById('adminPanel').classList.remove('hidden');
    }
    
    loadGame();
}

// Admin functions
function setupAdminPanel() {
    document.getElementById('giveCookies').addEventListener('click', () => {
        if (isAdmin) {
            cookies += 1000;
            updateDisplay();
            saveGame();
        }
    });
    
    document.getElementById('giveAutoClickers').addEventListener('click', () => {
        if (isAdmin) {
            autoClickers += 5;
            updateDisplay();
            saveGame();
        }
    });
    
    document.getElementById('toggleGolden').addEventListener('click', () => {
        if (isAdmin) {
            spawnGoldenCookie();
        }
    });
}

// Initialize game
window.addEventListener('load', () => {
    initializeLogin();
    setupAdminPanel();
});