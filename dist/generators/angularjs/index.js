"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const angular_js_factory_templater_1 = require("./angular-js-factory-templater");
const schema_mapper_1 = require("../../util/schema-mapper");
const fs_extra_1 = require("fs-extra");
const angular_js_service_templater_1 = require("./angular-js-service-templater");
const path_mapper_1 = require("../../util/path-mapper");
var jsBeautify = require('js-beautify').js_beautify;
class AngularJsGeneratorCommand {
    constructor() {
        this.comando = 'angularjs';
        this.alias = 'ngjs';
        this.description = 'Gerarador para AngularJs';
        this.flags = [
            { name: '-i --inherance', description: "Define que as factorys sigam o padrão de herança" },
            { name: '--no-factory', description: "Define que não sejam gerados factorys" },
            { name: '--no-services', description: "Define que não sejam geradas services" },
        ];
    }
    action(options, ...args) {
        let streams = [];
        if (options.factory) {
            console.log("Gerando factorys...");
            fs_extra_1.mkdirsSync(path.resolve(options.dist, 'factory'));
            streams = streams.concat(this.gerarFactory(options));
            console.log("Factorys geradas!");
        }
        if (options.services) {
            console.log("Gerando services...");
            fs_extra_1.mkdirsSync(path.resolve(options.dist, 'service'));
            streams = streams.concat(this.gerarSevices(options));
            console.log("Services geradas!");
        }
    }
    gerarFactory(options) {
        return schema_mapper_1.SchemaMapper.instance.getAllSchemasAsArray().map(({ name, schema }) => {
            const factoryTemplater = new angular_js_factory_templater_1.AngularJsFactoryTemplater(schema);
            const fileName = factoryTemplater.getFileName(name);
            const factoryWriteStream = fs_extra_1.createWriteStream(path.resolve(options.dist, 'factory', fileName));
            let factoryTemplate;
            if (options.inherance) {
                factoryTemplate = factoryTemplater.getFactoryExtendingTemplate(name);
            }
            else {
                factoryTemplate = factoryTemplater.getFactoryTemplate(name);
            }
            factoryWriteStream.write(jsBeautify(factoryTemplate));
            factoryWriteStream.end();
            return factoryWriteStream;
        });
    }
    gerarSevices(options) {
        return path_mapper_1.PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const serviceTemplater = new angular_js_service_templater_1.AngularJsServiceTemplater(tagDefinition);
            const fileName = serviceTemplater.getFileName();
            const serviceWriteStream = fs_extra_1.createWriteStream(path.resolve(options.dist, 'service', fileName));
            let factoryTemplate = serviceTemplater.getServiceTemplate();
            serviceWriteStream.write(jsBeautify(factoryTemplate));
            serviceWriteStream.end();
            return serviceWriteStream;
        });
    }
}
exports.AngularJsGeneratorCommand = AngularJsGeneratorCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsiZ2VuZXJhdG9ycy9hbmd1bGFyanMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsMkNBQTZCO0FBRTdCLGlGQUEyRTtBQUMzRSw0REFBd0Q7QUFDeEQsdUNBQXNFO0FBR3RFLGlGQUEyRTtBQUMzRSx3REFBb0Q7QUFDcEQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtBQUVuRDtJQUFBO1FBQ0ksWUFBTyxHQUFHLFdBQVcsQ0FBQTtRQUNyQixVQUFLLEdBQUcsTUFBTSxDQUFBO1FBQ2QsZ0JBQVcsR0FBRywwQkFBMEIsQ0FBQTtRQUN4QyxVQUFLLEdBQXdCO1lBQ3pCLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxrREFBa0QsRUFBRTtZQUMzRixFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLHVDQUF1QyxFQUFFO1lBQzlFLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsdUNBQXVDLEVBQUU7U0FDbEYsQ0FBQTtJQXdETCxDQUFDO0lBckRHLE1BQU0sQ0FBQyxPQUFZLEVBQUUsR0FBRyxJQUFXO1FBQy9CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7UUFDL0IsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNuQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUM3QixDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNuQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUM3QixDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFZO1FBQ3JCLE9BQU8sNEJBQVksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO1lBQ3pFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx3REFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvRCxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsTUFBTSxrQkFBa0IsR0FBRyw0QkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7WUFDN0YsSUFBSSxlQUFlLENBQUE7WUFDbkIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNuQixlQUFlLEdBQUcsZ0JBQWdCLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDdkU7aUJBQU07Z0JBQ0gsZUFBZSxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO2FBQzlEO1lBRUQsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3RELGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLE9BQU8sa0JBQWtCLENBQUE7UUFDN0IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsWUFBWSxDQUFDLE9BQVk7UUFDckIsT0FBTyx3QkFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzFELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx3REFBeUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0RSxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoRCxNQUFNLGtCQUFrQixHQUFHLDRCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUU3RixJQUFJLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO1lBRTNELGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN0RCxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN6QixPQUFPLGtCQUFrQixDQUFBO1FBQzdCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUVKO0FBaEVELDhEQWdFQyJ9