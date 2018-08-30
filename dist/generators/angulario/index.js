"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_mapper_1 = require("../../util/schema-mapper");
const fs_extra_1 = require("fs-extra");
const angular_io_service_templater_1 = require("./angular-io-service-templater");
const path_mapper_1 = require("../../util/path-mapper");
const typescript_entity_templater_1 = require("../typescript/typescript-entity-templater");
const path_1 = require("path");
var jsBeautify = require('js-beautify').js_beautify;
class AngularIoGeneratorCommand {
    constructor() {
        this.comando = 'angular';
        this.alias = 'ng';
        this.description = 'Gerarador para AngularIo (v2+)';
        this.flags = [
            { name: '-i --inherance', description: "Define que as entitys sigam o padrão de herança" },
            { name: '--no-entity', description: "Define que não sejam gerados entitys" },
            { name: '--no-services', description: "Define que não sejam geradas services" },
        ];
    }
    action(options, ...args) {
        let streams = [];
        if (options.entity) {
            fs_extra_1.mkdirsSync(path_1.resolve(options.dist, 'entity'));
            console.log("Gerando entidades...");
            streams = streams.concat(this.gerarEntity(options));
            console.log("Entidades geradas...");
        }
        if (options.services) {
            fs_extra_1.mkdirsSync(path_1.resolve(options.dist, 'service'));
            console.log("Gerando services...");
            streams = streams.concat(this.gerarSevices(options));
            console.log("services geradas...");
        }
    }
    gerarEntity(options) {
        return schema_mapper_1.SchemaMapper.instance.getAllSchemasAsArray().map(({ name, schema }) => {
            const entityTemplater = new typescript_entity_templater_1.TypescriptEntityTemplater(options, schema);
            const fileName = entityTemplater.getFileName(name);
            const entityWriteStream = fs_extra_1.createWriteStream(path_1.resolve(options.dist, 'entity', fileName));
            let entityTemplate = entityTemplater.getEntityTemplate(name);
            entityWriteStream.write(jsBeautify(entityTemplate, {
                "preserve_newlines": true,
                "brace_style": "collapse-preserve-inline",
                "max_preserve_newlines": 2
            }));
            entityWriteStream.end();
            return entityWriteStream;
        });
    }
    gerarSevices(options) {
        return path_mapper_1.PathMapper.instance.tagsDefinition.map(tagDefinition => {
            const serviceTemplater = new angular_io_service_templater_1.AngularIoServiceTemplater(tagDefinition);
            const fileName = serviceTemplater.getFileName();
            const serviceWriteStream = fs_extra_1.createWriteStream(path_1.resolve(options.dist, 'service', fileName));
            let entityTemplate = serviceTemplater.getServiceTemplate();
            serviceWriteStream.write(jsBeautify(entityTemplate, {
                "preserve_newlines": true,
                "brace_style": "collapse-preserve-inline",
                "max_preserve_newlines": 2
            }));
            serviceWriteStream.end();
            return serviceWriteStream;
        });
    }
}
exports.AngularIoGeneratorCommand = AngularIoGeneratorCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsiZ2VuZXJhdG9ycy9hbmd1bGFyaW8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0REFBd0Q7QUFDeEQsdUNBQXNFO0FBRXRFLGlGQUEyRTtBQUMzRSx3REFBb0Q7QUFDcEQsMkZBQXNGO0FBQ3RGLCtCQUErQjtBQUMvQixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFBO0FBRW5EO0lBQUE7UUFDSSxZQUFPLEdBQUcsU0FBUyxDQUFBO1FBQ25CLFVBQUssR0FBRyxJQUFJLENBQUE7UUFDWixnQkFBVyxHQUFHLGdDQUFnQyxDQUFBO1FBQzlDLFVBQUssR0FBd0I7WUFDekIsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGlEQUFpRCxFQUFFO1lBQzFGLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsc0NBQXNDLEVBQUU7WUFDNUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSx1Q0FBdUMsRUFBRTtTQUNsRixDQUFBO0lBNERMLENBQUM7SUF6REcsTUFBTSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDL0IsSUFBSSxPQUFPLEdBQWtCLEVBQUUsQ0FBQTtRQUMvQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDaEIscUJBQVUsQ0FBQyxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNwQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FDNUIsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUN2QztRQUVELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNsQixxQkFBVSxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ25DLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUM3QixDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZO1FBQ3BCLE9BQU8sNEJBQVksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFFO1lBQ3ZFLE1BQU0sZUFBZSxHQUFHLElBQUksdURBQXlCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkQsTUFBTSxpQkFBaUIsR0FBRyw0QkFBaUIsQ0FBQyxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUV0RixJQUFJLGNBQWMsR0FBRyxlQUFlLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFNUQsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUU7Z0JBQy9DLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLGFBQWEsRUFBRSwwQkFBMEI7Z0JBQ3pDLHVCQUF1QixFQUFFLENBQUM7YUFDN0IsQ0FBQyxDQUFDLENBQUM7WUFDSixpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN4QixPQUFPLGlCQUFpQixDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFZO1FBQ3JCLE9BQU8sd0JBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUMxRCxNQUFNLGdCQUFnQixHQUFHLElBQUksd0RBQXlCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdEUsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDaEQsTUFBTSxrQkFBa0IsR0FBRyw0QkFBaUIsQ0FBQyxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUV4RixJQUFJLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO1lBRTFELGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO2dCQUNoRCxtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixhQUFhLEVBQUUsMEJBQTBCO2dCQUN6Qyx1QkFBdUIsRUFBRSxDQUFDO2FBQzdCLENBQUMsQ0FBQyxDQUFDO1lBQ0osa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDekIsT0FBTyxrQkFBa0IsQ0FBQTtRQUM3QixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FFSjtBQXBFRCw4REFvRUMifQ==