var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gameFull = false;
        var playerCount = 0;
        var currentPlayer = 'X';
        var moveCount = 0;


        var board = [ [ null, null, null ],
                      [ null, null, null ],
                      [ null, null, null ] ];

        function processEvent(event) {
            if (event.type === "GameJoined") {
                gameFull = true;
            }
            if (event.type === "MovePlaced") {
                board[event.coords.x][event.coords.y] = currentPlayer;
                moveCount++;

                // Switch current player
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function isGameFull() {
            return gameFull;
        }

        function getCurrentPlayer() {
            return currentPlayer;
        }

        function getMoveCount() {
            return moveCount;
        }

        function hasPlayerWon(player) {

            for (var i = 0; i < 3; i++) {
                // Horizontal
                if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                    return true;
                }
                // Vertical
                if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
                    return true;
                }
            }

            // Diagonal
            if ((board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
                 board[0][2] === player && board[1][1] === player && board[2][0] === player) {
                return true;
            }

            return false;
        }

        function isCellOccupied(coords) {
            /*
            0,0    0,1    0,2
            1,0    1,1    1,2
            2,0    2,1    2,2
            */
            if (board[coords.x][coords.y] != null) {
                return true;
            }

            return false;
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            isGameFull: isGameFull,
            getCurrentPlayer: getCurrentPlayer,
            getMoveCount: getMoveCount,
            isCellOccupied: isCellOccupied,
            hasPlayerWon: hasPlayerWon
        }
    };
};
