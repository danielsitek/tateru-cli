
export type Environment = 'dev' | 'prod'

export type DataType = {}

export interface BuilderOptions {
    configFile: string
    env: Environment
    lang: string
}

export interface DataObject {
    data: DataType
}

export interface ConfigFileEnvironment {
    dev: DataObject
    prod: DataObject
}

interface CustomKey<T> {
    [key: string]: T
}

export interface ConfigFile {
    env: ConfigFileEnvironment
    options: BaseSourceConfigWithData
    translations: CustomKey<BaseSourceConfig>
    pages: CustomKey<CustomKey<BaseSourceConfigWithData>>
}

export interface BaseSourceConfig {
    readonly src: string
    readonly ext: string
}

export interface BaseSourceConfigWithData extends BaseSourceConfig, DataObject {}

export interface HrefData extends CustomKey<string>{}

export interface PipelineData {
    source: string
    filePathExt: string
    filePathSrc: string
    relativeFileExt: string
    relativeFileSrc: string
    renderSrcDir: string
    renderExtDir: string
    twigConfig: TwigConfiguration
    renderOptions: PipelineDataRenderOptions
}

export interface PipelineDataRenderOptions extends RenderOptions, CustomKey<any> {}

export interface RenderOptions {
    href: CustomKey<string>
    lang: string
    page: string
}

export interface TwigConfiguration {
    id: number
    path: string
    base: string
    namespaces: TwigConfigurationNamespaces
    data: string
}

export interface TwigConfigurationNamespaces {
    Main: string
}

