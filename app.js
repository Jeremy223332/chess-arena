// ==========================================
// CHESS ARENA
// Frontend prototype
// ==========================================

let currentScreen = "home";
let roomCode = "";
let isHost = false;
let currentPlayer = "";

let players = [];

// ==========================================
// SCREEN MANAGEMENT
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const screen = document.getElementById(screenId);

    if (screen) {
        screen.classList.add("active");
        currentScreen = screenId;
    }
}

function goHome() {
    showScreen("homeScreen");
}

function showHost() {
    showScreen("hostScreen");

    setTimeout(() => {
        document.getElementById("hostName").focus();
    }, 100);
}

function showJoin() {
    showScreen("joinScreen");

    setTimeout(() => {
        document.getElementById("playerName").focus();
    }, 100);
}

// ==========================================
// ROOM CODE
// ==========================================

function generateRoomCode() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
        code += characters[
            Math.floor(Math.random() * characters.length)
        ];
    }

    return code;
}

// ==========================================
// CREATE GAME
// ==========================================

function createGame() {
    const nameInput = document.getElementById("hostName");

    const name = nameInput.value.trim();

    if (!name) {
        alert("Please enter your name.");
        nameInput.focus();
        return;
    }

    currentPlayer = name;
    isHost = true;

    roomCode = generateRoomCode();

    players = [
        {
            name: name,
            host: true
        }
    ];

    document.getElementById("roomCodeDisplay").textContent = roomCode;

    updatePlayerList();

    showScreen("lobbyScreen");

    console.log("Created room:", roomCode);
}

// ==========================================
// JOIN GAME
// ==========================================

function joinGame() {
    const nameInput = document.getElementById("playerName");
    const codeInput = document.getElementById("roomCodeInput");

    const name = nameInput.value.trim();
    const code = codeInput.value.trim().toUpperCase();

    if (!name) {
        alert("Please enter your name.");
        nameInput.focus();
        return;
    }

    if (!code) {
        alert("Please enter a room code.");
        codeInput.focus();
        return;
    }

    currentPlayer = name;
    isHost = false;
    roomCode = code;

    // Prototype player
    players = [
        {
            name: name,
            host: false
        }
    ];

    document.getElementById("roomCodeDisplay").textContent = roomCode;

    updatePlayerList();

    showScreen("lobbyScreen");

    console.log("Joined room:", roomCode);
}

// ==========================================
// PLAYER LIST
// ==========================================

function updatePlayerList() {
    const list = document.getElementById("playerList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    players.forEach((player, index) => {

        const card = document.createElement("div");

        card.className = "player-card";

        const avatar = document.createElement("div");

        avatar.className = "player-avatar";

        avatar.textContent =
            player.name.charAt(0).toUpperCase();

        const info = document.createElement("div");

        info.className = "player-info";

        const name = document.createElement("strong");

        name.textContent = player.name;

        const status = document.createElement("span");

        if (player.host) {
            status.textContent = "Host";
        } else {
            status.textContent = "Player";
        }

        info.appendChild(name);
        info.appendChild(status);

        card.appendChild(avatar);
        card.appendChild(info);

        list.appendChild(card);
    });

    updateStartButton();
}

// ==========================================
// START BUTTON
// ==========================================

function updateStartButton() {
    const button = document.getElementById("startButton");

    if (!button) {
        return;
    }

    if (!isHost) {
        button.disabled = true;
        button.textContent = "Waiting for Host...";
        return;
    }

    button.disabled = false;
    button.textContent = "Start Round";
}

// ==========================================
// COPY ROOM CODE
// ==========================================

async function copyRoomCode() {
    if (!roomCode) {
        return;
    }

    try {
        await navigator.clipboard.writeText(roomCode);

        alert("Room code copied: " + roomCode);

    } catch (error) {

        alert(
            "Room code: " +
            roomCode +
            "\n\nCopy it manually."
        );
    }
}

// ==========================================
// START ROUND
// ==========================================

function startRound() {

    if (!isHost) {
        alert("Only the host can start the round.");
        return;
    }

    if (players.length < 2) {

        // Temporary prototype players
        // This lets us test the chess screen
        // before the real multiplayer server exists.

        players.push({
            name: "Player 2",
            host: false
        });
    }

    createMatchups();

    showScreen("matchScreen");
}

// ==========================================
// CREATE MATCHUPS
// ==========================================

function createMatchups() {

    if (players.length < 2) {
        return;
    }

    const player1 = players[0];
    const player2 = players[1];

    document.getElementById("whiteName").textContent =
        player1.name;

    document.getElementById("blackName").textContent =
        player2.name;

    document.getElementById("turnDisplay").textContent =
        player1.name + "'s turn";

    console.log(
        "Match created:",
        player1.name,
        "VS",
        player2.name
    );
}

// ==========================================
// ENTER KEY SUPPORT
// ==========================================

document.addEventListener("keydown", function(event) {

    if (event.key !== "Enter") {
        return;
    }

    if (currentScreen === "hostScreen") {
        createGame();
    }

    if (currentScreen === "joinScreen") {
        joinGame();
    }
});

// ==========================================
// STARTUP
// ==========================================

console.log("Chess Arena loaded.");
