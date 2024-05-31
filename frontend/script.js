document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const placeMonsterBtn = document.getElementById("placeMonster");
    const monsterTypeSelect = document.getElementById("monsterType");
    const numPlayersInput = document.getElementById("numPlayers");
    
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
    let players = [
       // { monsters: [], name: "Player 1", color: "red" }, 
       // { monsters: [], name: "Player 2", color: "blue" }
    ];

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
            monster.style.backgroundColor = players[currentPlayer].color;
            cell.appendChild(monster);
            players[currentPlayer].monsters.push({ type: monsterType, index });
            switchPlayer();
        }
    }

    //Switch to the next player
    function switchPlayer() {
        currentPlayer = (currentPlayer + 1) % players.length;
        alert(`${players[currentPlayer].name}'s turn`);
    }

    placeMonsterBtn.addEventListener("click", () => {
        alert("Click on a grid cell to place your monster");
    });

    //Initialize game with default number of players
    initializePlayers(parseInt(numPlayersInput.value));
});