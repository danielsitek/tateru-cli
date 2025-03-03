import type Twig from 'twig';

export type Environment = 'dev' | 'prod';

export type DataType = {};

export type Translations = {};

export type PageNameString = 'index' | string;

export type FileSystemPath = string;

export type LanguageString = 'en' | 'cs' | string;

type CustomKey<T> = Record<string, T>;

export interface DataObject<T = DataType> {
    data: T;
}

export type PagesUrlObject = Record<string, FileSystemPath>;

export interface BuilderOptions {
    configFile: string;
    env: Environment;
    lang?: LanguageString;
    page?: string;
}

/**
 * Config file content
 */

export interface EnvironmentOptions {
    app: {
        /**
         * Working environment.
         */
        environment: Environment;

        [key: string]: any;
    };
}

export interface EnvironmentData extends DataObject<EnvironmentOptions> { }

export interface FileSystemPathSettings {
    /**
     * Path to source file or folder.
     */
    readonly src: FileSystemPath;

    /**
     * Path to generated file or folder.
     */
    readonly ext: FileSystemPath;

    /**
     * Apply file minification for selected environments.
     */
    readonly minify?: Array<Environment | undefined>;
}

export type ConfigFileTranslations = Record<
    LanguageString,
    FileSystemPathSettings
>;

export interface ConfigFileOptionsData extends EnvironmentOptions { }

export interface ConfigFileEnvironment {
    dev: EnvironmentData;
    prod: EnvironmentData;
}

export interface ConfigFileOptions
    extends FileSystemPathSettings,
    DataObject<ConfigFileOptionsData> { }

export interface ConfigFilePages
    extends CustomKey<CustomKey<ConfigFileOptions>> {
    [shortLangString: string]: Record<PageNameString, ConfigFileOptions>;
}

export interface ConfigFile {
    /**
     * Modifications based on environment - dev or prod.
     */
    readonly env: ConfigFileEnvironment;

    /**
     * Options configuration.
     */
    readonly options: ConfigFileOptions;

    /**
     * Translations configuration.
     */
    readonly translations: ConfigFileTranslations;

    /**
     * Pages configuration.
     */
    readonly pages: ConfigFilePages;
}

export interface ConfigFile2 {
    /**
     * Modifications based on environment - dev or prod.
     */
    readonly env: {
        [K in Environment]: {
            data: Partial<ConfigFile2['options']['data']>;
        };
    };

    /**
     * Options configuration.
     */
    readonly options: {
        data: Record<string, unknown>;

        /**
         * Path to source file or folder.
         */
        src: string;

        /**
         * Path to generated file or folder.
         */
        ext: string;
    };

    /**
     * Translations configuration.
     */
    readonly translations: {
        [translationKey: string]: {
            /**
             * Path to source file or folder.
             */
            src: string;

            /**
             * Path to generated file or folder.
             */
            ext: string;
        };
    };

    /**
     * Pages configuration.
     */
    readonly pages: {
        [T in keyof ConfigFile2['translations']]: {
            [pageKey: string]: {
                data: Partial<ConfigFile2['options']['data']>;

                /**
                 * Path to source file or folder.
                 */
                src: string;

                /**
                 * Path to generated file or folder.
                 */
                ext: string;

                /**
                 * Apply file minification for selected environments.
                 */
                minify?: Array<keyof ConfigFile2['env']>; // např. seznam env, pro které má minifikovat
            };
        };
    };
}

/**
 * Concatenated data from ConfigFile.options, ConfigFile.env and ConfigFile.page options for single page.
 */
export interface PageRenderOptions extends ConfigFileOptionsData {
    href: PagesUrlObject;
    lang: LanguageString;
    page: PageNameString;
}

export interface TwigConfigurationNamespaces {
    /**
     * Absolute path to declared Main namespace.
     */
    Main: FileSystemPath;
}

export interface TwigConfiguration extends Twig.Parameters {
    /**
     * Random unique ID.
     */
    id: number;

    /**
     * Absolute path to twig file.
     */
    path: FileSystemPath;

    /**
     * Absolute path to twig root folder.
     */
    base: FileSystemPath;

    /**
     * Declared namespaces.
     */
    namespaces: TwigConfigurationNamespaces;

    /**
     * Content of the twig file.
     */
    data: string;
}

export interface PipelineData {
    /**
     * Compiled source from twig file.
     */
    source: string;

    /**
     * Absolute path to compiled file.
     */
    filePathExt: FileSystemPath;

    /**
     * Absolute path to twig file.
     */
    filePathSrc: FileSystemPath;

    /**
     * Relative path to compiled file.
     */
    relativeFileExt: FileSystemPath;

    /**
     * Relative path to twig file.
     */
    relativeFileSrc: FileSystemPath;

    /**
     * Absolute path to folder with twig files.
     */
    renderSrcDir: FileSystemPath;

    /**
     * Absolute path to folder for compiled files.
     */
    renderExtDir: FileSystemPath;

    twigConfig?: TwigConfiguration;
    renderOptions: PageRenderOptions;
}

/**
 * Formatter function type
 *
 * @param contents - The contents of the file to format.
 * @param fileType - The file type to format. Example: 'html', 'json', 'webmanifest', etc.
 */
export type CoreFormatter = (contents: string, fileType?: string) => Promise<string>;

/**
 * Minify function type
 *
 * @param contents - The contents of the file to minify.
 * @param fileType - The file type to minify. Example: 'html', 'json', 'webmanifest', etc.
 */
export type CoreMinify = (contents: string, fileType?: string) => Promise<string>;

/**
 * Core options
 */
export interface CoreOptions {
    /**
     * Tateru CLI configuration object containing environment, options, translations, and pages settings.
     */
    config: ConfigFile;

    /**
     * Working environment. Defaults to 'dev' if not specified. Example: 'dev', 'prod'.
     */
    env?: Environment;

    /**
     * Language code for translations. Optional. Example: 'en', 'cs'.
     */
    lang?: string;

    /**
     * Page name to process. Optional. Example: 'index', 'about'.
     */
    page?: string;

    /**
     * Current working directory. Optional. Defaults to '.'.
     */
    cwd?: string;

    /**
     * Function to format the contents. Takes content string and optional file type.
     */
    formatter?: CoreFormatter;

    /**
     * Function to minify the contents. Takes content string and optional file type.
     */
    minify?: CoreMinify;
}

/**
 * Core file
 */
export interface CoreFile {
    /**
     * Current working directory path.
     */
    cwd: string;

    /**
     * Base directory path.
     */
    base: string;

    /**
     * Full path to source file.
     * @example '/path/to/src/file.html'
     */
    path: string;

    /**
     * Path to generated file.
     * @example '/path/to/dist/file.html'
     */
    ext: string;

    /**
     * File type from extension. Example: 'html', 'json', 'webmanifest', etc.
     * @remarks This field is used by formatter and minify functions
     */
    type?: string;

    /**
     * File contents.
     */
    contents: string;
}

/**
 * Core result
 */
export type CoreResult = CoreFile[];

/**
 * Tateru CLI Core function
 *
 * @param options - Core options.
 * @returns Core result.
 */
export declare const core: (options: CoreOptions) => Promise<CoreResult>;
