import { SchemaObject, ReferenceObject } from "openapi3-ts";
import { DataTypesUtil } from "../data-types-util";
import { DataTypesEnum } from "../data-types-enum";
import { SchemaMapper } from "../schema-mapper";
import { CoreMapper } from "../core-mapper";

export class JavascriptUtil {

    static getMockedValue(schemaRef: SchemaObject | ReferenceObject, propertyName: string = "", maxDeepLevel: number = 3, actualDeepLevel: number = 0): any {
        const propName = propertyName || CoreMapper.getNameFromReferenceIfExists(schemaRef)
        const schema = SchemaMapper.instance.getFullSchema(schemaRef)
        const datatype = DataTypesUtil.getSchemaDataType(schema);
        switch (datatype) {
            case DataTypesEnum.ARRAY:
                if(actualDeepLevel >= maxDeepLevel) return []
                return [
                    this.getMockedValue(schema.items!)
                ];
            case DataTypesEnum.STRING:
                return propName || "string"
            case DataTypesEnum.PASSWORD:
                return propName || "password"
            case DataTypesEnum.BINARY:
                return 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
            case DataTypesEnum.BOOLEAN:
                return true;
            case DataTypesEnum.LONG:
            case DataTypesEnum.INTEGER:
            case DataTypesEnum.FLOAT:
            case DataTypesEnum.DOUBLE:
            case DataTypesEnum.BYTE:
                return 25
            case DataTypesEnum.DATE:
            case DataTypesEnum.DATETIME:
                return new Date();
            case DataTypesEnum.OBJECT:
            if(actualDeepLevel >= maxDeepLevel) return null
                var obj:any = {}
                SchemaMapper.instance
                    .schemaPropertiesRefToArray(schema)
                    .forEach(({ name, schemaRef }) => {
                        obj[name] = this.getMockedValue(schemaRef, name, maxDeepLevel, actualDeepLevel + 1);
                    })
                return obj;
            default:
                return null;
        }

        return null
    }


    static isNumber(dataType: DataTypesEnum): boolean {
        return [
            DataTypesEnum.BYTE,
            DataTypesEnum.DOUBLE,
            DataTypesEnum.FLOAT,
            DataTypesEnum.INTEGER,
            DataTypesEnum.LONG,
        ].includes(dataType)
    }

    static getInitializationValue(schema: SchemaObject ): any {
        const datatype = DataTypesUtil.getSchemaDataType(schema);
        switch (datatype) {
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
        if (value instanceof Date) {
            return `"${value.toISOString()}"`
        }
        if (typeof value === "object") {
            let string = '{\n'
            for (const propertyName in value) {
                if (value.hasOwnProperty(propertyName)) {
                    const propertyValue = value[propertyName];
                    string += `  ${propertyName}: ${this.stringfyValue(propertyValue)},\n`
                }
            }
            var result = string.substring(0, string.length - 2) + "\n}";;
            return result;
        }
        if (typeof value === 'string') {
            return `"${value}"`
        }
        return value;
    }
}