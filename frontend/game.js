// frontend/game.js
const socket = io('http://localhost:3000'); // Atualize para a URL do seu servidor quando estiver no Heroku

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let players = {};
const playerGeometry = new THREE.BoxGeometry();
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

socket.on('currentPlayers', function (currentPlayers) {
    for (let id in currentPlayers) {
        if (currentPlayers.hasOwnProperty(id)) {
            addPlayer(id, currentPlayers[id]);
        }
    }
});

socket.on('newPlayer', function (newPlayer) {
    addPlayer(newPlayer.playerId, newPlayer.playerInfo);
});

socket.on('playerDisconnected', function (playerId) {
    if (players[playerId]) {
        scene.remove(players[playerId]);
        delete players[playerId];
    }
});

socket.on('playerMoved', function (movementData) {
    const { playerId, playerInfo } = movementData;
    if (players[playerId]) {
        players[playerId].position.x = playerInfo.x;
        players[playerId].position.y = playerInfo.y;
    }
});

function addPlayer(id, playerInfo) {
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.x = playerInfo.x;
    player.position.y = playerInfo.y;
    players[id] = player;
    scene.add(player);
}

const localPlayer = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(localPlayer);
camera.position.z = 5;

const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function animate() {
    requestAnimationFrame(animate);

    let moved = false;
    if (keys['ArrowUp']) {
        localPlayer.position.y += 0.05;
        moved = true;
    }
    if (keys['ArrowDown']) {
        localPlayer.position.y -= 0.05;
        moved = true;
    }
    if (keys['ArrowLeft']) {
        localPlayer.position.x -= 0.05;
        moved = true;
    }
    if (keys['ArrowRight']) {
        localPlayer.position.x += 0.05;
        moved = true;
    }

    if (moved) {
        socket.emit('playerMovement', { x: localPlayer.position.x, y: localPlayer.position.y });
    }

    renderer.render(scene, camera);
}

animate();
