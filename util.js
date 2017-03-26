// Built by eustia.
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root._ = factory(); }
}(this, function ()
{
    var _ = {};

    if (typeof window === 'object' && window._) _ = window._;

    /* ------------------------------ objToStr ------------------------------ */

    var objToStr = _.objToStr = (function ()
    {
        /* Alias of Object.prototype.toString.
         *
         * |Name  |Type  |Desc                                |
         * |------|------|------------------------------------|
         * |value |*     |Source value                        |
         * |return|string|String representation of given value|
         * 
         * ```javascript
         * objToStr(5); // -> '[object Number]'
         * ```
         */

        var ObjToStr = Object.prototype.toString;

        function exports(val)
        {
            return ObjToStr.call(val);
        }

        return exports;
    })();

    /* ------------------------------ isFn ------------------------------ */

    var isFn = _.isFn = (function ()
    {
        /* Check if value is a function.
         *
         * |Name  |Type   |Desc                       |
         * |------|-------|---------------------------|
         * |val   |*      |Value to check             |
         * |return|boolean|True if value is a function|
         *
         * Generator function is also classified as true.
         *
         * ```javascript
         * isFn(function() {}); // -> true
         * isFn(function*() {}); // -> true
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            var objStr = objToStr(val);

            return objStr === '[object Function]' || objStr === '[object GeneratorFunction]';
        }

        return exports;
    })();

    /* ------------------------------ noop ------------------------------ */

    var noop = _.noop = (function ()
    {
        /* A no-operation function.
         *
         * ```javascript
         * noop(); // Does nothing
         * ```
         */

        function exports() {}

        return exports;
    })();

    /* ------------------------------ mkdir ------------------------------ */

    _.mkdir = (function ()
    {
        /* Recursively create directories.
         *
         * |Name       |Type    |Desc               |
         * |-----------|--------|-------------------|
         * |dir        |string  |Directory to create|
         * |[mode=0777]|number  |Directory mode     |
         * |callback   |function|Callback           |
         *
         * ```javascript
         * mkdir('/tmp/foo/bar/baz', function (err)
         * {
         *     if (err) console.log(err);
         *     else console.log('Done');
         * });
         * ```
         */

        /* dependencies
         * isFn noop 
         */

        var fs = require('fs'),
            path = require('path');

        var _0777 = parseInt('0777', 8);

        function exports(p, mode, cb)
        {
            if (isFn(mode))
            {
                cb = mode;
                mode = _0777;
            }
            cb = cb || noop;
            p = path.resolve(p);

            fs.mkdir(p, mode, function (err)
            {
                if (!err) return cb();

                switch (err.code)
                {
                    case 'ENOENT':
                        exports(path.dirname(p), mode, function (err)
                        {
                            if (err) return cb(err);

                            exports(p, mode, cb)
                        });
                        break;
                    default:
                        fs.stat(p, function (errStat, stat)
                        {
                            if (errStat || !stat.isDirectory()) return cb(errStat);

                            cb();
                        });
                }
            });
        }

        return exports;
    })();

    /* ------------------------------ nextTick ------------------------------ */

    var nextTick = _.nextTick = (function (exports)
    {
        /* Next tick for both node and browser.
         *
         * |Name|Type    |Desc            |
         * |----|--------|----------------|
         * |cb  |function|Function to call|
         *
         * Use process.nextTick if available.
         *
         * Otherwise setImmediate or setTimeout is used as fallback.
         *
         * ```javascript
         * nextTick(function ()
         * {
         *     // Do something...
         * });
         * ```
         */

        if (typeof process === 'object' && process.nextTick)
        {
            exports = process.nextTick;
        } else if (typeof setImmediate === 'function')
        {
            exports = function (cb) { setImmediate(ensureCallable(cb)) }
        } else
        {
            exports = function (cb) { setTimeout(ensureCallable(cb), 0) };
        }

        function ensureCallable(fn)
        {
            if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

            return fn;
        }

        return exports;
    })({});

    /* ------------------------------ restArgs ------------------------------ */

    var restArgs = _.restArgs = (function ()
    {
        /* This accumulates the arguments passed into an array, after a given index.
         *
         * |Name      |Type    |Desc                                   |
         * |----------|--------|---------------------------------------|
         * |function  |function|Function that needs rest parameters    |
         * |startIndex|number  |The start index to accumulates         |
         * |return    |function|Generated function with rest parameters|
         *
         * ```javascript
         * var paramArr = _.restArgs(function (rest) { return rest });
         * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
         * ```
         */

        function exports(fn, startIdx)
        {
            startIdx = startIdx == null ? fn.length - 1 : +startIdx;

            return function ()
            {
                var len = Math.max(arguments.length - startIdx, 0),
                    rest = new Array(len),
                    i;

                for (i = 0; i < len; i++) rest[i] = arguments[i + startIdx];

                // Call runs faster than apply.
                switch (startIdx)
                {
                    case 0: return fn.call(this, rest);
                    case 1: return fn.call(this, arguments[0], rest);
                    case 2: return fn.call(this, arguments[0], arguments[1], rest);
                }

                var args = new Array(startIdx + 1);

                for (i = 0; i < startIdx; i++) args[i] = arguments[i];

                args[startIdx] = rest;

                return fn.apply(this, args);
            };
        }

        return exports;
    })();

    /* ------------------------------ waterfall ------------------------------ */

    _.waterfall = (function ()
    {
        /* Run an array of functions in series.
         *
         * |Name |Type    |Desc                   |
         * |-----|--------|-----------------------|
         * |tasks|array   |Array of functions     |
         * |[cb] |function|Callback once completed|
         *
         * ```javascript
         * waterfall([
         *     function (cb)
         *     {
         *         cb(null, 'one');
         *     },
         *     function (arg1, cb)
         *     {
         *         // arg1 -> 'one'
         *         cb(null, 'done');
         *     }
         * ], function (err, result)
         * {
         *     // result -> 'done'
         * });
         * ```
         */

        /* dependencies
         * noop nextTick restArgs 
         */

        function exports(tasks, cb)
        {
            cb = cb || noop;

            var current = 0;

            var taskCb = restArgs(function (err, args)
            {
                if (++current >= tasks.length || err)
                {
                    args.unshift(err);
                    nextTick(function () { cb.apply(null, args) });
                } else
                {
                    args.push(taskCb);
                    tasks[current].apply(null, args);
                }
            });

            if (tasks.length)
            {
                tasks[0](taskCb);
            } else
            {
                nextTick(function () { cb(null) });
            }
        }

        return exports;
    })();

    return _;
}));