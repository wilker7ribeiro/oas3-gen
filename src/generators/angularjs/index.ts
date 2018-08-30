
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
        if (options.factory) {
            console.log("Gerando factorys...");
            mkdirsSync(path.resolve(options.dist, 'factory'));
            streams = streams.concat(
                this.gerarFactory(options)
            );
            console.log("Factorys geradas!");
        }

        if (options.services) {
            console.log("Gerando services...");
            mkdirsSync(path.resolve(options.dist, 'service'));
            streams = streams.concat(
                this.gerarSevices(options)
            );
            console.log("Services geradas!");
        }
    }

    gerarFactory(options: any) {
        return SchemaMapper.instance.getAllSchemasAsArray().map(({ name, schema }) => {
            const factoryTemplater = new AngularJsFactoryTemplater(schema);
            const fileName = factoryTemplater.getFileName(name);
            const factoryWriteStream = createWriteStream(path.resolve(options.dist, 'factory', fileName))
            let factoryTemplate
            if (options.inherance) {
                factoryTemplate = factoryTemplater.getFactoryExtendingTemplate(name)
            } else {
                factoryTemplate = factoryTemplater.getFactoryTemplate(name)
            }

            factoryWriteStream.write(jsBeautify(factoryTemplate));
            factoryWriteStream.end();
            return factoryWriteStream
        })
    }

    gerarSevices(options: any) {
        return PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const serviceTemplater = new AngularJsServiceTemplater(tagDefinition);
            const fileName = serviceTemplater.getFileName();
            const serviceWriteStream = createWriteStream(path.resolve(options.dist, 'service', fileName))

            let factoryTemplate = serviceTemplater.getServiceTemplate()

            serviceWriteStream.write(jsBeautify(factoryTemplate));
            serviceWriteStream.end();
            return serviceWriteStream
        })
    }

}