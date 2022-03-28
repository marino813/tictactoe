const gameBoard = (function () {
    //give each square a unique number ID (css is dealt with later)
    const boardSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    //possible winning ID selections
    const winningCombos = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,5,9],
        [1,4,7],
        [2,5,8],
        [3,5,7]
    ]

    //create the necessary div elements
    const gridContainer = document.createElement('div');
    const gridItem = document.createElement('div');

    //assign board divs proper classes
    gridContainer.className = "grid-container";
    gridItem.className = "grid-item";

    //insert necessary elements into the DOM
    (function buildBoard () {
        document.body.appendChild(gridContainer);
            for (var i = 0; i < boardSquares.length; i++) {
                gridItem.id = boardSquares[i];
                gridItem.innerHTML = '&nbsp;';
                gridContainer.appendChild(gridItem.cloneNode(true));
            }
    })();
    return {
        winningCombos: winningCombos,
        boardSquares: boardSquares
    }
})();

const gameController = (function () {
    //get "Begin Game" button
    const beginGame = document.getElementById('submitButton')
    
    //get sliderbox to disable with "begin game" button click
    const sliderBox = document.querySelector('.switch-button-checkbox')

    //array to store who goes first
    const goesFirst = []

    //"Begin Game" button actions
    beginGame.addEventListener("click", function (event) {
        event.preventDefault();

        if (beginGame.value == 'restart') {
            location.reload()
        }

        beginGame.value = 'restart'

        //get the player names
        //const playerOne = document.getElementById('playerOne').value || 'Player One';
        const playerOne = (function () {
            if (document.getElementById('playerOne').value) {
                 return document.getElementById('playerOne').value 
                } else {
                    return document.getElementById('playerOne').value = 'Player One'
                }
            })();

        const playerTwo = (function () {
            if (document.getElementById('playerTwo').value) {
                    return document.getElementById('playerTwo').value 
                } else {
                    return document.getElementById('playerTwo').value = 'Player Two'
                }
            })();

        //get slider setting for who goes first and then store it in the goesFirst object
        const playerTurn = (function () {if (sliderBox.checked) { return "playerTwo" } })() || "playerOne";
        goesFirst.push(playerTurn);

        //lock in the input field so it is the player name
        document.querySelector('#playerOne').disabled = true
        document.querySelector('#playerTwo').disabled = true

        //input the player names into the turn selector
        document.getElementById('turnDisplay').innerHTML = `<b>Whose up?</b>`
        document.getElementById('playeroneSlider').innerHTML = `${playerOne} (X)`
        document.getElementById('playertwoSlider').innerHTML = `${playerTwo} (O)`

        //disable click events on sliderBox
        sliderBox.disabled = true;

        //make grid clickable
        const activateGrid = (function () {
            //get the grid items
            const gameButtons = document.getElementsByClassName('grid-item');

            //perform necessary actions when square is clicked
            for (var i = 0; i < gameButtons.length; i++) {
                gameButtons[i].addEventListener("click", gameFlow.gameClick)
                }
        })();
    });

    return {
        player1: playerOne,
        player2: playerTwo,
        playsFirst: goesFirst,
        playerSlider: sliderBox,
    }
})();

const gameFlow = (function () {
    //check who goes first
    const currentTurn = gameController.playsFirst;

    //store player moves
    const moveHistory = {
        playerOne: [],
        playerTwo: []
    }

    //gameplay logic function
    function playRound (gridID) {

        //check whose turn it is
        if (currentTurn[0] === 'playerOne') {

            //record player's move and insert proper symbol
            if (!moveHistory.playerOne.includes(parseInt(gridID.id)) && !moveHistory.playerTwo.includes(parseInt(gridID.id))) {
                moveHistory.playerOne.push(parseInt(gridID.id));
                gridID.innerHTML = 'X';
                } else {
                    console.log('already been played')
                    return;
                }
            
            //check to see if player has won
            if (winChecker(moveHistory.playerOne)) {
                return gameOver(gameController.player1.value)
                }
            
            //change the player turn
            currentTurn.splice(0,1,'playerTwo');

            //highlight the next player in the slider
            gameController.playerSlider.checked = true;

        } else {

            if (!moveHistory.playerOne.includes(parseInt(gridID.id)) && !moveHistory.playerTwo.includes(parseInt(gridID.id))) {
                moveHistory.playerTwo.push(parseInt(gridID.id));
                gridID.innerHTML = 'O';
                } else {
                    console.log('already been played')
                    return;
                }

            if (winChecker(moveHistory.playerTwo)) {
                return gameOver(gameController.player2.value)
                }
                currentTurn.splice(0,1,'playerOne');
                gameController.playerSlider.checked = false;
        }
    };

 

    function winChecker (movesArray) {
        for (let i = 0; i < gameBoard.winningCombos.length; i++) {
            if (gameBoard.winningCombos[i].every(i => movesArray.includes(i))) {
                return true;
            }
        }
    }

    function gameOver (player) {
    
        //remove eventlisteners
        const gameButtons = document.getElementsByClassName('grid-item');
        for (var i = 0; i < gameButtons.length; i++) {
            gameButtons[i].removeEventListener("click", gameFlow.gameClick)
        }

        //build winner screen DOM elements
        const panelBG = document.createElement('div');
        const panelContent = document.createElement('div');
        const winnerMessage = document.createElement('h1');
        const playAgain = document.createElement('input');

        //assign necessary classes, ids, and types
        panelBG.id = 'fade';
        panelContent.className = 'panel__content';
        winnerMessage.id = 'winnerMsg';
        playAgain.id = 'playAgain';
        playAgain.type = 'submit';
        playAgain.value = 'Play Again'

        //insert langauge for winning message into the DOM
        winnerMessage.innerHTML = `${player} just won.`;

        //display winner screen DOM elements
        document.querySelector("body > div.playerInput").append(panelBG);
        requestAnimationFrame(() => { //force proper anmination
            panelBG.classList.add('panel') 
        })
        panelBG.appendChild(panelContent);
        panelContent.appendChild(winnerMessage);
        winnerMessage.appendChild(playAgain);

        //set event for 'play again' button
        playAgain.addEventListener("click", function () {
            location.reload()
        });
    };

    function gameClick () {
        gameFlow.playRound(this);
    }

    return {
        gameClick: gameClick,
        playRound: playRound,
        moveHistory: moveHistory
    }
})();

/*
possibly how AI would work:
check winning arrays to see what hasn't been played yet
randomly select one of those numbers
*/