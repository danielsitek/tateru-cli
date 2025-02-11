# Tateru CLI

[![npm](https://img.shields.io/npm/v/tateru-cli)](https://www.npmjs.com/package/tateru-cli)
[![Maintainability](https://api.codeclimate.com/v1/badges/a27bd4122e740512c6f9/maintainability)](https://codeclimate.com/github/danielsitek/tateru-cli/maintainability)
[![pipeline status](https://gitlab.com/danielsitek/tateru-cli-ci/badges/master/pipeline.svg)](https://gitlab.com/danielsitek/tateru-cli-ci/pipelines)
[![tateru-cli-ci status](https://github.com/danielsitek/tateru-cli-ci/workflows/CI%20tests/badge.svg?branch=master)](https://github.com/danielsitek/tateru-cli-ci/actions)
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
- Configured via **custom JSON configuration**.
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

To show CLI help:

```sh
npm run dev:help
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

MIT License © [Daniel Sitek](https://danielsitek.cz)
