const cube = document.getElementById("cube1");
const gameWorld = document.getElementById("game-world");

let posX = 200, posY = 30;
let velocityX = 10, velocityY = 0;
let gravity = 0.5;
let stage = 0;
let isOnGround = false;
let isVillagerMoving = false;
let villagers = [
    {
        initPosX: 100,
        initPosY: 300,
        posX: 100,
        posY: 300,
        velocityY: 0,
    },
    {
        initPosX: 180,
        initPosY: 300,
        posX: 180,
        posY: 300,
        velocityY: 0,
    },
    {
        initPosX: 260,
        initPosY: 300,
        posX: 260,
        posY: 300,
        velocityY: 0,
    },
    {
        initPosX: 340,
        initPosY: 300,
        posX: 340,
        posY: 300,
        velocityY: 0,
    },
];
let inventory = [];

// ---------------
function showDialogue(newText) {
    const dialogueDiv = document.getElementById('dialogue');
    dialogueDiv.style.display = 'block';
    const dialogueTextDiv = document.getElementById('dialogueText'); // Get the div
    const paragraph = dialogueTextDiv.querySelector('p');
    if (paragraph) {
        paragraph.innerText = newText; // Change the text
    }
}
function closeDialogue(newText) {
    const dialogueDiv = document.getElementById('dialogue');
    dialogueDiv.style.display = 'none';
}

function fadeIn(element, duration) {
    let opacity = 0;
    element.style.display = 'flex'; // Make it visible before fading
    function increase() {
        if (opacity < 1) {
            opacity += 0.1; // Gradually increase opacity
            element.style.opacity = opacity;
            requestAnimationFrame(increase);
        }
    }
    increase();
}

function fadeOut(element, duration) {
    let opacity = 1;
    function decrease() {
        if (opacity > 0) {
            opacity -= 0.1; // Gradually decrease opacity
            element.style.opacity = opacity;
            requestAnimationFrame(decrease);
        } else {
            element.style.display = 'none'; // Hide it when fully transparent
        }
    }
    decrease();
}

function showNotice(newText) {
    const noticeDiv = document.getElementById('notice');
    const noticeTextDiv = document.getElementById('noticeText');
    const paragraph = noticeTextDiv.querySelector('p');

    if (paragraph) {
        paragraph.innerText = newText; // Change the text
    }

    fadeIn(noticeDiv, 500); // Fade in over 0.5s

    // Wait 5 seconds, then fade out gradually
    setTimeout(() => {
        fadeOut(noticeDiv, 500);
    }, 1000);
}

function closeNotice(newText) {
    const dialogueDiv = document.getElementById('notice');
    dialogueDiv.style.display = 'none';
}



// ---------------

function addComponent() {
    const lastChild = document.getElementById('stage1').lastElementChild;
    if (lastChild && lastChild.id === 'user-game-object') {
        document.getElementById('stage1').removeChild(lastChild);
    }
    const code = document.getElementById('editor').value;
    const element = document.getElementById('stage1');
    element.innerHTML += code;
    element.lastElementChild.style.position = 'absolute';
    element.lastElementChild.id = 'user-game-object';
    element.lastElementChild.classList.add('gameobject');
    //<div style="top:130px; width:25px; height:10px; background-color:red"></div>
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

function nextStage() {
    stage++;
}

function villagersMove() {
    if (isOnGround) {
        villagers.forEach(v => {
            v.posX = v.initPosX;
            v.posY = v.initPosY;
            v.velocityY = 0;
        });
    }

    isVillagerMoving = true;
    isOnGround = false;

    let gameBottom = gameWorld.clientHeight - 24;
    let gameRight = gameWorld.clientWidth - 24;

    let obstacles = document.querySelectorAll(".gameobject"); // Get user-created elements

    villagers.forEach((v, i) => {
        if (i <= 1) {
            v.velocityY += gravity;
            v.posY += v.velocityY;
            v.posX += velocityX;

            // **Check for ground collision**
            if (v.posY >= gameBottom) {
                v.posY = gameBottom;
                v.velocityY = 0;
                isOnGround = true;
                isVillagerMoving = false;
            }

            // **Check for right wall collision**
            if (v.posX >= gameRight) {
                v.posX = gameRight;
            }

            // **Check collision with user-created objects**
            obstacles ? 
            obstacles.forEach(obstacle => {
                // console.log("OBS");
                if (checkCollision(v, obstacle)) {
                    v.posY -= v.velocityY; // Move back to avoid overlap
                    if (obstacle.id == 'user-game-object') {
                        v.velocityY = 0;       // Stop downward movement
                        isOnGround = true;     // Consider it grounded
                    }
                }
            }):'';

            v.element.style.left = v.posX + "px";
            v.element.style.top = v.posY + "px";
        }
    });

    if (isOnGround) {
        isVillagerMoving = false;
    } else {
        requestAnimationFrame(villagersMove);
    }
}

// **Collision Detection Function**
function checkCollision(villager, obstacle) {
    let vRect = villager.element.getBoundingClientRect();
    let oRect = obstacle.getBoundingClientRect();

    return !(
        vRect.right < oRect.left ||
        vRect.left > oRect.right ||
        vRect.bottom < oRect.top ||
        vRect.top > oRect.bottom
    );
}
function update() {
    document.querySelectorAll('.stage').forEach(stageDiv => {
        stageDiv.style.display = 'none';
    });
    // Show the current stage based on the value of `stage`

    if (stage == 0) {
        document.getElementById("main-menu").style.display = "flex";
    }
    else if (stage == 1) {
        document.getElementById("stage1").style.display = "block";
        if (!isVillagerMoving) {
            let elements = document.querySelectorAll(".vilager");
            let i = 0;
            elements.forEach((el) => {
                villagers[i].element = el;
                i++;
            });
        }
    } else if (stage == 2) {

        document.getElementById("stage2").style.display = "block";


    } else if (stage == 3) {
        document.getElementById("stage3").style.display = "block";
    } else {
        stage = Math.min(2, stage);
        stage = Math.max(0, stage);
    }
    requestAnimationFrame(update);
}

update();
