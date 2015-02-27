HashChanger = new function() {
    var self               = this,
        isInternalHashSet  = false,
        statesTraversed    = 0
        lastHash           = '',
        toFnTable          = {},
        fromFnTable        = {};
        

    self.currentHash = function() {
        return location.hash || '#';
    };

    self.listenFor = function(hash, toFn, fromFn) {
        addFnForTable(toFnTable,   hash, toFn);
        addFnForTable(fromFnTable, hash, fromFn);
    };

    self.stopListeningFor = function(hash) {
        hash = '#' + hash;
        toFnTable[hash] = fromFnTable[hash] = undefined;
    };

    self.hashSetterFnFor = function(hash) {
        return function() { 
            isInternalHashSet = true;
            location.hash = hash;
        }
    };

    self.clearHash = function() {
        (self.hashSetterFnFor(''))();
    };


    function addFnForTable(table, hash, fn) {
        if (!(typeof(hash) == 'string' && fn)) return;
        hash = '#' + hash;

        if (table[hash]) {
            table[hash].push(fn);
        } else {
            table[hash] = [fn];
        }
    }

    function handleHashChange() {
        var currentHash = self.currentHash();
        if (currentHash == lastHash) return;

        var handlers      = [],
            toHandlers    = toFnTable[currentHash],
            fromHandlers  = fromFnTable[lastHash];

        lastHash = currentHash;
        statesTraversed--;
        fromHandlers && (handlers = handlers.concat(fromHandlers));
        toHandlers   && (handlers = handlers.concat(toHandlers));
        _.each(handlers, function(fn) { fn() });

        if (currentHash == '#') {
            isInternalHashSet && history.go(statesTraversed); 
            statesTraversed = 0;
        }
        isInternalHashSet = false;
    }


    (function initHashChanger() {
        self.clearHash();
        $(window).on('navigate', handleHashChange);
    })();
};