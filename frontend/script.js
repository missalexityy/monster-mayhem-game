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

    // Update player name inputs when number of players changes
    numPlayersInput.addEventListener("change", () => {
        updatePlayerNameInputs();
        const turnMessage = document.getElementById("turnMessage");
    if (turnMessage) {
        turnMessage.remove(); // Remove existing turn message if it exists
    }
    });

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

    // Call updatePlayerNameInputs() to initially display player name inputs
    updatePlayerNameInputs();

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
            alert("Game Started! " + `${players[currentPlayer].name}'s turn`);
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

     // Switch to the next player
     function switchPlayer() {
        currentPlayer = (currentPlayer + 1) % players.length;
        // Check if all players have placed their monsters
        if (players.every(player => player.monsters.length > 0)) {
        alert(`${players[currentPlayer].name}'s turn`);
        }
    }

    // Initialize game with default number of players
    initializePlayers(parseInt(numPlayersInput.value));

   // Place a monster or move a monster if one exists
    function placeOrMoveMonster(index) {
    const monsterType = monsterTypeSelect.value;
    const cell = grid.children[index];

    if (!cell.innerHTML) {
        // Place a new monster
        placeMonster(index);
    } else {
        // Move an existing monster
        moveMonster(index);
    }
}

// Event listener to handle monster placement and movement
grid.addEventListener("click", (event) => {
    const sourceIndex = parseInt(event.target.dataset.index);
    if (!isNaN(sourceIndex)) {
        placeOrMoveMonster(sourceIndex);
    }
});

// Place a monster
function placeMonster(index) {
    const monsterType = monsterTypeSelect.value;
    const cell = grid.children[index];
    if (!cell.innerHTML) {
        const monster = document.createElement("div");
        monster.className = monsterType;
        monster.style.backgroundColor = monsterColors[monsterType];
        cell.appendChild(monster);
        players[currentPlayer].monsters.push({ type: monsterType, index });
        switchPlayer();
        //alert(`${players[currentPlayer].name}'s turn`);
    }
}

// Function to move a monster
function moveMonster(destinationIndex) {
    const sourceMonster = grid.querySelector(`.${players[currentPlayer].monsters[0].type}`);
    const destinationCell = grid.children[destinationIndex];

    // Check if the destination cell is empty or contains a monster belonging to the current player
    if (!destinationCell.innerHTML || isOwnMonster(destinationIndex)) {
        // Move the monster to the destination cell
        destinationCell.appendChild(sourceMonster);
        players[currentPlayer].monsters[0].index = destinationIndex; // Update monster's index
        switchPlayer();
    } else {
        console.log("Cannot move over other player's monsters.");
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

}); 
