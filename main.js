const cube = document.getElementById("cube1");
const gameWorld = document.getElementById("game-world");

let posX = 200, posY = 30;
let velocityX = 10, velocityY = 0;
let gravity = 0.5;
let isOnGround = false;
let stage = 1;

let inventory = [];

function addComponent() {
    const code = document.getElementById('editor').value;
    const element = document.createElement('div');
    element.className = 'game-object';
    element.innerHTML = code;
    document.getElementById('game-world').appendChild(element);
}

function saveToInventory() {
    const code = document.getElementById('editor').value;
    inventory.push(code);
    updateInventory();
}

function updateInventory() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    inventory.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.innerText = `Component ${index + 1}`;
        btn.onclick = () => loadComponent(item);
        inventoryDiv.appendChild(btn);
    });
}

function loadComponent(code) {
    document.getElementById('editor').value = code;
}

function update() {
    
    document.querySelectorAll('.stage').forEach(stageDiv => {
        stageDiv.style.display = 'none';
    });
    // Show the current stage based on the value of `stage`
    if (stage == 1) {
        document.getElementById("stage1").style.display = "block";
    } else if (stage == 2) {
        document.querySelectorAll('.dialogue').forEach(dialogueDiv => {
            dialogueDiv.style.display = 'block';
        });
        document.getElementById("stage2").style.display = "block";
    }


    velocityY += gravity; // Apply gravity
    posY += velocityY;
    posX += velocityX;

    // Get game world and cube boundaries
    let gameBottom = gameWorld.clientHeight - cube.clientHeight;
    let gameRight = gameWorld.clientWidth - cube.clientWidth;
    // test if (posX == gameRight) { stage++; }
    // Collision with the bottom (ground)
    if (posY >= gameBottom) {
        posY = gameBottom;
        velocityY = 0; // Stop falling
        isOnGround = true;
    } else {
        isOnGround = false;
    }

    // Collision with right border
    if (posX >= gameRight) {
        posX = gameRight;
        velocityX = 0; // Stop moving right
    }

    // Apply movement
    cube.style.left = posX + "px";
    cube.style.top = posY + "px";

    requestAnimationFrame(update);
}

update();
