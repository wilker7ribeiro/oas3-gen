import { SchemaObject, ReferenceObject } from "openapi3-ts";
import { DataTypesEnum } from "./data-types-enum";
import { CoreMapper } from "./core-mapper";

export class DataTypesUtil {

    static getSchemaDataType(schemaRef: SchemaObject | ReferenceObject): DataTypesEnum {
        if('$ref' in schemaRef) return this.getSchemaDataType(CoreMapper.instance.getObjectMaybeRef(schemaRef));
        const schema = schemaRef as SchemaObject;
        if(schema.type === 'array'){
            return DataTypesEnum.ARRAY;
        }
        if(schema.type === 'integer'){
            if(schema.format === 'int32') return DataTypesEnum.INTEGER;
            if(schema.format === 'int64') return DataTypesEnum.LONG;
            return DataTypesEnum.INTEGER;
        } else if(schema.type === 'number') {
            if(schema.format === 'float') return DataTypesEnum.FLOAT;
            if(schema.format === 'double') return DataTypesEnum.DOUBLE;
            DataTypesEnum.INTEGER;
        } else if(schema.type === 'string') {
            if(!schema.format) return DataTypesEnum.STRING;
            if(schema.format === 'byte') return DataTypesEnum.BYTE;
            if(schema.format === 'binary') return DataTypesEnum.BINARY;
            if(schema.format === 'date') return DataTypesEnum.DATE;
            if(schema.format === 'date-time') return DataTypesEnum.DATETIME;
            if(schema.format === 'password') return DataTypesEnum.PASSWORD;
            DataTypesEnum.STRING;
        } else if(schema.type === 'boolean') {
            return DataTypesEnum.BOOLEAN
        } else if(schema.type === 'object' || schema.properties) {
            return DataTypesEnum.OBJECT
        } 
        return DataTypesEnum.ANY;
    }


}