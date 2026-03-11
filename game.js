// Game Constants and Map
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 20;
const ROWS = 28;
const COLS = 28;

// 0: Path, 1: Wall, 2: Money Bag, 3: Badge (Power-up), 4: Empty (Ghost House / Tunnels)
// Basic Pac-Man-like maze structure
const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,4,1,1,4,1,1,1,1,1,2,1,1,1,1,1,1],
    [4,4,4,4,4,1,2,1,1,4,4,4,4,4,4,4,4,4,4,1,1,2,1,4,4,4,4,4],
    [4,4,4,4,4,1,2,1,1,4,1,1,1,0,0,1,1,1,4,1,1,2,1,4,4,4,4,4],
    [1,1,1,1,1,1,2,1,1,4,1,4,4,4,4,4,4,1,4,1,1,2,1,1,1,1,1,1],
    [4,4,4,4,4,4,2,4,4,4,1,4,4,4,4,4,4,1,4,4,4,2,4,4,4,4,4,4],
    [1,1,1,1,1,1,2,1,1,4,1,1,1,1,1,1,1,1,4,1,1,2,1,1,1,1,1,1],
    [4,4,4,4,4,1,2,1,1,4,4,4,4,4,4,4,4,4,4,1,1,2,1,4,4,4,4,4],
    [4,4,4,4,4,1,2,1,1,4,1,1,1,1,1,1,1,1,4,1,1,2,1,4,4,4,4,4],
    [1,1,1,1,1,1,2,1,1,4,1,1,1,1,1,1,1,1,4,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Visual Settings
const COLORS = {
    wall: '#2c3e50',         // Buildings
    wallBorder: '#1a252f',   // Building outline
    path: '#444444',         // Asphalt
    roadLines: '#f1c40f',    // Yellow stripes
    money: '#2ecc71',
    badge: '#3498db',
    player: '#f1c40f',
    chaser: '#e74c3c',
    strategic: '#ffb8ae',
    random: '#e67e22',
    panic: '#3498db',
    panicFlash: '#ecf0f1'
};

let mapGrid = [];
let arrests = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;
let animationId;
let armedModeTimer = 0;
let totalMoney = 0; 
let stolenMoney = 0;

// DOM Elements
const arrestsElement = document.getElementById('arrests');
const stolenElement = document.getElementById('stolen');
const livesElement = document.getElementById('lives');
const messageOverlay = document.getElementById('message-overlay');
const messageText = document.getElementById('message-text');

// Keyboard State
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', (e) => {
    if(keys.hasOwnProperty(e.key)) keys[e.key] = true;
    if(gameOver && e.code === 'Space') resetGame();
});

