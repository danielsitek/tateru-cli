# Tateru CLI

[![npm](https://img.shields.io/npm/v/tateru-cli)](https://www.npmjs.com/package/tateru-cli)
[![Maintainability](https://api.codeclimate.com/v1/badges/a27bd4122e740512c6f9/maintainability)](https://codeclimate.com/github/danielsitek/tateru-cli/maintainability)
[![pipeline status](https://gitlab.com/danielsitek/tateru-cli-ci/badges/master/pipeline.svg)](https://gitlab.com/danielsitek/tateru-cli-ci/pipelines)
[![tateru-cli dev status](https://github.com/danielsitek/tateru-cli/actions/workflows/dev.yml/badge.svg?branch=master)](https://github.com/danielsitek/tateru-cli-ci/blob/master/.github/workflows/ci.yml)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue.svg?logo=github)](https://github.com/danielsitek/tateru-cli-ci/actions)
[![GitLab Actions](https://img.shields.io/badge/CI-GitLab%20Pipelines-blue.svg?logo=gitlab)](https://gitlab.com/danielsitek/tateru-cli-ci/pipelines)

Simple CLI static site builder tool with Twig.

---

## ✨ Features

- Lightweight CLI for generating static sites.
- Uses **Twig.js** templating engine for simplified markup.
- Has integrated **custom Twig extensions** (e.g., translations, sorting)
- Minifies output HTML.
- Simple integration with Gulp and other build tools via CLI.
- Configured via **custom JSON configuration**, allowing for extensive customization of build settings.
- Zero dependencies on complex frameworks.

---

## 📦 Install

Install **Tateru CLI** locally in your project:

```sh
npm i -D tateru-cli
```

Or install globally:

```sh
npm i -g tateru-cli
```

---

## 🚀 Usage

1. **Create a config file** `tateru.config.json` with your settings (see example in `./example/tateru.config.json`).
2. **Run the CLI command:**

```sh
npx tateru-cli tateru.config.json
```

Or, if installed globally:

```sh
tateru-cli tateru.config.json
```

### Example Usage

```sh
tateru-cli tateru.config.json --env prod
```

This generates the site with the `prod` environment settings.

### Show help

To display usage details, run:

```sh
tateru-cli --help
```

or

```sh
npx tateru-cli --help
```

### (Experimental) Integration with [Gulp](http://gulpjs.com/)

You can use Tateru CLI within a [Gulp](http://gulpjs.com/) task by executing it via `child_process.exec`:

```js
/** @file tasks/tateru.js */

const { exec } = require('child_process');

module.exports = function tateru(cb) {
  return new Promise((resolve) => {
    exec('npx tateru-cli tateru.config.json', function (error, stdout, stderr) {

      if (error && stdout) {
        console.error(stdout);
      } else if (stdout) {
        console.info(stdout);
      }

      if (stderr) {
        console.error(stderr);
      }

      resolve(cb);
    })
  })
}
```

```js
/** @file gulpfile.js */

const { series, parallel } = require('gulp');
const tateru = require('./tasks/tateru');

function build(cb) {
  return series(clean, parallel(css, tateru))(cb);
}

module.exports = {
    build,
    default: build,
};
```

---

## ⚙️ Configuration

The `tateru.config.json` file defines how Tateru CLI generates your static site. Below is a breakdown of the configuration structure:

### **Environment Settings**

```json
"env": {
    "dev": {
        "data": {
            "app": {
                "environment": "dev"
            }
        }
    },
    "prod": {
        "data": {
            "app": {
                "environment": "prod"
            }
        }
    }
}
```
Defines environment-specific variables (`dev`, `prod`).

- `data`: Overrides specific data in `options.data`, allowing for environment-based customization.

### **Global Options**

```json
"options": {
    "data": {
        "app": {
            "environment": "dev",
            "root": "/"
        },
        "title": "Tateru CLI Example",
        "domain": "https://www.example.com/"
    },
    "src": "src/twig",
    "ext": "dist"
}
```
- `data`: Global variables accessible in templates. For example, you can reference `title` in a Twig template using `{{- title -}}`.
- `src`: Path to source Twig files.
- `ext`: Output directory for compiled files.

### **Global Data in Templates**

The final data available in Twig templates is composed by merging several configuration sources:

- `options.data`: Global data defined in the `tateru.config.json` file.
- `env.[env].data`: Environment-specific data (`dev` or `prod`).
- `pages.[lang].[page].data`: Page-specific overrides.
- `href`: Automatically generated URLs for each page.
- `lang`: The current language in use.

Example of referencing global data in a Twig template:

```twig
<h1>{{ title }}</h1>
<p>Environment: {{ app.environment }}</p>
<a href="{{ href.index }}">Home</a>
```

### **Translations**

```json
"translations": {
    "cs": {
        "src": "src/translations/cs.json",
        "ext": ""
    }
}
```
Defines translation files per language.

### **Pages Configuration**

```json
"pages": {
    "cs": {
        "index": {
            "data": {
                "page": "index",
                "title": "Index Page"
            },
            "src": "views/index.html.twig",
            "ext": "index.html",
            "minify": ["prod", "dev"]
        }
    }
}
```
- `pages`: Defines each page with its template source, output name, and optional minification settings.
- `data`: Page-specific variables that override global data in `options.data`.
- `src`: Path to the Twig template file for this page.
- `ext`: Output file name and extension.
- `minify`: Array specifying environments (`prod`, `dev`) where HTML minification should be applied.

For more complex configurations, refer to `/example/tateru.config.json`.

---

## 🛠 Custom Twig Extensions

### 📖 Translations

```twig
{{ trans('homepage.title') }}
```

### 🔀 Sort By

Example `translation.json`:

```json
{
    "sort": [
        { "key": "x" },
        { "key": "a" },
        { "key": "k" },
        { "key": "c" },
        { "key": "b" }
    ]
}
```

Example `index.html.twig`:

```twig
<ul>
    {% for item in trans('sort')|sort_by('key') -%}
    <li>{{ item.key }}</li>
    {% endfor %}
</ul>
```

---

## 🔧 Development

To build the project:

```sh
npm run build
```

To clean the output directory:

```sh
npm run clean
```

To run an example build:

```sh
npm run example:build
```

To run an example production build:

```sh
npm run example:build:prod
```

To clean example output:

```sh
npm run example:clean
```

To run the CLI in development mode:

```sh
npm run dev
```

Test CLI help:

```sh
npm run dev:help
```

Test CLI version:

```sh
npm run dev:version
```

Test CLI with arguments:

```sh
npm run dev:args
```

Test CLI error:

```sh
npm run dev:error
```

Test CLI arguments error:

```sh
npm run dev:args-error
```

Test CLI argument with missing value error:

```sh
npm run dev:missing-arg-error
```

Run unit tests:

```sh
npm test
```

---

## 🤝 Contributing

Want to contribute? Feel free to open an **issue** or **pull request** on GitHub! 🚀

1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit the changes (`git commit -m "Add new feature"`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a **pull request** 🚀

---

## 📜 License

[MIT](./LICENSE) License © 2025 [Daniel Sitek](https://github.com/danielsitek)
