var jade = require('jade'),
    async = require('async'),
    sass = require('node-sass'),
    fs = require('fs');

var article = require('./post/article.json'),
    painting = require('./post/painting.json'),
    project = require('./post/project');

function readTpl(cb)
{
    console.log('Step: read template');

    var indexTpl;

    async.waterfall([
        function (cb)
        {
            fs.readFile('./template/index.jade', 'utf8', function (err, data)
            {
                indexTpl = jade.compile(data, {pretty: true});
                cb();
            });
        }
    ], function ()
    {
        cb(null, {
            indexTpl: indexTpl
        });
    });
}

function renderTpl(tpls, cb)
{
    console.log('Step: render template');

    cb(null, {
        index: tpls.indexTpl({
            article : article,
            painting: painting,
            project : project
        })
    });
}

function outputResult(results, cb)
{
    console.log('Step: output result');

    fs.writeFile('./dist/index.html', results.index, 'utf8', function (err)
    {
        cb(err);
    });
}

function buildCss(cb)
{
    console.log('Sep: build css');

    sass.render({
        file: 'template/style.scss',
        outputStyle: 'compressed'
    }, function (err, result)
    {
        if (err) return cb(err);

        fs.writeFile('./build/style.css', result.css, function (err)
        {
            cb(err);
        });
    });
}

async.waterfall([
    buildCss,
    readTpl,
    renderTpl,
    outputResult
], function (err)
{
    if (err) return console.error(err);

    console.log('Done!');
});