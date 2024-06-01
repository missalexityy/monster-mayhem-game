document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const placeMonsterBtn = document.getElementById("placeMonster");
    const monsterTypeSelect = document.getElementById("monsterType");
    const numPlayersInput = document.getElementById("numPlayers");
    const startGameBtn = document.getElementById("startGame");
    const playerNamesContainer = document.getElementById("playerNames");
    const moveMonsterBtn = document.getElementById("moveMonster");

    // Define colors for monsters
    const monsterColors = {
        vampire: 'red',
        werewolf: 'black',
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
    let monsterPlaced = false; // Flag to track if a monster has been placed by the current player
    let selectedMonster = null; // Variable to track the selected monster for moving
    let isMoveMode = false; // Flag to track if move mode is enabled

    // Update player name inputs when number of players changes
    numPlayersInput.addEventListener("change", () => {
        console.log("Number of players changed");
        updatePlayerNameInputs();
        const turnMessage = document.getElementById("turnMessage");
        if (turnMessage) {
            turnMessage.remove(); // Remove existing turn message if it exists
        }
    });

    function updatePlayerNameInputs() {
        console.log("Updating player name inputs");
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

    // Call updatePlayerNameInputs() to initially display player name inputs
    updatePlayerNameInputs();

    startGameBtn.addEventListener("click", () => {
        console.log("Start game button clicked");
        const playerNameInputs = playerNamesContainer.querySelectorAll("input");

        players = Array.from(playerNameInputs)
            .map((input) => {
                if (input.value.trim() !== "") {
                    return { monsters: [], name: input.value.trim() };
                }
            })
            .filter(Boolean);

        if (players.length >= 2 && players.length <= 4) {
            switchPlayer();
            alert("Game Started! " + `${players[currentPlayer].name}'s turn`);
        } else {
            alert("Please enter names for at least 2 players and up to 4 players.");
        }
    });

    // Initialize game with default number of players
    initializePlayers(parseInt(numPlayersInput.value));

    // Place a monster only after clicking the button
    placeMonsterBtn.addEventListener("click", () => {
        console.log("Place monster button clicked");
        grid.addEventListener("click", placeMonsterOnClick);
        isMoveMode = false; // Disable move mode when placing a monster
    });

    // Move a monster only after clicking the button
    moveMonsterBtn.addEventListener("click", () => {
        console.log("Move monster button clicked");
        grid.addEventListener("click", selectMonsterForMove);
        isMoveMode = true; // Enable move mode
    });

    // Place a monster on click
    function placeMonsterOnClick(event) {
        console.log("Place monster on click");
        const index = parseInt(event.target.dataset.index);
        if (!isNaN(index) && !event.target.innerHTML) {
            const monsterType = monsterTypeSelect.value;
            const cell = grid.children[index];
            const monster = document.createElement("div");
            monster.className = monsterType;
            monster.textContent = currentPlayer + 1; // Label the monster with the player number
            monster.dataset.player = currentPlayer; // Set the data attribute to indicate the player
            monster.style.backgroundColor = monsterColors[monsterType];
            cell.appendChild(monster);
            players[currentPlayer].monsters.push({ type: monsterType, index });
            grid.removeEventListener("click", placeMonsterOnClick);
            monsterPlaced = true;
            setTimeout(() => {
                switchPlayer();
                alert(`${players[currentPlayer].name}'s turn`);
            }, 100); // Delay to ensure the monster is placed before the alert
        }
    }

    // Select a monster to move
    function selectMonsterForMove(event) {
        if (!isMoveMode) return; // Ensure move mode is enabled

        console.log("Select monster for move");
        const index = parseInt(event.target.dataset.index);
        if (!isNaN(index) && event.target.dataset.player == currentPlayer) {
            selectedMonster = { type: event.target.className, index };
            grid.removeEventListener("click", selectMonsterForMove);
            grid.addEventListener("click", moveMonsterToDestination);
        }
    }

    // Move monster to the selected destination
    function moveMonsterToDestination(event) {
        console.log("Move monster to destination");
        const destinationIndex = parseInt(event.target.dataset.index);
        if (!isNaN(destinationIndex)) {
            const destinationCell = grid.children[destinationIndex];

            if (!destinationCell.innerHTML) {
                const sourceCell = grid.children[selectedMonster.index];
                const monster = sourceCell.firstChild;
                destinationCell.appendChild(monster);
                players[currentPlayer].monsters = players[currentPlayer].monsters.map(monster => {
                    if (monster.index === selectedMonster.index) {
                        return { ...monster, index: destinationIndex };
                    }
                    return monster;
                });
                grid.removeEventListener("click", moveMonsterToDestination);
                switchPlayer();
            } else {
                console.log("Cannot move over other player's monsters.");
            }
        }
    }

    // Function to check if the destination cell contains a monster belonging to the current player
    function isOwnMonster(index) {
        const cell = grid.children[index];
        if (cell.firstChild && cell.firstChild.dataset.player === currentPlayer.toString()) {
            return true;
        }
        return false;
    }

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

    // Switch to the next player
    function switchPlayer() {
        currentPlayer = (currentPlayer + 1) % players.length;
        // Check if all players have placed their monsters
        if (players.every(player => player.monsters.length > 0)) {
            // Check if the current player has already placed a monster
            if (monsterPlaced) {
                alert(`${players[currentPlayer].name}'s turn. You can move your monster.`);
            } else {
                alert(`${players[currentPlayer].name}'s turn. Place your monster.`);
            }
        }
        // Reset the flag for the next player
        monsterPlaced = false;
    }
});
