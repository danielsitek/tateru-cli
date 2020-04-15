import path from 'path'
import fs from 'fs'
import { TwigConfigurationInterface, TwigConfigurationNamespaces } from '../../types'

class TwigConfiguration implements TwigConfigurationInterface {

    public id: number = 0

    public path: string = ''

    public base: string = ''

    public namespaces: TwigConfigurationNamespaces = {} as TwigConfigurationNamespaces

    public data: string = ''

    constructor (pathToTwigFile: string, twigBase: string) {
        try {
            if (!fs.existsSync(pathToTwigFile)) {
                throw new Error(`File "${pathToTwigFile}" does not exits`);
            }

            this.setId();
            this.setPath(pathToTwigFile);
            this.setBase(twigBase);
            this.setNamespaces(twigBase);
            this.setData(pathToTwigFile);

        } catch (e) {
            throw new Error(e)
        }
    }

    private setId () {
        this.id = Math.floor(Math.random() * 1000000)
    }

    private setPath (path: string) {
        this.path = path
    }

    private setBase (path: string) {
        this.base = path
    }

    private setNamespaces (base: string): void {
        this.namespaces = {
            'Main': base + path.sep,
        }
    }

    private setData (pathToFile: string) {
        const fileContent = fs.readFileSync(pathToFile);
        this.data = fileContent.toString('utf-8')
    }
}

export default TwigConfiguration