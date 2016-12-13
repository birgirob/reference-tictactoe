
module.exports = function(injected){
    var TictactoeState = injected('TictactoeState');

    return function(history){

        var gameState = TictactoeState(history);

        return {
            executeCommand: function(cmd, eventHandler){

                var cmdHandlers = {
                    "CreateGame": function (cmd) {
                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.isGameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    "PlaceMove": function(cmd){
                        console.log(cmd);
                        if (gameState.getCurrentPlayer() !== cmd.side) {
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "IllegalMoveNotYourTurn",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                coords: cmd.coords
                            }]);
                            return;
                        }

                        if (gameState.isCellOccupied(cmd.coords)) {
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "IllegalMoveOccupiedCell",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                coords: cmd.coords
                            }]);
                            return;
                        }

                        events = [
                            {
                                gameId: cmd.gameId,
                                type: "MovePlaced",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                coords: cmd.coords
                            }
                        ];
                        // Check here for conditions which prevent command from altering state
                        gameState.processEvents(events);

                        // Check here for conditions which may warrant additional events to be emitted.
                        if (gameState.getMoveCount() == 9) {
                            events.push({
                                gameId: cmd.gameId,
                                type: "GameDraw",
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            });
                        }
                        eventHandler(events);
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};

