'use strict';

const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const meow = require('meow');
const Twig = require('twig');
const MyPipe = require('./src/myPipe');
const saveFile = require('./src/pipes/saveFile');
const printLog = require('./src/pipes/printLog');

const _get = lodash.get;
const _merge = lodash.merge;

const cli = meow(`
Usage:
\tnpx tateru-cli [CONFIG FILE] [OPTIONS] [ARGS]

Options:
\t--env     \tSet build environment - dev or prod. Default is dev.
\t--page  -p\tBuild only single page from config.
\t--help    \tDisplay help and usage details
`, {
    flags: {
        env: {
            type: 'string',
            default: '',
            description: 'Set build environment.'
        },
        page: {
            type: 'string',
            default: '',
            alias: 'p',
            description: 'Build only single page from config.'
        },
        lang: {
            type: 'string',
            default: 'cs',
            alias: 'l',
            description: 'Select language subset to build.'
        }
    }
});

const ENV_DEVELOPMENT = 'dev';
const ENV_PRODUCTION = 'prod';
const LANG_DEFAULT = 'cs';

const options = {
    configFile: cli.input[0] || 'config.json',
    env: cli.flags.env || ENV_DEVELOPMENT,
    lang: cli.flags.lang || LANG_DEFAULT,
};

if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === 'development') {
        options.env = ENV_DEVELOPMENT;
    }
    if (process.env.NODE_ENV === 'production') {
        options.env = ENV_PRODUCTION;
    }
}

const rootDir = path.resolve(process.cwd())
const configFileSrc = path.resolve(rootDir, options.configFile);

if (!fs.existsSync(options.configFile)) {
    console.error(`Cannot find config file "${options.configFile}" on path "${configFileSrc}"`);
    process.exit(1);
} else {
    console.log(`Config file "${options.configFile}" loaded`)
}

let configFile;

try {
    configFile = require(configFileSrc);
} catch (e) {
    console.error(`Cannot load config file "${configFileSrc}"`)
    process.exit(1);
}

const hrefData = {};
try {
    Object.keys(configFile.pages[options.lang]).forEach(item => {
        try {
            hrefData[item] = `/${configFile.pages[options.lang][item].ext}`;
        } catch (e) {
            console.error(`Cannot find page ext in lang group "${options.lang}".`);
        }
    });
} catch (e) {
    console.error(`Cannot find pages in lang group "${options.lang}".`);
    process.exit(1);
}


const renderOptions = _merge(
    configFile.options.data,
    configFile.env[options.env].data,
    {
        href: hrefData,
        lang: options.lang
    }
);

const renderSrcDir = path.resolve(rootDir, configFile.options.src);
const renderExtDir = path.resolve(rootDir, configFile.options.ext);


/**
 * Translations
 */
const translationFilePath = path.resolve(rootDir, configFile.translations[options.lang].src);
if (!fs.existsSync(translationFilePath)) {
    console.error(`Cannot find translation file on path "${translationFilePath}"`);
    process.exit(1);
}
const translationFileContent = fs.readFileSync(translationFilePath);
const translations = JSON.parse(translationFileContent.toString());

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
    if (!configFile.pages[options.lang][pageName]) {
        console.error(`"${pageName}" were not found in config file.`);
        process.exit(1);
        return false;
    }

    const buildPageConfig = configFile.pages[options.lang][pageName];
    const pathToExt = path.resolve(renderExtDir, buildPageConfig.ext);
    const pathToSrc = path.resolve(renderSrcDir, buildPageConfig.src);
    const relativeFileExt = path.join(configFile.options.ext, buildPageConfig.ext);
    const relativeFileSrc = path.join(configFile.options.src, buildPageConfig.src);

    if (!fs.existsSync(pathToSrc)) {
        console.error(`File "${pathToSrc}" does not exits`);
        process.exit(1);
    }

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
 * Save generated html in file.
 *
 * @param {Object} data
 */

const prodMinifyHtml = (data) => {
    if (options.env === 'prod') {
        return minifyHtml(data);
    }
    return data;
}

/**
 * Generate pages.
 */

const renderPipeline = (page) => {
    renderPage(page)
        .pipe(prodMinifyHtml)
        .pipe(printLog)
        .pipe(saveFile);
}

const run = () => {
    try {
        console.log(`Environment:\t${options.env}`);

        if (cli.flags.page && cli.flags.lang) {
            // Build single page in selected lang
            console.log(`Going to build page "${cli.flags.page}" in "${cli.flags.lang}" group.`)
            renderPipeline(cli.flags.page);
        } else if (cli.flags.page) {
            console.log(`Going to build page "${cli.flags.page}" in "${options.lang}" group.`)
            renderPipeline(cli.flags.page);
        } else if (cli.flags.lang) {
            // Build all pages in single lang
            console.log(`Going to build pages in "${cli.flags.lang}" group.`)
            Object.keys(configFile.pages[options.lang]).forEach(item => {
                renderPipeline(item);
            });
        } else {
            // Build everything
            console.log(`Going to build all pages in all groups.`)
            Object.keys(configFile.pages).forEach(lang => {
                Object.keys(configFile.pages[lang]).forEach(item => {
                    renderPipeline(item);
                });
            });

        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

module.exports = run;
