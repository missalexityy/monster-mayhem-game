document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const placeMonsterBtn = document.getElementById("placeMonster");
    const monsterTypeSelect = document.getElementById("monsterType");
    const numPlayersInput = document.getElementById("numPlayers");
    const startGameBtn = document.getElementById("startGame");
    const playerNamesContainer = document.getElementById("playerNames");

    // Define colors for monsters
    const monsterColors = {
        vampire: 'red',
        werewolf: 'brown',
        ghost: 'gray'
    };

    // Initialize grid
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.dataset.index = i;
        cell.addEventListener("click", () => placeMonster(i));
        grid.appendChild(cell);
    }
    
    let currentPlayer = 0;
    let players = [];

    // Update player name inputs when number of players changes
    numPlayersInput.addEventListener("change", updatePlayerNameInputs);

    function updatePlayerNameInputs() {
        const numPlayers = parseInt(numPlayersInput.value);
        playerNamesContainer.innerHTML = '';

        for (let i = 1; i <= numPlayers; i++) {
            const label = document.createElement("label");
            label.setAttribute("for", `player${i}Name`);
            label.textContent = `Player ${i} Name:`;

            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", `player${i}Name`);
            input.setAttribute("placeholder", `Enter Player ${i} Name`);

            playerNamesContainer.appendChild(label);
            playerNamesContainer.appendChild(input);
        }
    }

    startGameBtn.addEventListener("click", () => {
        const playerNameInputs = playerNamesContainer.querySelectorAll("input");

        players = Array.from(playerNameInputs)
            .map((input, index) => {
                if (input.value.trim() !== "") {
                    return { monsters: [], name: input.value.trim() };
                }
            })
            .filter(Boolean);

        if (players.length >= 2 && players.length <= 4) {
            switchPlayer();
            alert("Game Started!");
        } else {
            alert("Please enter names for at least 2 players and up to 4 players.");
        }
    });

    // Update number of players when input changes
    numPlayersInput.addEventListener("change", () => {
        const numPlayers = parseInt(numPlayersInput.value);
        initializePlayers(numPlayers);
    });

    // Initialize players
    function initializePlayers(numPlayers) {
        players = [];
        for (let i = 0; i < numPlayers; i++) {
            players.push({ monsters: [], name: `Player ${i + 1}` });
        }
        switchPlayer();
    }

    // Place a monster
    function placeMonster(index) {
        const monsterType = monsterTypeSelect.value;
        const cell = grid.children[index];
        if (!cell.innerHTML) {
            const monster = document.createElement("div");
            monster.className = monsterType;
            monster.style.backgroundColor = monsterColors[monsterType]; // Use monsterColors object
            cell.appendChild(monster);
            players[currentPlayer].monsters.push({ type: monsterType, index });
            switchPlayer();
        }
    }

    // Switch to the next player
    function switchPlayer() {
        currentPlayer = (currentPlayer + 1) % players.length;
        alert(`${players[currentPlayer].name}'s turn`);
    }

    placeMonsterBtn.addEventListener("click", () => {
        alert("Click on a grid cell to place your monster");
    });

    // Initialize game with default number of players
    initializePlayers(parseInt(numPlayersInput.value));
});
