
import { SchemaMapper } from "../../util/schema-mapper";
import { mkdirsSync, createWriteStream, WriteStream } from 'fs-extra';
import { CommandConfigurator, CommandFlagConfig } from "../../command-configurator";
import { AngularIoServiceTemplater } from "./angular-io-service-templater";
import { PathMapper } from "../../util/path-mapper";
import { TypescriptEntityTemplater } from "../typescript/typescript-entity-templater";
import { resolve } from "path";
var jsBeautify = require('js-beautify').js_beautify

export class AngularIoGeneratorCommand implements CommandConfigurator {
    comando = 'angular'
    alias = 'ng'
    description = 'Gerarador para AngularIo (v2+)'
    flags: CommandFlagConfig[] = [
        { name: '-i --inherance', description: "Define que as entitys sigam o padrão de herança" },
        { name: '--no-entity', description: "Define que não sejam gerados entitys" },
        { name: '--no-services', description: "Define que não sejam geradas services" },
    ]


    action(options: any, ...args: any[]) {
        let streams: WriteStream[] = []
        console.log(options)
        if (options.entity) {
            mkdirsSync(resolve(options.dist, 'entity'));
            streams = streams.concat(
                this.gerarEntity(options)
            );
        }

        if (options.services) {
            mkdirsSync(resolve(options.dist, 'service'));
            streams = streams.concat(
                this.gerarSevices(options)
            );
        }
    }

    gerarEntity(options: any) {
        return SchemaMapper.instance.getAllSchemasAsArray().map(({name, schema}) => {
            const entityTemplater = new TypescriptEntityTemplater(options, schema);
            const fileName = entityTemplater.getFileName(name);
            const entityWriteStream = createWriteStream(resolve(options.dist, 'entity', fileName))

            let entityTemplate = entityTemplater.getEntityTemplate(name)

            entityWriteStream.write(jsBeautify(entityTemplate, {
                "preserve_newlines": true,
                "brace_style": "collapse-preserve-inline",
                "max_preserve_newlines": 2
            }));
            entityWriteStream.end();
            return entityWriteStream
        })
    }

    gerarSevices(options: any) {
        return PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const serviceTemplater = new AngularIoServiceTemplater(tagDefinition);
            const fileName = serviceTemplater.getFileName();
            const serviceWriteStream = createWriteStream(resolve(options.dist, 'service', fileName))

            let entityTemplate = serviceTemplater.getServiceTemplate()

            serviceWriteStream.write(jsBeautify(entityTemplate, {
                "preserve_newlines": true,
                "brace_style": "collapse-preserve-inline",
                "max_preserve_newlines": 2
            }));
            serviceWriteStream.end();
            return serviceWriteStream
        })
    }

}