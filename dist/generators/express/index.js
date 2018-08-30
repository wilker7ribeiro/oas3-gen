"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const path_mapper_1 = require("../../util/path-mapper");
const express_service_templater_1 = require("./express-service-templater");
const express_1 = __importDefault(require("express"));
const glob = require('glob');
var jsBeautify = require('js-beautify').js_beautify;
class ExpressGeneratorCommand {
    constructor() {
        this.comando = 'express';
        // alias = 'ex'
        this.description = 'Gerarador para Express';
        this.flags = [
            { name: '-l, --deep-level <n>', parser: parseInt, description: "Define até qual profundidade deve ser gerados os valores dos mocks" },
            { name: '-s, --serve', description: "Sobe um servidor servindo as api mockadas" },
            { name: '-p, --port <port>', description: "Define a porta para o servidor subido com -s --serve. Default: 4200" },
            { name: '-n, --host <hostname>', description: "Define o host para o servidor subido com -s --serve. Default: localhost" },
        ];
    }
    action(options, ...args) {
        // let streams: WriteStream[] = []
        fs_extra_1.mkdirsSync(path_1.resolve(options.dist, 'service'));
        // streams = streams.concat(
        console.log("Gerando services e mocks...");
        this.gerarMocks(options);
        console.log("Services e mocks gerados!");
        // );
        if (options.serve) {
            console.log("Servindo api...");
            this.serveExpress(options);
        }
    }
    gerarMocks(options) {
        return path_mapper_1.PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const serviceTemplater = new express_service_templater_1.ExpressServiceTemplater(options, tagDefinition);
            const fileName = serviceTemplater.getFileName();
            const serviceWriteStream = fs_extra_1.createWriteStream(path_1.resolve(options.dist, 'service', fileName));
            let factoryTemplate = serviceTemplater.getServiceTemplate();
            serviceWriteStream.write(jsBeautify(factoryTemplate));
            serviceWriteStream.end();
            return serviceWriteStream;
        });
    }
    serveExpress(options) {
        const port = options.port || 4200;
        const host = options.host || 'localhost';
        var app = express_1.default();
        glob(path_1.resolve(options.dist, 'service', '*-service.js'), (err, filepaths) => {
            filepaths.forEach(servicePath => {
                require(servicePath)(app);
            });
            app.listen(port, host, () => {
                console.log(`Servidor rodando em ${host}:${port}`);
            });
        });
    }
}
exports.ExpressGeneratorCommand = ExpressGeneratorCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsiZ2VuZXJhdG9ycy9leHByZXNzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsdUNBQXNFO0FBQ3RFLCtCQUErQjtBQUMvQix3REFBb0Q7QUFDcEQsMkVBQXNFO0FBQ3RFLHNEQUE4QjtBQUM5QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtBQUVuRDtJQUFBO1FBQ0ksWUFBTyxHQUFHLFNBQVMsQ0FBQTtRQUNuQixlQUFlO1FBQ2YsZ0JBQVcsR0FBRyx3QkFBd0IsQ0FBQTtRQUN0QyxVQUFLLEdBQXdCO1lBQ3pCLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLG9FQUFvRSxFQUFFO1lBQ3JJLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsMkNBQTJDLEVBQUU7WUFDakYsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLHFFQUFxRSxFQUFFO1lBQ2pILEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFdBQVcsRUFBRSx5RUFBeUUsRUFBRTtTQUU1SCxDQUFBO0lBa0RMLENBQUM7SUEvQ0csTUFBTSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDL0Isa0NBQWtDO1FBQ2xDLHFCQUFVLENBQUMsY0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM3Qyw0QkFBNEI7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3pDLEtBQUs7UUFDTCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUM3QjtJQUlMLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBWTtRQUNuQixPQUFPLHdCQUFVLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDMUQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1EQUF1QixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM3RSxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoRCxNQUFNLGtCQUFrQixHQUFHLDRCQUFpQixDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBRXhGLElBQUksZUFBZSxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLENBQUE7WUFFM0Qsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3RELGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sa0JBQWtCLENBQUE7UUFDN0IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsWUFBWSxDQUFDLE9BQVk7UUFDckIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUE7UUFDakMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUE7UUFDeEMsSUFBSSxHQUFHLEdBQUcsaUJBQU8sRUFBRSxDQUFBO1FBQ25CLElBQUksQ0FBQyxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFRLEVBQUUsU0FBbUIsRUFBRSxFQUFFO1lBQ3JGLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzVCLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM3QixDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQ3RELENBQUMsQ0FBQyxDQUFBO1FBRU4sQ0FBQyxDQUFDLENBQUE7SUFFTixDQUFDO0NBRUo7QUE1REQsMERBNERDIn0=