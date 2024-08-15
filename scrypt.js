const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');

let score = 0;
let intervalId;
let shapeIntervalId;
let difficultyLevel = 1;

// Mueve la esfera con el puntero del mouse
document.addEventListener('mousemove', (e) => {
    const rect = gameContainer.getBoundingClientRect();
    let x = e.clientX - rect.left - player.clientWidth / 2;
    let y = e.clientY - rect.top - player.clientHeight / 2;

    // Limita la posición del jugador para que no salga del contenedor
    x = Math.max(Math.min(x, gameContainer.clientWidth - player.clientWidth), 0);
    y = Math.max(Math.min(y, gameContainer.clientHeight - player.clientHeight), 0);

    player.style.left = `${x}px`;
    player.style.top = `${y}px`;
});

// Calcula la distancia entre dos puntos
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Mueve las formas hacia el jugador
function moveShapeTowardsPlayer(shape) {
    const playerRect = player.getBoundingClientRect();
    const shapeRect = shape.getBoundingClientRect();
    const shapeX = shapeRect.left + shapeRect.width / 2;
    const shapeY = shapeRect.top + shapeRect.height / 2;
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;

    const angle = Math.atan2(playerY - shapeY, playerX - shapeX);
    const speed = difficultyLevel * 0.5 + 1;

    const moveInterval = setInterval(() => {
        const shapeRect = shape.getBoundingClientRect();
        const shapeX = shapeRect.left + shapeRect.width / 2;
        const shapeY = shapeRect.top + shapeRect.height / 2;

        if (getDistance(shapeX, shapeY, playerRect.left + playerRect.width / 2, playerRect.top + playerRect.height / 2) < 10) {
            clearInterval(moveInterval);
            if (isCollision(player, shape)) {
                endGame();
            }
            gameContainer.removeChild(shape);
            return;
        }

        shape.style.left = `${shapeX + Math.cos(angle) * speed}px`;
        shape.style.top = `${shapeY + Math.sin(angle) * speed}px`;
    }, 100);
}

// Genera las formas enemigas
function createShape() {
    const shape = document.createElement('div');
    shape.classList.add('shape');

    // Determina el tamaño y velocidad según el nivel de dificultad
    const size = Math.random() * (30 + difficultyLevel * 10) + 20; // Tamaño entre 20px y 30px + dificultad
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;

    shape.style.top = `${Math.random() * (gameContainer.clientHeight - size)}px`;
    shape.style.left = `${Math.random() * (gameContainer.clientWidth - size)}px`;

    gameContainer.appendChild(shape);

    moveShapeTowardsPlayer(shape);
}

// Verifica si hay colisión entre dos elementos
function isCollision(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

// Termina el juego
function endGame() {
    clearInterval(intervalId);
    clearInterval(shapeIntervalId);
    alert(`¡Juego terminado! Tiempo sobrevivido: ${Math.floor(score)} segundos`);
}

// Actualiza el temporizador y dificultad
function updateTimer() {
    score += 0.1;
    scoreDisplay.textContent = `Tiempo: ${Math.floor(score)} segundos`;
    if (Math.floor(score) % 15 === 0) {
        difficultyLevel += 1;
    }
}

// Configura el intervalo para generar formas enemigas
function startGame() {
    intervalId = setInterval(updateTimer, 100);
    shapeIntervalId = setInterval(createShape, 1000);
}

startGame();
