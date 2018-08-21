#!/usr/bin/env node
import { resolve } from 'path';
import { OpenAPIObject } from 'openapi3-ts'
import { AngularJsGeneratorCommand } from './generators/angularjs';
import * as glob from "glob";
import { CommandConfigurator } from './command-configurator';
import * as commander from "commander";
import { SchemaMapper } from './util/schema-mapper';
import { PathMapper } from './util/path-mapper';
import { CoreMapper } from './util/core-mapper';
// console.log(process.argv)

const program: commander.Command = require("commander");

program.version('0.0.1')



const generators: CommandConfigurator[] = [
    new AngularJsGeneratorCommand()
]

const noop = (value: any) => value;
generators.forEach(generator => {

    let generatorProgram = program.command(generator.comando)
        .description(generator.description)

    if (generator.alias) generatorProgram = generatorProgram.alias(generator.alias)

    generatorProgram
        .option('-f, --file <path>', 'OpenApi3 Json filepath')
        .option('-d, --dist <path>', 'Caminho para a pasta onde será gerado os arquivos')

    if (generator.flags) generator.flags.forEach(flag => {
        const noop = (value: any) => value;
        generatorProgram = generatorProgram.option(flag.name, flag.description, flag.parser || noop, flag.defaultValue)
    })

    generatorProgram.action((...args: any[]) => {
        const openApi3Json: OpenAPIObject = require(resolve(process.cwd(), generatorProgram.file));
        CoreMapper.init(openApi3Json);
        SchemaMapper.init(openApi3Json);
        PathMapper.init(openApi3Json);
        generator.action(generatorProgram, ...args)
    });

})


program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);