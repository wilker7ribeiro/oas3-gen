import { SchemaObject, ReferenceObject } from "openapi3-ts";
import { DataTypesUtil } from "../data-types-util";
import { DataTypesEnum } from "../data-types-enum";
import { CoreMapper } from "../core-mapper";

export class TypescriptUtil {

    static isPrimitiveTipagem(nomeTipagem: string): boolean{
       return  ['any', 'string', 'boolean', 'number', 'Date'].includes(nomeTipagem);
    }
    static getTipagemForSchema(schemaRef: SchemaObject | ReferenceObject| undefined): string {
        if(!schemaRef) return 'any'
        let typeName = CoreMapper.getNameFromReferenceIfExists(schemaRef);
        if(typeName) {
            return typeName
        }
        const datatype = DataTypesUtil.getSchemaDataType(schemaRef)
        switch (datatype) {
            case DataTypesEnum.ARRAY:
                const schema = CoreMapper.instance.getObjectMaybeRef(schemaRef)
                return TypescriptUtil.getTipagemForSchema(schema.items!)+"[]";
            case DataTypesEnum.STRING:
            case DataTypesEnum.PASSWORD:
            case DataTypesEnum.BINARY:
                return "string"
            case DataTypesEnum.BOOLEAN:
                return "boolean";
            case DataTypesEnum.LONG:
            case DataTypesEnum.INTEGER:
            case DataTypesEnum.FLOAT:
            case DataTypesEnum.DOUBLE:
            case DataTypesEnum.BYTE:
                return "number"
            case DataTypesEnum.DATE:
            case DataTypesEnum.DATETIME:
                return "Date";
            case DataTypesEnum.OBJECT:
            default:
                return "any"
        }
    }
}