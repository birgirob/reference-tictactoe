var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        var gamefull = true;

        function processEvent(event) {
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
