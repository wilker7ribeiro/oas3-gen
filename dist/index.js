#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const angularjs_1 = require("./generators/angularjs");
const schema_mapper_1 = require("./util/schema-mapper");
const path_mapper_1 = require("./util/path-mapper");
const core_mapper_1 = require("./util/core-mapper");
const express_1 = require("./generators/express");
const typescript_1 = require("./generators/typescript");
const angulario_1 = require("./generators/angulario");
const axios_1 = __importDefault(require("axios"));
const yamljs_1 = require("yamljs");
const fs_1 = require("fs");
// console.log(process.argv)
const swagger2openapi = require('swagger2openapi');
const oasValidator = require('oas-validator');
const program = require("commander");
program.version('0.0.1');
const generators = [
    new angulario_1.AngularIoGeneratorCommand(),
    new angularjs_1.AngularJsGeneratorCommand(),
    new express_1.ExpressGeneratorCommand(),
    new typescript_1.TypescriptGeneratorCommand()
];
generators.forEach(generator => {
    let generatorProgram = program.command(generator.comando)
        .description(generator.description);
    if (generator.alias)
        generatorProgram = generatorProgram.alias(generator.alias);
    generatorProgram
        .option('-f, --file <path>', 'OpenApi3 Json file path')
        .option('-u, --url <path>', 'OpenApi3 Json url path (GET Request)')
        .option('-d, --dist <path>', 'Caminho para a pasta onde será gerado os arquivos. Default: "./oas2-generated"')
        .option('-y, --yaml', 'Se o arquivo é do tipo yaml')
        .option('--swg2', 'Se a spec é do tipo swagger2');
    if (generator.flags)
        generator.flags.forEach(flag => {
            const noop = (value) => value;
            generatorProgram = generatorProgram.option(flag.name, flag.description, flag.parser || noop, flag.defaultValue);
        });
    generatorProgram.action(async (...args) => {
        let json;
        console.log();
        // export to defoult options setter
        if (!generatorProgram.dist)
            generatorProgram.dist = './oas2-generated';
        // console.log(generatorProgram)
        // export to options validator
        if (!generatorProgram.file && !generatorProgram.url) {
            return console.error('É obrigatório passar ou "--file <path>" ou "--url <path>"');
        }
        // export to file getter
        if (generatorProgram.file) {
            console.log("Recuperando arquivo...");
            const filePath = path_1.resolve(process.cwd(), generatorProgram.file);
            if (!fs_1.existsSync(filePath))
                return console.error('Arquivo não encontrado:', generatorProgram.file);
            if (generatorProgram.yaml) {
                var string = fs_1.readFileSync(filePath).toString();
                console.log("Convertendo arquivo de Yaml para JSON...");
                json = yamljs_1.parse(string);
            }
            else {
                json = require(filePath);
            }
            // export to url getter
            // busca caso seja um request get
        }
        else if (generatorProgram.url) {
            console.log(`Buscando arquivo em GET - ${generatorProgram.url}`);
            try {
                const response = await axios_1.default.get(generatorProgram.url);
                if (generatorProgram.yaml) {
                    console.log("Convertendo arquivo de Yaml para JSON...");
                    json = yamljs_1.parse(response.data);
                }
                else {
                    json = response.data;
                }
                json = typeof json === 'object' ? json : JSON.parse(json);
            }
            catch (err) {
                return console.error(`Erro ao buscar arquivo em GET - ${generatorProgram.url}:\n${err.name}: ${err.message}`);
            }
        }
        // export to swg2 converter
        // Converte de swg2 para openApi3
        if (generatorProgram.swg2) {
            console.log("Convertendo arquivo de swagger2 para open-api-3...");
            json = await new Promise((resolve, reject) => swagger2openapi.convertObj(json, {}, (err, options) => err ? reject(err) : resolve(options.openapi)));
        }
        // export to validation
        try {
            console.log("Validando json...");
            const validationResult = oasValidator.validateSync(json, {});
        }
        catch (err) {
            return console.error(`Erro ao validar o arquivo:\n${err.name}: ${err.message}`);
        }
        core_mapper_1.CoreMapper.init(json);
        schema_mapper_1.SchemaMapper.init(json);
        path_mapper_1.PathMapper.init(json);
        console.log("Executando...");
        generator.action(generatorProgram, ...args);
        console.log("Sucesso!");
    });
});
program.on('command:*', function () {
    console.error('Comando inválido: %s\nVerifique --help para a ver a lista de comandos disponíveis.', program.args.join(' '));
    process.exit(1);
});
program.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0JBQStCO0FBRS9CLHNEQUFtRTtBQUduRSx3REFBb0Q7QUFDcEQsb0RBQWdEO0FBQ2hELG9EQUFnRDtBQUNoRCxrREFBK0Q7QUFDL0Qsd0RBQXFFO0FBQ3JFLHNEQUFtRTtBQUNuRSxrREFBeUI7QUFDekIsbUNBQTZDO0FBQzdDLDJCQUE4QztBQUM5Qyw0QkFBNEI7QUFDNUIsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbkQsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sT0FBTyxHQUFzQixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFeEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUl4QixNQUFNLFVBQVUsR0FBMEI7SUFDdEMsSUFBSSxxQ0FBeUIsRUFBRTtJQUMvQixJQUFJLHFDQUF5QixFQUFFO0lBQy9CLElBQUksaUNBQXVCLEVBQUU7SUFDN0IsSUFBSSx1Q0FBMEIsRUFBRTtDQUNuQyxDQUFBO0FBRUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUUzQixJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUNwRCxXQUFXLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRXZDLElBQUksU0FBUyxDQUFDLEtBQUs7UUFBRSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRS9FLGdCQUFnQjtTQUNYLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSx5QkFBeUIsQ0FBQztTQUN0RCxN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