import Twig from 'twig'

export type Environment = 'dev' | 'prod'

export type DataType = {}

export type Translations = {}

export type PageNameString = 'index' | string

export type FileSystemPath = string

export type LanguageString = 'en' | string

interface CustomKey<T> {
    [key: string]: T
}

export interface DataObject<T = DataType> {
    data: T
}

export interface BuilderOptions {
    configFile: string
    env: Environment
    lang: LanguageString
    flags: {
        [flagName: string]: any
    }
}

/**
 * Config file content
 */
export interface ConfigFile {
    /**
     * Modifications based on environment - dev ot prod.
     */
    readonly env: ConfigFileEnvironment

    /**
     * Options configuration.
     */
    readonly options: ConfigFileOptions

    /**
     * Translations configuration.
     */
    readonly translations: ConfigFileTranslations

    /**
     * Pages configuration
     */
    readonly pages: ConfigFilePages
}

export interface EnvironmentData extends DataObject<EnvironmentOptions> {}

export interface EnvironmentOptions {
    app: {
        /**
         * Working environment.
         */
        environment: Environment

        [key: string]: any
    }
}

export interface ConfigFileEnvironment {
    dev: EnvironmentData
    prod: EnvironmentData
}

export interface ConfigFileTranslations {
    [shortLangString: string]: FileSystemPathSettings
}

export interface ConfigFilePages extends CustomKey<CustomKey<ConfigFileOptions>> {
    [shortLangString: string]: {
        [pageNameString: string]: ConfigFileOptions
    }
}

export interface ConfigFileOptions extends FileSystemPathSettings, DataObject<ConfigFileOptionsData> {}

export interface FileSystemPathSettings {
    /**
     * Path to source file or folder.
     */
    readonly src: FileSystemPath

    /**
     * Path to generated file or folder.
     */
    readonly ext: FileSystemPath
}

export interface ConfigFileOptionsData extends EnvironmentOptions {}

export interface PagesUrlObject {
    [pageName: string]: FileSystemPath
}

export interface PipelineData {
    /**
     * Compiled source from twig file.
     */
    source: string

    /**
     * Absolute path to compiled file.
     */
    filePathExt: FileSystemPath

    /**
     * Absolute path to twig file.
     */
    filePathSrc: FileSystemPath

    /**
     * Relative path to compiled file.
     */
    relativeFileExt: FileSystemPath

    /**
     * Relative path to twig file.
     */
    relativeFileSrc: FileSystemPath

    /**
     * Absolute path to folder with twig files.
     */
    renderSrcDir: FileSystemPath

    /**
     * Absolute path to folder for compiled files.
     */
    renderExtDir: FileSystemPath

    twigConfig?: TwigConfiguration
    renderOptions: PageRenderOptions
}

/**
 * Concatenated data from ConfigFile.options, ConfigFile.env and ConfigFile.page options for single page.
 */
export interface PageRenderOptions extends ConfigFileOptionsData {
    href: PagesUrlObject
    lang: LanguageString
    page: PageNameString
}

export interface TwigConfiguration extends Twig.Parameters {
    /**
     * Random unique ID.
     */
    id: number

    /**
     * Absolute path to twig file.
     */
    path: FileSystemPath

    /**
     * Absolute path to twig root folder.
     */
    base: FileSystemPath

    /**
     * Declared namespaces.
     */
    namespaces: TwigConfigurationNamespaces

    /**
     * Content of the twig file.
     */
    data: string
}

export interface TwigConfigurationNamespaces {
    /**
     * Absolute path to declared Main namespace.
     */
    Main: FileSystemPath
}

