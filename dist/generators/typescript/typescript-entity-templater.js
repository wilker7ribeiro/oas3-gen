"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_util_1 = require("../../util/string-util");
const schema_mapper_1 = require("../../util/schema-mapper");
const typescript_util_1 = require("../../util/languages/typescript-util");
class TypescriptEntityTemplater {
    constructor(options, schema) {
        this.options = options;
        this.schema = schema;
    }
    getFileName(schemaName) {
        return `${schemaName}.ts`;
    }
    getEntityTemplate(schemaName) {
        if (this.options.inherance) {
            this.schema = schema_mapper_1.SchemaMapper.instance.getFullSchema(this.schema, false);
        }
        else {
            this.schema = schema_mapper_1.SchemaMapper.instance.getFullSchema(this.schema, true);
        }
        let template = '';
        schema_mapper_1.SchemaMapper.instance.getNamesSchemasFilhosUtilizados(this.schema).forEach(({ name }) => {
            template += `import { ${name} } from './${name}';\n`;
        });
        const schmePaiResult = schema_mapper_1.SchemaMapper.instance.getSchemasPai(this.schema)[0];
        if (this.options.inherance && schmePaiResult) {
            template += `import { ${schmePaiResult.name} } from './${schmePaiResult.name}';\n`;
            template += `export class ${schemaName.replace(" ", "")} extends ${schmePaiResult.name} {\n`;
        }
        else {
            template += `export class ${schemaName.replace(" ", "")} {\n`;
        }
        template += this.getPropriedadesTemplates();
        return template + '\}';
    }
    getPropriedadesTemplates() {
        return schema_mapper_1.SchemaMapper.instance.schemaPropertiesRefToArray(this.schema).map(({ name, schemaRef }) => {
            return this.getTemplateForPropriedade(name, schemaRef);
        }).reduce((prev, current) => prev + current, "");
    }
    getTemplateForPropriedade(name, propriedade) {
        // return '';
        const propertyName = string_util_1.StringUtil.dashToCamelCase(name);
        let typeName = typescript_util_1.TypescriptUtil.getTipagemForSchema(propriedade);
        return `${propertyName}: ${typeName};\n`;
    }
}
exports.TypescriptEntityTemplater = TypescriptEntityTemplater;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC1lbnRpdHktdGVtcGxhdGVyLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3dpbGtlci9wcm9qZXRvcy9vcGVuQXBpM0pzb25Xcml0ZXJzL3NyYy8iLCJzb3VyY2VzIjpbImdlbmVyYXRvcnMvdHlwZXNjcmlwdC90eXBlc2NyaXB0LWVudGl0eS10ZW1wbGF0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx3REFBb0Q7QUFJcEQsNERBQXdEO0FBR3hELDBFQUFzRTtBQUV0RTtJQUVJLFlBQW1CLE9BQVksRUFBUyxNQUFvQjtRQUF6QyxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBYztJQUFFLENBQUM7SUFFL0QsV0FBVyxDQUFDLFVBQWtCO1FBQzFCLE9BQU8sR0FBRyxVQUFVLEtBQUssQ0FBQTtJQUM3QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsVUFBa0I7UUFDaEMsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3pFO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ2pCLDRCQUFZLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxFQUFFLEVBQUU7WUFDbEYsUUFBUSxJQUFHLFlBQVksSUFBSSxjQUFjLElBQUksTUFBTSxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxjQUFjLEdBQUcsNEJBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLGNBQWMsRUFBQztZQUN4QyxRQUFRLElBQUcsWUFBWSxjQUFjLENBQUMsSUFBSSxjQUFjLGNBQWMsQ0FBQyxJQUFJLE1BQU0sQ0FBQTtZQUNqRixRQUFRLElBQUksZ0JBQWdCLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxZQUFZLGNBQWMsQ0FBQyxJQUFJLE1BQU0sQ0FBQTtTQUMvRjthQUFNO1lBQ0gsUUFBUSxJQUFJLGdCQUFnQixVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFBO1NBQ2hFO1FBQ0QsUUFBUSxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQzVDLE9BQU8sUUFBUSxHQUFDLElBQUksQ0FBQztJQUN6QixDQUFDO0lBR0Qsd0JBQXdCO1FBQ3BCLE9BQU8sNEJBQVksQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxFQUFFLEVBQUU7WUFDM0YsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDcEQsQ0FBQztJQUlELHlCQUF5QixDQUFDLElBQVksRUFBRSxXQUEyQztRQUMvRSxhQUFhO1FBQ2IsTUFBTSxZQUFZLEdBQUcsd0JBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsSUFBSSxRQUFRLEdBQUcsZ0NBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMvRCxPQUFPLEdBQUcsWUFBWSxLQUFLLFFBQVEsS0FBSyxDQUFBO0lBQzVDLENBQUM7Q0FLSjtBQWpERCw4REFpREMifQ==