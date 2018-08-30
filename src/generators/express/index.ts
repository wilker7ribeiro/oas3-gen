import { CommandConfigurator, CommandFlagConfig } from "../../command-configurator";
import { WriteStream, mkdirsSync, createWriteStream } from "fs-extra";
import { resolve } from "path";
import { PathMapper } from "../../util/path-mapper";
import { ExpressServiceTemplater } from "./express-service-templater";
import express from "express";
const glob = require('glob');

var jsBeautify = require('js-beautify').js_beautify

export class ExpressGeneratorCommand implements CommandConfigurator {
    comando = 'express'
    // alias = 'ex'
    description = 'Gerarador para Express'
    flags: CommandFlagConfig[] = [
        { name: '-l, --deep-level <n>', parser: parseInt, description: "Define até qual profundidade deve ser gerados os valores dos mocks" },
        { name: '-s, --serve', description: "Sobe um servidor servindo as api mockadas" },
        { name: '-p, --port <port>', description: "Define a porta para o servidor subido com -s --serve. Default: 4200" },
        { name: '-n, --host <hostname>', description: "Define o host para o servidor subido com -s --serve. Default: localhost" },
        // { name: '--no-services', description: "Define que não sejam geradas services" },
    ]


    action(options: any, ...args: any[]) {
        // let streams: WriteStream[] = []
        mkdirsSync(resolve(options.dist, 'service'));
        // streams = streams.concat(
        console.log("Gerando services e mocks...");
        this.gerarMocks(options)
        console.log("Services e mocks gerados!");
        // );
        if (options.serve) {
            console.log("Servindo api...");
            this.serveExpress(options)
        }



    }

    gerarMocks(options: any) {
        return PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const serviceTemplater = new ExpressServiceTemplater(options, tagDefinition);
            const fileName = serviceTemplater.getFileName();
            const serviceWriteStream = createWriteStream(resolve(options.dist, 'service', fileName))

            let factoryTemplate = serviceTemplater.getServiceTemplate()

            serviceWriteStream.write(jsBeautify(factoryTemplate));
            serviceWriteStream.end();
            return serviceWriteStream
        })
    }

    serveExpress(options: any) {
        const port = options.port || 4200
        const host = options.host || 'localhost'
        var app = express()
        glob(resolve(options.dist, 'service', '*-service.js'), (err: any, filepaths: string[]) => {
            filepaths.forEach(servicePath => {
                require(servicePath)(app)
            });
            app.listen(port, host, () => {
                console.log(`Servidor rodando em ${host}:${port}`)
            })

        })

    }

}