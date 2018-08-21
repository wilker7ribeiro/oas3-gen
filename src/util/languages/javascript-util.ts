import { SchemaObject } from "openapi3-ts";
import { DataTypesUtil } from "../data-types-util";
import { DataTypesEnum } from "../data-types-enum";

export class JavascriptUtil {

    static getInitializationValue(schema: SchemaObject){
        const datatype = DataTypesUtil.getSchemaDataType(schema);
        switch(datatype) {
            case DataTypesEnum.ARRAY:
                return [];
            case DataTypesEnum.STRING:
            case DataTypesEnum.PASSWORD:
            case DataTypesEnum.BINARY:
                return '';
            case DataTypesEnum.BOOLEAN:
                return false;
            case DataTypesEnum.LONG:
            case DataTypesEnum.INTEGER:
            case DataTypesEnum.FLOAT:
            case DataTypesEnum.DOUBLE:
            case DataTypesEnum.BYTE:
            case DataTypesEnum.DATE:
            case DataTypesEnum.DATETIME:
            case DataTypesEnum.OBJECT:
            default:
                return null;
        }
    }

    static stringfyValue(value: any): string {
        if (value === undefined || value === null) {
            return 'null'
        }
        if (Array.isArray(value)) {
            return `[ ${value.map(this.stringfyValue).join(', ')} ]`
        }
        if(value instanceof Date){
            return `"${value.toISOString()}"`
        }
        if(typeof value === "object"){
            let string = '{\n'
            for (const propertyName in value) {
                if (value.hasOwnProperty(propertyName)) {
                    const propertyValue = value[propertyName];
                    string+= `  ${propertyName}: ${this.stringfyValue(propertyValue)},\n`
                }
            }
            var result = string.substring(0, string.length -2) + "\n}";;
            return result;
        }
        if(typeof value === 'string'){
            return `"${value}"`
        }
        return value;
    }
}