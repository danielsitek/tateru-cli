'use strict';

const _get = require('lodash.get');
const _merge = require('lodash.merge');
const fs = require('fs');
const meow = require('meow');
const path = require('path');
const Twig = require('twig');
const YAML = require('yaml');
const minify = require('html-minifier').minify;

const cli = meow(`
Usage:
  ./bin/build.js [CONFIG FILE] [OPTIONS] [ARGS]

Options:
      --env         Set build environment. (Default is dev)
      --page  -p    Build only single page from config.
  -h, --help        Display help and usage details
`, {
    flags: {
        env: {
            type: 'string',
            default: 'dev',
            description: 'Set build environment.'
        },
        page: {
            type: 'string',
            default: '',
            alias: 'p',
            description: 'Build only single page from config'
        }
    }
});

const options = {
    configFile: cli.input[0] || 'config.json',
    env: cli.flags.env,
    lang: 'cs',
};

if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === 'development') {
        options.env = 'dev';
    }
    if (process.env.NODE_ENV === 'production') {
        options.env = 'prod';
    }
}

const rootDir = path.resolve(__dirname, '../');
const configFileSrc = path.resolve(rootDir, options.configFile);

// TODO: Test if config file is loaded.
const configFile = require(configFileSrc);

const hrefData = {};
Object.keys(configFile.pages.cs).forEach(item => {
    hrefData[item] = `/${configFile.pages.cs[item].ext}`;
});


const renderOptions = _merge(
    configFile.options.data,
    configFile.env[options.env].data,
    {
        href: hrefData,
        lang: 'cs'
    }
);

const renderSrcDir = path.resolve(rootDir, configFile.options.src);
const renderExtDir = path.resolve(rootDir, configFile.options.ext);


/**
 * Piping middleware.
 *
 * @param {Any} data
 */
function MyPipe(data) {
    this.data = data;
    return this;
};

MyPipe.prototype.pipe = function(fn) {
    const data = this.data;
    const pipedData = fn(data);
    this.data = {
        ...data,
        ...pipedData
    };
    return this;
};


/**
 * Translations
 */
const translationFile = fs.readFileSync(path.resolve(rootDir, configFile.translations.cs.src));
const translations = YAML.parse(translationFile.toString());

Twig.extendFunction('trans', (value) => {
    return _get(translations, value) || value;
});


Twig.extendFilter('sort_by', (value, key) => {
    if (!Array.isArray(value)) {
        return value;
    }
    value.sort((a, b) => {
        if (!a[key]) return 0;
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });

    return value;
});


/**
 * Render Twig template with configuration from config.json.
 *
 * @param {String} pageName Page name in config.json file.
 */
const renderPage = (pageName) => {
    if (!configFile.pages.cs[pageName]) {
        return false;
    }

    const buildPageConfig = configFile.pages.cs[pageName];
    const pathToExt = path.resolve(renderExtDir, buildPageConfig.ext);
    const pathToSrc = path.resolve(renderSrcDir, buildPageConfig.src);
    const relativeFileExt = path.join(configFile.options.ext, buildPageConfig.ext);
    const relativeFileSrc = path.join(configFile.options.src, buildPageConfig.src);

    // TODO: test jestli byl readFileSync success.
    const templateFile = fs.readFileSync(pathToSrc);
    const fileTwigConfig = {
        id: Math.floor(Math.random() * 1000000),
        path: pathToSrc,
        base: renderSrcDir,
        // allowInlineIncludes: true,
        namespaces: {
            'Main': renderSrcDir + path.sep,
        },
        data: templateFile.toString(),
        // debug: true,
        // trace: true,
    };
    const fileRenderOptions = _merge(
        renderOptions,
        buildPageConfig.data
    );

    const template = Twig.twig(fileTwigConfig).render(fileRenderOptions);

    // return template;
    return new MyPipe({
        source: template,
        filePathExt: pathToExt,
        filePathSrc: pathToSrc,
        relativeFileExt,
        relativeFileSrc,
        renderSrcDir,
        renderExtDir,
        twigConfig: fileTwigConfig,
        renderOptions: fileRenderOptions
    });
};

/**
 * Print console log.
 *
 * @param {Object} data
 */
const printLog = (data) => {
    console.log(`Created:\t${data.relativeFileExt}`);
    // console.log(data);
    return data;
};

/**
 * Save generated html in file.
 *
 * @param {Object} data
 */
const saveFile = (data) => {
    const fileDir = path.dirname(data.filePathExt);
    const filePath = data.filePathExt;
    const fileSource = data.source;

    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
    fs.writeFileSync(filePath, fileSource);
    return data;
}

const minifyHtml = (data) => {
    let fileSource = data.source;
    fileSource = minify(fileSource, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    data.source = fileSource;
    return data;
};

const prodMinifyHtml = (data) => {
    if (options.env === 'prod') {
        return minifyHtml(data);
    }
    return data;
}


/**
 * Generate pages.
 */


const run = () => {
    console.log(`Environment:\t${options.env}`);

    if (cli.flags.page) {
        renderPage(cli.flags.page)
            .pipe(prodMinifyHtml)
            .pipe(printLog)
            .pipe(saveFile);
    } else {
        Object.keys(configFile.pages.cs).forEach(item => {
            renderPage(item)
                .pipe(prodMinifyHtml)
                .pipe(printLog)
                .pipe(saveFile);
        });
    }
}

module.exports = run;
