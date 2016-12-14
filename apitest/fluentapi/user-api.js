module.exports=function(injected){

    const io = require('socket.io-client');
    const RoutingContext = require('../../client/src/routing-context');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;
    var id = generateUUID();

    function userAPI(){
        var waitingFor=[];
        var commandId=0;

        var game = {
            gameId: id
        };

        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        connectCount++;
        const me = {
            expectUserAck:(cb)=>{
                waitingFor.push("expectUserAck");
                routingContext.socket.on('userAcknowledged', function(ackMessage){
                    expect(ackMessage.clientId).not.toBeUndefined();
                    waitingFor.pop();
                });
                return me;
            },
            sendChatMessage:(message)=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"chatCommand", message });
                return me;
            },
            expectChatMessageReceived:(message)=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('chatMessageReceived', function(chatMessage){
                    expect(chatMessage.sender).not.toBeUndefined();
                    if(chatMessage.message===message){
                        waitingFor.pop();
                    }
                });
                return me;
            },
            cleanDatabase:()=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"cleanDatabase"});
                return me;

            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
                    waitingFor.pop();
                });
                return me;

            },
            createGame:()=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({
                    commandId: cmdId,
                    type: "CreateGame",
                    gameId: game.gameId,
                    timeStamp: new Date()});
                return me;
            },
            expectGameCreated:()=>{
                routingContext.eventRouter.on("GameCreated", function(g) {
                    expect(g.gameId).toBeDefined();
                    if (g.gameId === game.gameId) {
                        waitingFor.pop();
                        game = g;
                    }
                });
                return me;
            },
            joinGame:(gameId)=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({
                    commandId: cmdId,
                    type: "JoinGame",
                    gameId: gameId,
                    timeStamp: new Date()});
                return me;
            },
            getGame:()=>{
                return game;
            },
            expectGameJoined:()=>{
                waitingFor.push("expectGameJoined");
                routingContext.eventRouter.on("GameJoined", function(g) {
                    expect(g).toBeDefined();
                    if (g.gameId === game.gameId) {
                        waitingFor.pop();
                        game = g;
                    }
                });
                return me;
            },
            placeMove:(x, y)=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({
                    commandId: cmdId,
                    type: "PlaceMove",
                    gameId: game.gameId,
                    coords: {
                        x: x,
                        y: y
                    },
                    side: game.side,
                    timeStamp: new Date()
                });
                return me;
            },
            expectMoveMade:()=>{
                waitingFor.push("expectMoveMade");
                routingContext.eventRouter.on("MovePlaced", function(g) {
                    expect(g.gameId).toBeDefined();
                    if (g.gameId === game.gameId) {
                        waitingFor.pop();
                    }
                });
                return me;
            },
            expectGameWon:()=>{
                waitingFor.push("expectGameWon");
                routingContext.eventRouter.on("GameWon", function(g) {
                    expect(g.gameId).toBeDefined();
                    if (g.gameId === game.gameId) {
                        waitingFor.pop();
                        game = g;
                    }
                });
                return me;
            },
            then:(whenDoneWaiting)=>{
                function waitLonger(){
                    if(waitingFor.length>0){
                        setTimeout(waitLonger, 0);
                        return;
                    }
                    whenDoneWaiting();
                }
                waitLonger();
                return me;
            },
            disconnect:function(){
                routingContext.socket.disconnect();
            }

        };
        return me;

    }

    return userAPI;
};
