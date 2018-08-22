import { OpenAPIObject, SchemaObject, ReferenceObject } from "openapi3-ts";
import { CoreMapper } from "./core-mapper";
import { DataTypesUtil } from "./data-types-util";
import { DataTypesEnum } from "./data-types-enum";

export class SchemaMapper {

    private static _instance?: SchemaMapper
    openApiObj: OpenAPIObject;

    private constructor(openApiObj: OpenAPIObject) {
        this.openApiObj = openApiObj;
    }

    static get instance(): SchemaMapper {
        if(this._instance) return this._instance;
        throw "SchemaMapper não inicializado"
    }

    static init(openApiObj: OpenAPIObject){
        if(!openApiObj.components) openApiObj.components = {};
        if(!openApiObj.components.schemas) openApiObj.components.schemas = {};
        this._instance = new SchemaMapper(openApiObj);
    }

    getSchemaByName(schemaName: string): SchemaObject{
        return this.openApiObj.components!.schemas![schemaName]
    }

    getFullSchema(schemaRef: SchemaObject | ReferenceObject, followReferences: boolean = true){
        const schema = CoreMapper.instance.getObjectMaybeRef(schemaRef);
        if(schema.allOf && schema.allOf.length){
            schema.allOf.forEach(schemaPaiRef => {
                if(!CoreMapper.isReference(schemaPaiRef) || followReferences){
                    this.extendSchemaProperties(schema, schemaPaiRef)
                }
            })
        }
        return schema;
    }

    getSchemasPai(schemaRef: SchemaObject | ReferenceObject){
        const schema = CoreMapper.instance.getObjectMaybeRef(schemaRef);
        if(!schema.allOf) return [];
        return schema.allOf.map(schemaPaiRef => {
            return {
                name: CoreMapper.getNameFromReference(CoreMapper.isReference(schemaPaiRef)? CoreMapper.getNameFromReference(CoreMapper.getReferemce(schemaPaiRef)): ''),
                isReference: CoreMapper.isReference(schemaPaiRef),
                schema: CoreMapper.instance.getObjectMaybeRef(schemaPaiRef)
            }
           
        });
    }


    getNamesSchemasFilhosUtilizados(schemaPai: SchemaObject | ReferenceObject) {
        var schemasUtilizados: {name: string, schemaRef: SchemaObject | ReferenceObject}[] = [];
        SchemaMapper.instance.schemaPropertiesRefToArray(schemaPai)
        .forEach(({name, schemaRef}) => {
            const refName =  CoreMapper.getNameFromReferenceIfExists(schemaRef);
            if(refName) return schemasUtilizados.push({
                name: refName,
                schemaRef
            })

            const schema = CoreMapper.instance.getObjectMaybeRef(schemaRef);
            if(DataTypesUtil.getSchemaDataType(schema) === DataTypesEnum.ARRAY){
                const typeName = CoreMapper.getNameFromReferenceIfExists(schema.items);
                if(typeName) return schemasUtilizados.push({
                    name: typeName,
                    schemaRef: schema.items!
                })
            }
        })
        return schemasUtilizados;
    }

    extendSchemaProperties(schemaRef: SchemaObject | ReferenceObject, schemaPaiRef: SchemaObject | ReferenceObject): SchemaObject {
        const schema = CoreMapper.instance.getObjectMaybeRef(schemaRef);
        const schemaPai = CoreMapper.instance.getObjectMaybeRef(schemaPaiRef);
        if(!schemaPai.properties) schemaPai.properties = {};
        if(!schema.properties) schema.properties = {};
        Object.keys(schemaPai.properties).forEach(propertyPaiName => {
            schema.properties![propertyPaiName] = schemaPai.properties![propertyPaiName];
        })
        return schema;
    }

    schemaPropertiesRefToArray(schema: SchemaObject):{name: string, schemaRef: SchemaObject | ReferenceObject}[]{
        if(!schema.properties) schema.properties = {};
        return Object.keys(schema.properties).map(schemaName => {
            return {
                name: schemaName,
                schemaRef: schema.properties![schemaName]
            }
        })
    }
    
    getAllSchemasAsArray():{name: string, schema: SchemaObject}[]{
        return Object.keys(this.openApiObj.components!.schemas!).map(schemaName => {
            return {
                name: schemaName,
                schema: this.openApiObj.components!.schemas![schemaName]
            }
        })
    }


}