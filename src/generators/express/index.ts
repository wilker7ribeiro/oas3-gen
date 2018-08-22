import { CommandConfigurator, CommandFlagConfig } from "../../command-configurator";
import { WriteStream, mkdirsSync, createWriteStream } from "fs-extra";
import { resolve } from "path";
import { PathMapper } from "../../util/path-mapper";
import { ExpressServiceTemplater } from "./express-service-templater";


var jsBeautify = require('js-beautify').js_beautify

export class ExpressGeneratorCommand implements CommandConfigurator {
    comando = 'express'
    // alias = 'ex'
    description = 'Gerarador para Express'
    flags: CommandFlagConfig[] = [
        { name: '-l, --deep-level <n>', parser: parseInt,  description: "Define até qual profundidade deve ser gerados os valores dos mocks" },
        // { name: '--no-factory', description: "Define que não sejam gerados factorys" },
        // { name: '--no-services', description: "Define que não sejam geradas services" },
    ]


    action(options: any, ...args: any[]) {
        let streams: WriteStream[] = []
        console.log(options)
        mkdirsSync(resolve(options.dist, 'service'));
        streams = streams.concat(
            this.gerarMocks(options)
        );

    }

    gerarMocks(options: any) {
        const serviceTemplater = new ExpressServiceTemplater(options);
        return PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const fileName = serviceTemplater.getFileName(tagDefinition);
            const serviceWriteStream = createWriteStream(resolve(options.dist, 'service', fileName))

            let factoryTemplate = serviceTemplater.getServiceTemplate(tagDefinition)

            serviceWriteStream.write(jsBeautify(factoryTemplate));
            return serviceWriteStream
        })
    }

}