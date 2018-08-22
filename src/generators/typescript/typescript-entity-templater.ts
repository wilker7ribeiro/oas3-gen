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

    constructor(public options: any){}
    getFileName(schemaName: string, schema: SchemaObject): string {
        return `${schemaName}.ts`
    }

    getEntityTemplate(schemaName: string, schema: SchemaObject) {
        let template = ''
        this.getNamesSchemasUtilizados(schema).forEach(schemaName => {
            template +=`import { ${schemaName} } from './${schemaName}';\n\n`
        });
        template += `export class ${schemaName.replace(" ", "")} {\n`
        template += this.getPropriedadesTemplates(schema);
        return template+'\}';
    }


    getPropriedadesTemplates(schemaPai: SchemaObject) {
        return SchemaMapper.instance.schemaPropertiesRefToArray(schemaPai).map(({name, schemaRef}) => {
            return this.getTemplateForPropriedade(name, schemaRef);
        }).reduce((prev, current) => prev + current, "")
    }

    getNamesSchemasUtilizados(schemaPai: SchemaObject): string[] {
        var schemasUtilizados: string[] = [];
        SchemaMapper.instance.schemaPropertiesRefToArray(schemaPai)
        .forEach(({name, schemaRef}) => {
            const refName =  CoreMapper.getNameFromReferenceIfExists(schemaRef);
            if(refName) return schemasUtilizados.push(refName)

            const schema = CoreMapper.instance.getObjectMaybeRef(schemaRef);
            if(DataTypesUtil.getSchemaDataType(schema) === DataTypesEnum.ARRAY){
                const typeName = CoreMapper.getNameFromReferenceIfExists(schema.items);
                if(typeName) return schemasUtilizados.push(typeName)
            }
        })
        return schemasUtilizados;
    }

    getTemplateForPropriedade(name: string, propriedade: SchemaObject | ReferenceObject): string {
        // return '';
        const propertyName = StringUtil.dashToCamelCase(name);
        let typeName = TypescriptUtil.getTipagemForSchema(propriedade);
        return `${propertyName}: ${typeName};\n`
    }




}