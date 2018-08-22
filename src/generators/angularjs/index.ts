
import * as path from "path";
import { OpenAPIObject } from "openapi3-ts";
import { AngularJsFactoryTemplater } from "./angular-js-factory-templater";
import { SchemaMapper } from "../../util/schema-mapper";
import { mkdirsSync, createWriteStream, WriteStream } from 'fs-extra';
import { Command, option } from "commander";
import { CommandConfigurator, CommandFlagConfig } from "../../command-configurator";
import { AngularJsServiceTemplater } from "./angular-js-service-templater";
import { PathMapper } from "../../util/path-mapper";
var jsBeautify = require('js-beautify').js_beautify

export class AngularJsGeneratorCommand implements CommandConfigurator {
    comando = 'angularjs'
    alias = 'ngjs'
    description = 'Gerarador para AngularJs'
    flags: CommandFlagConfig[] = [
        { name: '-i --inherance', description: "Define que as factorys sigam o padrão de herança" },
        { name: '--no-factory', description: "Define que não sejam gerados factorys" },
        { name: '--no-services', description: "Define que não sejam geradas services" },
    ]


    action(options: any, ...args: any[]) {
        let streams: WriteStream[] = []
        console.log(options)
        if (options.factory) {
            mkdirsSync(path.resolve(options.dist, 'factory'));
            streams = streams.concat(
                this.gerarFactory(options)
            );
        }

        if (options.services) {
            mkdirsSync(path.resolve(options.dist, 'service'));
            streams = streams.concat(
                this.gerarSevices(options)
            );
        }
    }

    gerarFactory(options: any) {
        const factoryTemplater = new AngularJsFactoryTemplater();
        return SchemaMapper.instance.getAllSchemasAsArray().map(({ name, schema }) => {
            const fileName = factoryTemplater.getFileName(name, schema);
            const factoryWriteStream = createWriteStream(path.resolve(options.dist, 'factory', fileName))
            let factoryTemplate
            if (options.inherance) {
                factoryTemplate = factoryTemplater.getFactoryExtendingTemplate(name, schema)
            } else {
                factoryTemplate = factoryTemplater.getFactoryTemplate(name, schema)
            }

            factoryWriteStream.write(jsBeautify(factoryTemplate));
            return factoryWriteStream
        })
    }

    gerarSevices(options: any) {
        const serviceTemplater = new AngularJsServiceTemplater();
        return PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const fileName = serviceTemplater.getFileName(tagDefinition);
            const serviceWriteStream = createWriteStream(path.resolve(options.dist, 'service', fileName))

            let factoryTemplate = serviceTemplater.getServiceTemplate(tagDefinition)

            serviceWriteStream.write(jsBeautify(factoryTemplate));
            return serviceWriteStream
        })
    }

}