import { CommandConfigurator, CommandFlagConfig } from "../../command-configurator";
import { WriteStream, mkdirsSync, createWriteStream } from "fs-extra";
import { resolve } from "path";
import { PathMapper } from "../../util/path-mapper";
import { TypescriptEntityTemplater } from "./typescript-entity-templater";
import { SchemaMapper } from "../../util/schema-mapper";


var jsBeautify = require('js-beautify').js_beautify

export class TypescriptGeneratorCommand implements CommandConfigurator {
    comando = 'typescript'
    alias = 'ts'
    description = 'Gerarador para Typescript'
    flags: CommandFlagConfig[] = [
        // { name: '-l, --deep-level <n>', parser: parseInt,  description: "Define até qual profundidade deve ser gerados os valores dos mocks" },
        // { name: '--no-factory', description: "Define que não sejam gerados factorys" },
        // { name: '--no-entitys', description: "Define que não sejam geradas entitys" },
    ]


    action(options: any, ...args: any[]) {
        let streams: WriteStream[] = []
        mkdirsSync(resolve(options.dist, 'entity'));
        streams = streams.concat(
            this.gerarEntitys(options)
        );

    }

    gerarEntitys(options: any) {
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

}