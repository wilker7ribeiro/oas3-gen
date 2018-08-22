import { TagDefinition, PathDefinition, PathMapper, PathDefinitionHTTPMethod } from "../../util/path-mapper";
import { StringUtil } from "../../util/string-util";
import { ParameterObject, SchemaObject, ReferenceObject } from "openapi3-ts";
import { DataTypesUtil } from "../../util/data-types-util";
import { JavascriptUtil } from "../../util/languages/javascript-util";
import { SchemaMapper } from "../../util/schema-mapper";
import { DataTypesEnum } from "../../util/data-types-enum";
import { CoreMapper } from "../../util/core-mapper";
import { TypescriptUtil } from "../../util/languages/typescript-util";

export class TypescriptEntityTemplater {

    constructor(public options: any, public schema: SchemaObject){}

    getFileName(schemaName: string): string {
        return `${schemaName}.ts`
    }

    getEntityTemplate(schemaName: string) {
        if(this.options.inherance) {
            this.schema = SchemaMapper.instance.getFullSchema(this.schema, false);
        } else {
            this.schema = SchemaMapper.instance.getFullSchema(this.schema, true);
        }

        let template = ''
        SchemaMapper.instance.getNamesSchemasFilhosUtilizados(this.schema).forEach(({name}) => {
            template +=`import { ${name} } from './${name}';\n`
        });
        const schmePaiResult = SchemaMapper.instance.getSchemasPai(this.schema)[0];
        if(this.options.inherance && schmePaiResult){
            template +=`import { ${schmePaiResult.name} } from './${schmePaiResult.name}';\n`
            template += `export class ${schemaName.replace(" ", "")} extends ${schmePaiResult.name} {\n`
        } else {
            template += `export class ${schemaName.replace(" ", "")} {\n`
        }
        template += this.getPropriedadesTemplates();
        return template+'\}';
    }


    getPropriedadesTemplates() {
        return SchemaMapper.instance.schemaPropertiesRefToArray(this.schema).map(({name, schemaRef}) => {
            return this.getTemplateForPropriedade(name, schemaRef);
        }).reduce((prev, current) => prev + current, "")
    }



    getTemplateForPropriedade(name: string, propriedade: SchemaObject | ReferenceObject): string {
        // return '';
        const propertyName = StringUtil.dashToCamelCase(name);
        let typeName = TypescriptUtil.getTipagemForSchema(propriedade);
        return `${propertyName}: ${typeName};\n`
    }




}