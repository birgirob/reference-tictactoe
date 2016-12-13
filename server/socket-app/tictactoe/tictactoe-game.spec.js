var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var createGameEvent = {
    gameId: 1,
    type: "CreateGame",
    user: {
        userName: "Guy 1"
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:00"
};

var gameCreatedEvent = {
    gameId: 1,
    type: "GameCreated",
    user: {
        userName: "Guy 1"
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:00",
    side: "X"
};

var joinGameEvent = {
    gameId: 1,
    type: "JoinGame",
    user: {
        userName: "Guy 2"
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:10"
};

var gameJoinedEvent = {
    gameId: 1,
    type: "GameJoined",
    user: {
        userName: "Guy 2",
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:10",
    side: "O"
};

var joinFullGameEvent = {
    gameId: 1,
    type: "JoinGame",
    user: {
        userName: "Guy 3",
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:20"
};

var fullGameJoinAttemptedEvent = {
    gameId: 1,
    type: "FullGameJoinAttempted",
    user: {
        userName: "Guy 3",
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:20"
};

var placeMoveEvent = {
    gameId: 1,
    type: "PlaceMove",
    user: {
        userName: "Guy 1"
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:30",
    side: "X",
    coords: {
        x: 0,
        y: 0
    }
}

var firstMovePlacedEvent = {
    gameId: 1,
    type: "MovePlaced",
    user: {
        userName: "Guy 1"
    },
    name: "TheFirstGame",
    timeStamp: "2016-12-09T12:00:30",
    side: "X",
    coords: {
        x: 0,
        y: 0
    }
};

describe('Create game command', function() {


    var given, when, then;

    beforeEach(function(){
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when = createGameEvent;
        then = [ gameCreatedEvent ];

    })
});


describe('Join game command', function () {


    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event', function () {

        given = [ gameCreatedEvent ];
        when = joinGameEvent;
        then = [ gameJoinedEvent ];

    });

    it('should emit FullGameJoinAttempted event when game full', function () {

        given = [ gameCreatedEvent, gameJoinedEvent ];
        when = {
            gameId: 1,
            type: "JoinGame",
            user: {
                userName: "Guy 3"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:20"
        };
        then = [ fullGameJoinAttemptedEvent ];
    });
});

describe('Place move command', function () {


    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit MovePlaced event when placing legal move', function () {

        given = [ gameCreatedEvent, gameJoinedEvent ];
        when = {
            gameId: 1,
            type: "PlaceMove",
            user: {
                userName: "Guy 1"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:30",
            side: "X",
            coords: {
                x: 0, y: 0
            }
        };
        then = [ {
            gameId: 1,
            type: "MovePlaced",
            user: {
                userName: "Guy 1"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:30",
            side: "X",
            coords: {
                x: 0, y: 0
            }
        } ];

    });

    it('should emit IllegalMoveNotYourTurn event when wrong player is placing a move', function() {
       given = [ gameCreatedEvent, gameJoinedEvent, firstMovePlacedEvent ];
       when = placeMoveEvent;
       then = [ {
           gameId: 1,
           type: "IllegalMoveNotYourTurn",
           user: {
               userName: "Guy 1"
           },
           name: "TheFirstGame",
           timeStamp: "2016-12-09T12:00:30",
           side: "X",
           coords: {
               x: 0, y: 0
           }
       }];
    });

    it('should emit IllegalMove event when placing in occupied cell', function() {

        given = [ gameCreatedEvent, gameJoinedEvent, firstMovePlacedEvent ];
        when = {
            gameId: 1,
            type: "PlaceMove",
            user: {
                userName: "Guy 2"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:40",
            side: "O",
            coords: {
                x: 0, y: 0
            }
        };
        then = [ {
            gameId: 1,
            type: "IllegalMoveOccupiedCell",
            user: {
                userName: "Guy 2",
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:40",
            side: "O",
            coords: {
                x: 0, y: 0
            }
        }];
    });

    it('should emit GameDraw event when no one has won after 9 moves', function() {

        given = [ gameCreatedEvent, gameJoinedEvent, firstMovePlacedEvent,
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 0, y: 1
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 0, y: 2
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 1, y: 0
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 1, y: 1
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 2, y: 0
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 1, y: 2
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 2, y: 2
                }
            }];
        when = {
            gameId: 1,
            type: "PlaceMove",
            user: {
                userName: "Guy 1"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:40",
            side: "X",
            coords: {
                x: 2, y: 1
            }
        };
        then = [
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 2, y: 1
                }
            },
            {
                gameId: 1,
                type: "GameDraw",
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40"
            }
        ];
    });

    it('should emit game won event if player places winning move (horizontal)', function() {
        given = [ gameCreatedEvent, gameJoinedEvent, firstMovePlacedEvent,
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 1, y: 0
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 0, y: 1
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 2, y: 0
                }
            }
        ];
        when = {
            gameId: 1,
            type: "PlaceMove",
            user: {
                userName: "Guy 1"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:40",
            side: "X",
            coords: {
                x: 0, y: 2
            }
        };
        then = [
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 0, y: 2
                }
            },
            {
                gameId: 1,
                type: "GameWon",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X"
            }
        ];
    });

    it('should emit game won event if player places winning move (vertical)', function() {
        given = [ gameCreatedEvent, gameJoinedEvent, firstMovePlacedEvent,
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 0, y: 1
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 1, y: 0
                }
            },
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 2"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "O",
                coords: {
                    x: 0, y: 2
                }
            }
        ];
        when = {
            gameId: 1,
            type: "PlaceMove",
            user: {
                userName: "Guy 1"
            },
            name: "TheFirstGame",
            timeStamp: "2016-12-09T12:00:40",
            side: "X",
            coords: {
                x: 2, y: 0
            }
        };
        then = [
            {
                gameId: 1,
                type: "MovePlaced",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X",
                coords: {
                    x: 2, y: 0
                }
            },
            {
                gameId: 1,
                type: "GameWon",
                user: {
                    userName: "Guy 1"
                },
                name: "TheFirstGame",
                timeStamp: "2016-12-09T12:00:40",
                side: "X"
            }
        ];
    });
});


