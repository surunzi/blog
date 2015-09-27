var jade  = require('jade'),
    async = require('async'),
    fs    = require('fs');

var article  = require('./post/article.json'),
    painting = require('./post/painting.json'),
    project  = require('./post/project');

function readTpl(callback)
{
    console.log('Step: read template');

    var indexTpl;

    async.waterfall([
        function (callback)
        {
            fs.readFile('./template/index.jade', 'utf8', function (err, data)
            {
                indexTpl = jade.compile(data, {pretty: true});
                callback();
            });
        }
    ], function ()
    {
        callback(null, {
            indexTpl: indexTpl
        });
    });
}

function renderTpl(tpls, callback)
{
    console.log('Step: render template');

    callback(null, {
        index: tpls.indexTpl({
            article : article,
            painting: painting,
            project : project
        })
    });
}

function outputResult(results, callback)
{
    console.log('Step: output result');

    fs.writeFile('./build/index.html', results.index, 'utf8', function ()
    {
        callback();
    });
}

async.waterfall([
    readTpl,
    renderTpl,
    outputResult
], function ()
{
    console.log('Done!');
});