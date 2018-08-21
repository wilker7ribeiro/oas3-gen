import { OpenAPIObject, SchemaObject, ReferenceObject } from "openapi3-ts";
import { CoreMapper } from "./core-mapper";

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

    getFullSchema(schemaRef: SchemaObject | ReferenceObject, followReferences: boolean){
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

    schemaPropertiesToArray(schema: SchemaObject):{name: string, schema: SchemaObject}[]{
        if(!schema.properties) schema.properties = {};
        return Object.keys(schema.properties).map(schemaName => {
            return {
                name: schemaName,
                schema: schema.properties![schemaName]
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