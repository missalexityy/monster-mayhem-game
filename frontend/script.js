document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const placeMonsterBtn = document.getElementById("placeMonster");
    const moveMonsterBtn = document.getElementById("moveMonster");
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
    let monsterPlaced = false; // Flag to track if a monster has been placed by the current player
    //let monstersPlaced = 0; // Track the number of monsters placed
    let selectedMonster = null; // Variable to track the selected monster for moving
    let isMoveMode = false; // Flag to track if move mode is enabled
    let isFirstRound = true; // Flag to track the first round of the game

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
            .map((input, index) => {
                if (input.value.trim() !== "") {
                    return { monsters: [], name: input.value.trim() };
                }
            })
            .filter(Boolean);
    
        if (players.length >= 2 && players.length <= 4) {
            alert("Game Started!");
            switchPlayer(); // Start the game by switching to the first player's turn
            
            // Remove the event listener after the game has started
            startGameBtn.removeEventListener("click", startGame);
        } else {
            alert("Please enter names for at least 2 players and up to 4 players.");
        }
    });
    

    // Initialize game with default number of players 
    // initializePlayers(parseInt(numPlayersInput.value));

    // Initialize players
    function initializePlayers(numPlayers) {
        players = [];
        for (let i = 0; i < numPlayers; i++) {
            players.push({ monsters: [], name: `Player ${i + 1}` });
        }
        currentPlayer = 0;
        monsterPlaced = false;
    }

    // Place a monster only after clicking the button
    placeMonsterBtn.addEventListener("click", () => {
        console.log("Place monster button clicked");
        grid.addEventListener("click", placeMonsterOnClick);
        isMoveMode = false; // Disable move mode when placing a monster
    });

    // Move a monster only after clicking the button
    moveMonsterBtn.addEventListener("click", () => {
        console.log("Move monster button clicked");
        isMoveMode = true; // Enable move mode
        grid.addEventListener("click", selectMonsterForMove);
    });

    // Place a monster on click
    function placeMonsterOnClick(event) {
        console.log("Place monster on click");
        if (isMoveMode) return; // Ensure move mode is not enabled

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
                //alert(`${players[currentPlayer].name}'s turn`);
            }, 100); // Delay to ensure the monster is placed before the alert
        }
    }

    // Select a monster to move
    function selectMonsterForMove(event) {
        if (!isMoveMode) return; // Ensure move mode is enabled

        console.log("Select monster for move");
        const index = parseInt(event.target.dataset.index);
        if (!isNaN(index) && event.target.dataset.player == currentPlayer.toString()) {
            selectedMonster = { type: event.target.className, index };
            grid.removeEventListener("click", selectMonsterForMove);
            grid.addEventListener("click", moveMonsterToDestination);
        } else {
            alert("You can only select your own monsters to move.");
        }
    }

    // Move monster to the selected destination
    function moveMonsterToDestination(event) {
        console.log("Move monster to destination");
        const destinationIndex = parseInt(event.target.dataset.index);
        if (!isNaN(destinationIndex) && selectedMonster) {
            const destinationCell = grid.children[destinationIndex];
            
        if (!destinationCell.innerHTML || isOwnMonster(destinationIndex)) {
            const sourceCell = grid.children[selectedMonster.index];
            const monster = sourceCell.firstChild;

            // Check if the selected monster belongs to the current player
            if (monster.dataset.player === currentPlayer.toString()) {
            destinationCell.appendChild(monster);
            players[currentPlayer].monsters = players[currentPlayer].monsters.map(monster => {
                if (monster.index === selectedMonster.index) {
                    return { ...monster, index: destinationIndex };
                }
                return monster;
            });

            // Handle interactions between monsters on the destination cell
            handleMonsterInteractions(destinationCell);
            
            selectedMonster = null;
            grid.removeEventListener("click", moveMonsterToDestination);
            switchPlayer();
        } else {
            alert("You can only move your own monsters.");
        } else {
            alert("You cannot move to a cell occupied by another player's monster.");
        }
    }
}

    // Function to handle interactions between monsters when finishing on the same square
    function handleMonsterInteractions(cell) {
        const monstersOnCell = Array.from(cell.children);

    // Check if there are multiple monsters on the cell
    if (monstersOnCell.length > 1) {
        const monsterTypes = monstersOnCell.map(monster => monster.className);

        // Check for specific combinations of monsters
        if (monsterTypes.includes("vampire") && monsterTypes.includes("werewolf")) {
            // Remove the werewolf
            const werewolfIndex = monsterTypes.indexOf("werewolf");
            cell.removeChild(monstersOnCell[werewolfIndex]);
        } else if (monsterTypes.includes("werewolf") && monsterTypes.includes("ghost")) {
            // Remove the ghost
            const ghostIndex = monsterTypes.indexOf("ghost");
            cell.removeChild(monstersOnCell[ghostIndex]);
        } else if (monsterTypes.includes("ghost") && monsterTypes.includes("vampire")) {
            // Remove the vampire
            const vampireIndex = monsterTypes.indexOf("vampire");
            cell.removeChild(monstersOnCell[vampireIndex]);
        } else if (monsterTypes.every((val, i, arr) => val === arr[0])) {
            // If all monsters are of the same type, remove all monsters
            monstersOnCell.forEach(monster => cell.removeChild(monster));
        }
    }
}

    // Function to check if the destination cell contains a monster belonging to the current player
    function isOwnMonster(index) {
        const cell = grid.children[index];
        if (cell.firstChild && cell.firstChild.dataset.player === currentPlayer.toString());
    }

    // Update number of players when input changes
    numPlayersInput.addEventListener("change", () => {
        const numPlayers = parseInt(numPlayersInput.value);
        initializePlayers(numPlayers);
    });


    // Switch to the next player
    function switchPlayer() {
        currentPlayer = (currentPlayer + 1) % players.length;
        const numPlayers = players.length;
        const numMonstersPlaced = players[currentPlayer].monsters.length;

         // Check if all players have placed their monsters
        const allMonstersPlaced = players.every(player => player.monsters.length > 0);

        // Display the turn of the current player to place their monster
        //alert(`${players[currentPlayer].name}'s turn. Place your monster.`);

        if (!allMonstersPlaced) {
            // If not all monsters are placed, display message for placing a monster
            alert(`${players[currentPlayer].name}'s turn. Place your monster.`);
        } else {
            // If all monsters are placed, display message for placing or moving existing monster
            alert(`${players[currentPlayer].name}'s turn. Place or move your existing monster.`);
        }
    
        // Reset the flag for the next player
        monsterPlaced = false;
    }

});