document.addEventListener('keyup', (e) => {
    if(keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Entity Classes
class Entity {
    constructor(r, c, color) {
        this.r = r;
        this.c = c;
        this.x = c * TILE_SIZE;
        this.y = r * TILE_SIZE;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.speed = 2; // Fixed unit speed
        this.radius = TILE_SIZE / 2 * 0.8;
    }

    draw(icon = '') {
        if (icon) {
            ctx.font = `${this.radius * 2 * 1.2}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, this.x + TILE_SIZE/2, this.y + TILE_SIZE/2);
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x + TILE_SIZE/2, this.y + TILE_SIZE/2, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    canMove(dx, dy) {
        // Look ahead 1 full tile
        let targetC = this.c + dx;
        let targetR = this.r + dy;
        
        // Wrap around bounds (tunnels)
        if (targetC < 0) targetC = COLS - 1;
        if (targetC >= COLS) targetC = 0;
        
        if (mapGrid[targetR][targetC] === 1) return false;
        
        // Ghost house restrictions etc could go here
        return true;
    }
}

class Player extends Entity {
    constructor() {
        // Start near bottom
        super(23, 13, COLORS.player);
        this.nextVx = 0;
        this.nextVy = 0;
    }

    update() {
        // Input translation
        if (keys.ArrowUp || keys.w) { this.nextVx = 0; this.nextVy = -1; }
        else if (keys.ArrowDown || keys.s) { this.nextVx = 0; this.nextVy = 1; }
        else if (keys.ArrowLeft || keys.a) { this.nextVx = -1; this.nextVy = 0; }
        else if (keys.ArrowRight || keys.d) { this.nextVx = 1; this.nextVy = 0; }

        // Grid alignment logic for turning
        let atGridX = (this.x % TILE_SIZE === 0);
        let atGridY = (this.y % TILE_SIZE === 0);

        if (atGridX && atGridY) {
            this.c = this.x / TILE_SIZE;
            this.r = this.y / TILE_SIZE;

            // Attempt queued turn
            if ((this.nextVx !== 0 || this.nextVy !== 0) && this.canMove(this.nextVx, this.nextVy)) {
                this.vx = this.nextVx;
                this.vy = this.nextVy;
            } else if (!this.canMove(this.vx, this.vy)) {
                // Hit wall going straight
                this.vx = 0;
                this.vy = 0;
            }
        }

        // Apply Movement
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;

        // Tunnel Wrap
        if (this.x < -TILE_SIZE/2) this.x = canvas.width;
        if (this.x > canvas.width) this.x = -TILE_SIZE/2;

        this.handleCollisions();
    }

    draw() {
        super.draw('🚓'); // Player is now the Police!
    }

    handleCollisions() {
        // Player (Police) no longer interacts with dots, only with Robbers
    }
}

// Temporary AI stub, will expand
class Enemy extends Entity {
    constructor(r, c, color, type) {
        super(r, c, color);
        this.baseColor = color;
        this.type = type; // 'chaser', 'strategic', 'random'
        this.state = 'rob'; // rob, armed, base, arrested
        this.speed = 1.5; // Slightly slower than player
        this.dirX = 0;
        this.dirY = -1; // Start by trying to move up out of the house
    }

    update() {
        let atGridX = (Math.abs(this.x % TILE_SIZE) < 1);
        let atGridY = (Math.abs(this.y % TILE_SIZE) < 1);

        if (atGridX && atGridY) {
            // Snap to grid exactly to avoid floating point issues
            this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
            this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
            this.c = this.x / TILE_SIZE;
            this.r = this.y / TILE_SIZE;

            // Tunnel Wrap for Ghosts
            if (this.c <= 0) { this.x = (COLS - 1) * TILE_SIZE; this.c = COLS - 1; }
            if (this.c >= COLS - 1) { this.x = 0; this.c = 0; }

            // Determine Target Tile
            let targetC = player.c;
            let targetR = player.r;

            if (this.state === 'armed') {
                // If armed, aggressively target the police
                targetC = player.c;
                targetR = player.r;
            } else if (this.type === 'strategic') {
                targetC = player.c + (player.vx * 4);
                targetR = player.r + (player.vy * 4);
            } else if (this.type === 'random') {
                // Ignore player, just pick a corner
                let dist = Math.hypot(player.c - this.c, player.r - this.r);
                if (dist < 8) {
                    targetC = 0; 
                    targetR = ROWS - 1; 
                }
            } else {
                // Chaser doesn't chase player but runs away if close!
                let dist = Math.hypot(player.c - this.c, player.r - this.r);
                if (dist < 5) {
                    targetC = COLS - 1 - player.c;
                    targetR = ROWS - 1 - player.r;
                }
            }

            // Pathfinding decisions
            // Available directions (Up, Left, Down, Right order)
            const dirs = [
                {dx: 0, dy: -1},
                {dx: -1, dy: 0},
                {dx: 0, dy: 1},
                {dx: 1, dy: 0}
            ];

            let bestDist = Infinity;
            let bestDir = null;
            let validMoves = [];

            for (let d of dirs) {
                // Cannot reverse direction unless in panic transition (handled elsewhere)
                if (d.dx === -this.dirX && d.dy === -this.dirY && (this.dirX !== 0 || this.dirY !== 0)) {
                    continue;
                }

                if (this.canMove(d.dx, d.dy)) {
                    validMoves.push(d);
                    let dist = Math.hypot((this.c + d.dx) - targetC, (this.r + d.dy) - targetR);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestDir = d;
                    }
                }
            }

            if (validMoves.length > 0) {
                // If random and in random state, just pick a valid random direction (that isn't backwards)
                if (this.type === 'random' && Math.random() < 0.3) {
                     bestDir = validMoves[Math.floor(Math.random() * validMoves.length)];
                } else if(!bestDir) {
                     bestDir = validMoves[0]; // fallback
                }

                this.dirX = bestDir.dx;
                this.dirY = bestDir.dy;
            } else {
                // Dead end (shouldn't happen in pacman, but just in case, reverse)
                this.dirX *= -1;
                this.dirY *= -1;
            }
        }

        // Move
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;

        // Visual handling (colors handled in draw)
        this.handleGridCollisions();
    }

    handleGridCollisions() {
        if (this.state === 'base' || this.state === 'arrested') return;
        
        let gridC = Math.round(this.x / TILE_SIZE);
        let gridR = Math.round(this.y / TILE_SIZE);
        
        if (gridC >= 0 && gridC < COLS && gridR >= 0 && gridR < ROWS) {
            let tile = mapGrid[gridR][gridC];
            
            // Robber Steals Money (2)
            if (tile === 2) {
                mapGrid[gridR][gridC] = 0;
                stolenMoney += 10;
                stolenElement.innerText = stolenMoney;
            }
            // Robber Collects Weapon (3)
            else if (tile === 3) {
                mapGrid[gridR][gridC] = 0;
                triggerArmedMode();
            }
        }
    }

    draw() {
        if (this.state === 'arrested') return; // Don't draw if in jail
        
        let icon = '🥷'; // Enemies are now the Robbers!
        
        // Colored circle behind the sprite to distinguish ghost types or panic mode
        if (this.state === 'armed') {
            this.color = (armedModeTimer < 2000 && Math.floor(Date.now() / 200) % 2 === 0) ? COLORS.panicFlash : COLORS.panic;
            icon = (armedModeTimer < 2000 && Math.floor(Date.now() / 200) % 2 === 0) ? '🔫' : '👿';
        } else {
            this.color = this.baseColor;
        }

        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x + TILE_SIZE/2, this.y + TILE_SIZE/2, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        super.draw(icon);
    }
}

// Game State Instances
let player;
let enemies = [];

function initMap() {
    mapGrid = JSON.parse(JSON.stringify(MAP)); // deep copy
    totalMoney = 0;
    
    // Calculate total money
    for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
            if(mapGrid[r][c] === 2) totalMoney++;
        }
    }
}

function initEntities() {
    player = new Player();
    enemies = [];
    // Spawns
    enemies.push(new Enemy(11, 13, COLORS.chaser, 'chaser'));
    enemies.push(new Enemy(13, 11, COLORS.strategic, 'strategic'));
    enemies.push(new Enemy(13, 15, COLORS.random, 'random'));
    enemies.push(new Enemy(15, 13, COLORS.random, 'random')); // 4th robber
}

function drawMap() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let tile = mapGrid[r][c];
            let x = c * TILE_SIZE;
            let y = r * TILE_SIZE;

            if (tile === 1) {
                // Buildings
                ctx.fillStyle = COLORS.wallBorder;
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = COLORS.wall;
                ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                
                // Add tiny windows to make it building-like
                ctx.fillStyle = COLORS.wallBorder;
                ctx.fillRect(x + 4, y + 4, 4, 4);
                ctx.fillRect(x + 12, y + 4, 4, 4);
                ctx.fillRect(x + 4, y + 12, 4, 4);
                ctx.fillRect(x + 12, y + 12, 4, 4);
            } else {
                // Asphalt path
                ctx.fillStyle = COLORS.path;
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            }

            if (tile === 2) {
                // Money Bag Emoji - rendered smaller
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💰', x + TILE_SIZE/2, y + TILE_SIZE/2);
            } else if (tile === 3) {
                // Badge Emoji
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🛡️', x + TILE_SIZE/2, y + TILE_SIZE/2);
            }
        }
    }
}

function triggerArmedMode() {
    armedModeTimer = 8000; // 8 seconds
    enemies.forEach(e => {
        if(e.state !== 'base' && e.state !== 'arrested') e.state = 'armed';
    });
}

function endGame(win, msg) {
    messageOverlay.classList.remove('hidden');
    messageText.innerText = msg;
    if (win) {
        messageText.className = 'win';
    } else {
        messageText.className = '';
    }
}

function resetGame() {
    arrests = 0;
    stolenMoney = 0;
    lives = 3;
    arrestsElement.innerText = arrests;
    stolenElement.innerText = stolenMoney;
    livesElement.innerText = lives;
    gameOver = false;
    gameWon = false;
    armedModeTimer = 0;
    messageOverlay.classList.add('hidden');
    initMap();
    initEntities();
    if (animationId) cancelAnimationFrame(animationId);
    lastTime = document.timeline.currentTime || performance.now();
    requestAnimationFrame(gameLoop);
}

function handleEntityCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        let e = enemies[i];
        if (e.state === 'arrested') continue; // Ignore if already in jail
        
        let dist = Math.hypot(player.x - e.x, player.y - e.y);
        
        // Simple circle collision
        if (dist < player.radius + e.radius) {
            if (e.state === 'armed') {
                // Armed Robber defeats Police!
                lives--;
                livesElement.innerText = lives;
                if (lives <= 0) {
                    gameOver = true;
                    endGame(false, 'VIATURA DESTRUÍDA!');
                } else {
                    // Reset positions
                    initEntities();
                }
                break; // Stop checking further collisions this frame
            } else if (e.state !== 'base') {
                // Police Arrests Robber!
                arrests++;
                arrestsElement.innerText = arrests;
                
                // Send to jail
                e.state = 'arrested';
                e.x = 13 * TILE_SIZE;
                e.y = 13 * TILE_SIZE;
                
                if (arrests >= 4) { // All 4 robbers caught
                    gameOver = true;
                    gameWon = true;
                    endGame(true, 'TODOS PRESOS!');
                }
            }
        }
    }
}

// Main Loop
let lastTime = performance.now();
function gameLoop(timestamp) {
    if (gameOver) return;
    
    let dt = timestamp - lastTime;
    lastTime = timestamp;

    if (armedModeTimer > 0) {
        armedModeTimer -= dt;
        if (armedModeTimer <= 0) {
            enemies.forEach(e => { if(e.state === 'armed') e.state = 'rob'; });
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update
    player.update();
    enemies.forEach(e => e.update());
    
    handleEntityCollisions();

    // Draw
    drawMap();
    if (!gameOver || gameWon) {
        player.draw();
        enemies.forEach(e => e.draw());
    }

    if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start
initMap();
initEntities();
requestAnimationFrame(gameLoop);
