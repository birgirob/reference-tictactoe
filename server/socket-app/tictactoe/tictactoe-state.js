var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull = false;
        var playerCount = 0;

        var board = [ ];

        function processEvent(event) {
            if (event.type === "GameJoined") {
                gamefull = true;
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull() {
            return gamefull;
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull
        }
    };
};
