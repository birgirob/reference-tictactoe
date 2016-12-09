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
    timestamp: "2016-12-09T12:00:10",
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
    side: "X"
}


describe('create game command', function() {


    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when =
            {
                id:"123987",
                type: "CreateGame",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            };
        then = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'X'
            }
        ];

    })
});


describe('join game command', function () {


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


    it('should emit game joined event...', function () {

        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
            {
                type: "JoinGame",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            };
        then = [
            {
                type: "GameJoined",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'O'
            }
        ];

    });

    it('should emit FullGameJoinAttempted event when game full..implement this', function () {

        expect(true).toBe(false);
    });
});


