const jade = require('jade'),
    sass = require('node-sass'),
    minify = require('html-minifier').minify,
    promisify = require('util').promisify,
    fs = require('fs');
    
const util = require('./util');

const article = require('./post/article.json'),
    painting = require('./post/painting.json'),
    project = require('./post/project');

const mkdir = promisify(util.mkdir),
    readFile = promisify(fs.readFile),
    copy = promisify(require('copy')),
    writeFile = promisify(fs.writeFile);

sass.render = promisify(sass.render);

async function readTpl()
{
    console.log('Step: read template');

    let data = await readFile('./template/index.jade', 'utf8');

    let indexTpl = jade.compile(data, {pretty: true});

    return indexTpl;
}

function renderTpl(tpl)
{
    console.log('Step: render template');

    return tpl({
        article,
        painting,
        project
    });
}

async function outputResult(result)
{
    console.log('Step: output result');

    await writeFile('./dist/index.html', minify(result, {
        collapseWhitespace: true,
        minifyJS: true
    }), 'utf8');
}

async function buildCss()
{
    console.log('Step: build css');

    let result = await sass.render({
        file: 'template/style.scss',
        outputStyle: 'compressed'
    });

    await writeFile('./dist/style.css', result.css);
}

(async () => {
    await mkdir('dist');
    await buildCss();
    let result = renderTpl(await readTpl());
    await outputResult(result);
    console.log('Step: copy img');
    await copy('./img/*.jpg', './dist/img');
})();
