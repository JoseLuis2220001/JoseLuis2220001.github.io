document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const restartButton = document.getElementById('restartButton');
    const highScoresList = document.getElementById('highScores');
    const timerDisplay = document.getElementById('timer');
    let playerTurn = true;
    let startTime;
    let timer;
    const bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];

    function startGame() {
        // Reiniciar el tablero
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.removeEventListener('click', handlePlayerClick);
            cell.addEventListener('click', handlePlayerClick, { once: true });
        });
        playerTurn = true;
        startTime = new Date();
        timerDisplay.innerText = `Tiempo: 0.0 s`;
        clearInterval(timer);
        timer = setInterval(trackTime, 1000);
    }

    function handlePlayerClick(e) {
        if (!playerTurn) return;
        const cell = e.target;
        cell.classList.add('x');
        if (checkWin('x')) {
            endGame(true);
            return;
        }
        playerTurn = false;
        computerMove();
    }

    function computerMove() {
        const emptyCells = Array.from(cells).filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
        if (emptyCells.length === 0) {
            endGame(false, true); // Empate
            return;
        }
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.classList.add('o');
        randomCell.removeEventListener('click', handlePlayerClick);
        if (checkWin('o')) {
            endGame(false);
        } else {
            playerTurn = true;
        }
    }

    function checkWin(currentClass) {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
            [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
        ];
        return winCombinations.some(combination =>
            combination.every(index => cells[index].classList.contains(currentClass))
        );
    }

    function endGame(playerWon, isDraw = false) {
        clearInterval(timer);
        if (isDraw) {
            alert('Empate');
        } else if (playerWon) {
            const timeElapsed = (new Date() - startTime) / 1000;
            const playerName = prompt('¡Ganaste! Ingresa tu nombre:');
            if (playerName) saveScore(playerName, timeElapsed);
            displayHighScores();
        } else {
            alert('La computadora gana');
        }
        startGame();
    }

    function trackTime() {
        const currentTime = (new Date() - startTime) / 1000;
        timerDisplay.innerText = `Tiempo: ${currentTime.toFixed(1)} s`;
    }

    function saveScore(playerName, time) {
        bestTimes.push({ name: playerName, time, date: new Date().toLocaleString() });
        bestTimes.sort((a, b) => a.time - b.time);
        if (bestTimes.length > 10) bestTimes.pop();
        localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
    }

    function displayHighScores() {
        highScoresList.innerHTML = bestTimes
            .map(score => `<li>${score.name} - ${score.time.toFixed(1)}s - ${score.date}</li>`)
            .join('');
    }

    restartButton.addEventListener('click', startGame);

    displayHighScores();
    startGame();
});
