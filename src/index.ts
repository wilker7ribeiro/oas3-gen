#!/usr/bin/env node
import { resolve } from 'path';
import { OpenAPIObject } from 'openapi3-ts'
import { AngularJsGeneratorCommand } from './generators/angularjs';
import { CommandConfigurator } from './command-configurator';
import * as commander from "commander";
import { SchemaMapper } from './util/schema-mapper';
import { PathMapper } from './util/path-mapper';
import { CoreMapper } from './util/core-mapper';
import { ExpressGeneratorCommand } from './generators/express';
import { TypescriptGeneratorCommand } from './generators/typescript';
import { AngularIoGeneratorCommand } from './generators/angulario';
import axios from "axios"
import { parse as yamlToJson } from "yamljs";
import { readFileSync } from 'fs';
// console.log(process.argv)
const swagger2openapi = require('swagger2openapi');

const program: commander.Command = require("commander");

program.version('0.0.1')



const generators: CommandConfigurator[] = [
    new AngularIoGeneratorCommand(),
    new AngularJsGeneratorCommand(),
    new ExpressGeneratorCommand(),
    new TypescriptGeneratorCommand()
]

generators.forEach(generator => {

    let generatorProgram = program.command(generator.comando)
        .description(generator.description)

    if (generator.alias) generatorProgram = generatorProgram.alias(generator.alias)

    generatorProgram
        .option('-f, --file <path>', 'OpenApi3 Json file path')
        .option('-u, --url <path>', 'OpenApi3 Json url path (GET Request)')
        .option('-d, --dist <path>', 'Caminho para a pasta onde será gerado os arquivos')
        .option('-y, --yaml', 'Se o arquivo é do tipo yaml')
        .option('--swg2', 'Se a spec é do tipo swagger2')

    if (generator.flags) generator.flags.forEach(flag => {
        const noop = (value: any) => value;
        generatorProgram = generatorProgram.option(flag.name, flag.description, flag.parser || noop, flag.defaultValue)
    })

    generatorProgram.action(async (...args: any[]) => {
        let json: any;
        if (generatorProgram.file) {
            if (generatorProgram.yaml) {
                json = yamlToJson(readFileSync(generatorProgram.file).toString());
            } else {
                json = require(resolve(process.cwd(), generatorProgram.file));
            }

            // busca caso seja um request get
        } else if (generatorProgram.url) {
            const response = await axios.get(generatorProgram.url);
            json = generatorProgram.yaml ? yamlToJson(response.data) : response.data
        }

        // Converte de swg2 para openApi3
        if (generatorProgram.swg2) {
            json = await new Promise((resolve, reject) => swagger2openapi.convertObj(json, {}, (err: any, options: any) => err ? reject(err) : resolve(options.openapi)));
        }



        CoreMapper.init(json);
        SchemaMapper.init(json);
        PathMapper.init(json);

        generator.action(generatorProgram, ...args)
    });

})


program.on('command:*', function () {
    console.error('Comando inválido: %s\nVerifique --help para a ver a lista de comandos disponíveis.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);