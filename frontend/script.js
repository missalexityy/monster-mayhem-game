document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById("splash-screen");
    const initialEnterGameBtn = document.getElementById("initialEnterGameBtn");
    const gameContainer = document.getElementById("game-container");
    const grid = document.getElementById("grid");
    const gridElement = document.getElementById('grid');
    const playerNamesContainer = document.getElementById("playerNames");

    const monsterTypeSelect = document.getElementById("monsterType");
    const placeMonsterBtn = document.getElementById("placeMonster");
    const moveMonsterBtn = document.getElementById("moveMonster");
    
    
    //For the first page
    initialEnterGameBtn.addEventListener("click", () => {
        splashScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
    });

    // Initialize grid
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener("click", (event) => onCellClick(event));
        //cell.addEventListener("click", onCellClick);
        grid.appendChild(cell);
    }

    // Define emojis/icons for monsters
    const monsterIcons = {
        vampire: '🧛‍♀️',
        werewolf: '🐺',
        ghost: '👻'
    };

    let players = [
        { id: 0, monsters: [] },
        { id: 1, monsters: [] },
        { id: 2, monsters: [] },
        { id: 3, monsters: [] }
        ];

    //Game state variables
    //let players = [];
    let currentPlayer = 0;
    let gameStarted = false; //To see if the game has started
    let monsterPlaced = false; // Flag to track if a monster has been placed by the current player
    let selectedMonster = null; // Variable to track the selected monster for moving
    let isMoveMode = false; // Flag to track if move mode is enabled
    let actionClicked = false; // Flag to track if Place Monster or Move Monster button has been clicked

    const numPlayersInput = document.getElementById("numPlayers"); 


    // Update player name inputs when number of players changes
    numPlayersInput.addEventListener("change", () => {
        console.log("Number of players changed");
        updatePlayerNameInputs();
        const turnMessage = document.getElementById("turnMessage");
        if (turnMessage) {
            turnMessage.remove(); // Remove existing turn message if it exists
        }
    });

     // Initialize players
     function initializePlayers(numPlayers) {
        players = [];
        for (let i = 0; i < numPlayers; i++) {
            players.push({ monsters: [], name: `Player ${i + 1}` });
        }
        currentPlayer = 0;
        monsterPlaced = false;
    }

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

        // Update number of players when input changes
         numPlayersInput.addEventListener("change", () => {
        const numPlayers = parseInt(numPlayersInput.value);
        initializePlayers(numPlayers);
    });

    /* function startGame() {
        fetch('/start-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log the response from the server
        })
        .catch(error => console.error('Error:', error));
    }
*/

    
    const startGameBtn = document.getElementById("startGame");
    // Where the game starts
    startGameBtn.addEventListener("click", () => {
        gameStarted = true;
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

     // Grid cell click handler
     grid.addEventListener("click", (event) => {
        if (!gameStarted) {
            alert("You must start the game first!");
            return;
        }

        if (!actionClicked) { // Check if neither the Place Monster nor Move Monster button has been clicked
            alert("You must click either the 'Place Monster' or 'Move Monster' button first!");
            return;
        }

        if (isMoveMode) {
            selectMonsterForMove(event);
        } else {
            placeMonsterOnClick(event);
        }
    });

    // Place a monster only after clicking the button
        placeMonsterBtn.addEventListener("click", () => {
        if (!gameStarted) {
            alert("You must start the game first!");
        return;
    }
        console.log("Place monster button clicked");
        grid.addEventListener("click", placeMonsterOnClick); 
        monsterPlaced = true;
        isMoveMode = false; // Disable move mode when placing a monster
        actionClicked = true;

        // Disable the placeMonsterBtn button after it's clicked
        placeMonsterBtn.disabled = true;
});

    // Function to place a monster in a cell
    function placeMonster(cell, monsterType, currentPlayer) {
        const monster = document.createElement("div");
        monster.className = monsterType;
        monster.dataset.player = currentPlayer; // Set the data attribute to indicate the player

        // Create a span for the icon and the number
        const monsterIconSpan = document.createElement("span");
        monsterIconSpan.textContent = monsterIcons[monsterType];

        const playerNumberSpan = document.createElement("span");
        playerNumberSpan.textContent = ` ${currentPlayer + 1}`; // Include space for separation

        // Append both spans to the monster div
        monster.appendChild(monsterIconSpan);
        monster.appendChild(playerNumberSpan);

        cell.appendChild(monster);
    }

    // Place a monster on click
    function placeMonsterOnClick(event) {
        if (!gameStarted) {
            alert("You must start the game first!");
            return;
        }
        if (!actionClicked) {
            alert("You must click either the 'Place Monster' or 'Move Monster' button first!");
            return; // Stop execution if action is not clicked
        }
        if (isMoveMode) return; // Ensure move mode is not enabled

        const index = parseInt(event.target.dataset.index);
        console.log(`Placing monster at index: ${index}`); // Debug


        if (!isNaN(index) && !event.target.innerHTML) {
            const monsterType = monsterTypeSelect.value;
            const cell = grid.children[index];
            placeMonster(cell, monsterType, currentPlayer);

            //Update game state
            players[currentPlayer].monsters.push({ type: monsterType, index });
            monsterPlaced = true;
            grid.removeEventListener("click", placeMonsterOnClick);

            //Switch to the next player after a short delay
            setTimeout(() => {
                switchPlayer();
                //alert(`${players[currentPlayer].name}'s turn`);
            }, 100); // Delay to ensure the monster is placed before the alert
        }
    }

    // Move a monster only after clicking the button
    moveMonsterBtn.addEventListener("click", () => {
        if (!gameStarted) {
            alert("You must start the game first!");
            return;
        }
        console.log("Move monster button clicked");
        isMoveMode = true; // Enable move mode
        grid.addEventListener("click", onCellClick);
        actionClicked = true;

        moveMonsterBtn.disabled = true;
    });

     // Function to handle cell click events
     function onCellClick(event) {
        const cell = event.currentTarget;
        const monster = cell.querySelector('div'); // Select the monster div directly

        if (selectedMonster) {
            if (!monster) {
                // Move the selected monster to the new cell
                const oldIndex = parseInt(selectedMonster.parentElement.dataset.index);
                const newIndex = parseInt(cell.dataset.index);
                updateGameState(oldIndex, newIndex);

                cell.appendChild(selectedMonster);
                selectedMonster = null;

                // Switch to the next player after a short delay
                setTimeout(() => {
                    switchPlayer();
                }, 100);
            }
        } else if (monster) {
            // Select the monster if it belongs to the current player
            if (parseInt(monster.dataset.player) === currentPlayer) {
                selectedMonster = monster;
            }
        }
    }

    // Function to update the game state after moving a monster
    function updateGameState(oldIndex, newIndex) {
        players.forEach(player => {
            player.monsters.forEach(monster => {
                if (monster.index === oldIndex) {
                    monster.index = newIndex;
                }
            });
        });
    }

    // Switch to the next player
    function switchPlayer() {
        currentPlayer = (currentPlayer + 1) % players.length;
        const numPlayers = players.length;
        const numMonstersPlaced = players[currentPlayer].monsters.length;

         // Check if all players have placed their monsters
        const allMonstersPlaced = players.every(player => player.monsters.length > 0);

        if (!allMonstersPlaced) {
            // If not all monsters are placed, display message for placing a monster
            alert(`${players[currentPlayer].name}'s turn. Place your monster.`);
        } else {
            // If all monsters are placed, display message for placing or moving existing monster
            alert(`${players[currentPlayer].name}'s turn. Place or move your existing monster.`);
        }
    
        // Reset the flag for the next player
        monsterPlaced = false;
        actionClicked = false; //Reset actionClicked flag

        // Re-enable the action buttons
        placeMonsterBtn.disabled = false;
        moveMonsterBtn.disabled = false;
}
    /*
    // Example usage: placing initial monsters
    const initialMonsterPositions = [
        { index: 1, type: 'monsterType1', player: 0 },
        { index: 22, type: 'monsterType2', player: 1 },
        { index: 37, type: 'monsterType3', player: 2 },
        { index: 48, type: 'monsterType4', player: 3 }
    ]; // Example initial monster positions with types and players */

    initialMonsterPositions.forEach(({ index, type, player }) => {
        const cell = gridElement.children[index];
        placeMonster(cell, type, player);
        players[player].monsters.push({ type, index });
    });

    // Add event listeners to the action buttons
    placeMonsterBtn.addEventListener('click', () => {
        actionClicked = true;
        gridElement.addEventListener("click", placeMonsterOnClick);
    });

    moveMonsterBtn.addEventListener('click', () => {
        actionClicked = true;
        gridElement.addEventListener("click", onCellClick);
    });
});

        // Update player status function
        function updatePlayerStatus() {
            const playerList = document.getElementById("playerList");
            const monsterList = document.getElementById("monsterList");
            const removedList = document.getElementById("removedList");

        playerList.innerHTML = "";
        monsterList.innerHTML = "";
        removedList.innerHTML = "";

        players.forEach(player => {
        const playerCell = document.createElement("td");
        playerCell.textContent = player.name;
        playerList.appendChild(playerCell);

        const monsterCell = document.createElement("td");
        player.monsters.forEach(monster => {
            const monsterItem = document.createElement("div");
            monsterItem.textContent = `${monster.type}`;
            monsterCell.appendChild(monsterItem);
        });
        monsterList.appendChild(monsterCell);

        // Display removed monsters if any
        const removedCell = document.createElement("td");
        player.removedMonsters.forEach(removedMonster => {
            const removedItem = document.createElement("div");
            removedItem.textContent = `${removedMonster.type}`;
            removedCell.appendChild(removedItem);
        });
        removedList.appendChild(removedCell);
    });
};