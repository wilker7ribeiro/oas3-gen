"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const typescript_entity_templater_1 = require("./typescript-entity-templater");
const schema_mapper_1 = require("../../util/schema-mapper");
var jsBeautify = require('js-beautify').js_beautify;
class TypescriptGeneratorCommand {
    constructor() {
        this.comando = 'typescript';
        this.alias = 'ts';
        this.description = 'Gerarador para Typescript';
        this.flags = [
        // { name: '-l, --deep-level <n>', parser: parseInt,  description: "Define até qual profundidade deve ser gerados os valores dos mocks" },
        // { name: '--no-factory', description: "Define que não sejam gerados factorys" },
        // { name: '--no-entitys', description: "Define que não sejam geradas entitys" },
        ];
    }
    action(options, ...args) {
        let streams = [];
        fs_extra_1.mkdirsSync(path_1.resolve(options.dist, 'entity'));
        console.log("Gerando Entidades...");
        streams = streams.concat(this.gerarEntitys(options));
        console.log("Entidades geradas!");
    }
    gerarEntitys(options) {
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
}
exports.TypescriptGeneratorCommand = TypescriptGeneratorCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsiZ2VuZXJhdG9ycy90eXBlc2NyaXB0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXNFO0FBQ3RFLCtCQUErQjtBQUUvQiwrRUFBMEU7QUFDMUUsNERBQXdEO0FBR3hELElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUE7QUFFbkQ7SUFBQTtRQUNJLFlBQU8sR0FBRyxZQUFZLENBQUE7UUFDdEIsVUFBSyxHQUFHLElBQUksQ0FBQTtRQUNaLGdCQUFXLEdBQUcsMkJBQTJCLENBQUE7UUFDekMsVUFBSyxHQUF3QjtRQUN6QiwwSUFBMEk7UUFDMUksa0ZBQWtGO1FBQ2xGLGlGQUFpRjtTQUNwRixDQUFBO0lBaUNMLENBQUM7SUE5QkcsTUFBTSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDL0IsSUFBSSxPQUFPLEdBQWtCLEVBQUUsQ0FBQTtRQUMvQixxQkFBVSxDQUFDLGNBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUM3QixDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBRXRDLENBQUM7SUFFRCxZQUFZLENBQUMsT0FBWTtRQUNyQixPQUFPLDRCQUFZLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBRTtZQUN2RSxNQUFNLGVBQWUsR0FBRyxJQUFJLHVEQUF5QixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2RSxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELE1BQU0saUJBQWlCLEdBQUcsNEJBQWlCLENBQUMsY0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7WUFFdEYsSUFBSSxjQUFjLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBRTVELGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO2dCQUMvQyxtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixhQUFhLEVBQUUsMEJBQTBCO2dCQUN6Qyx1QkFBdUIsRUFBRSxDQUFDO2FBRTdCLENBQUMsQ0FBQyxDQUFDO1lBQ0osaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDeEIsT0FBTyxpQkFBaUIsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FFSjtBQXpDRCxnRUF5Q0MifQ==