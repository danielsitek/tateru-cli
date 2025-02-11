import Twig from 'twig';

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
