"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_types_util_1 = require("../data-types-util");
const data_types_enum_1 = require("../data-types-enum");
const schema_mapper_1 = require("../schema-mapper");
const core_mapper_1 = require("../core-mapper");
class JavascriptUtil {
    static getMockedValue(schemaRef, propertyName = "", maxDeepLevel = 3, actualDeepLevel = 0) {
        const propName = propertyName || core_mapper_1.CoreMapper.getNameFromReferenceIfExists(schemaRef);
        const schema = schema_mapper_1.SchemaMapper.instance.getFullSchema(schemaRef);
        const datatype = data_types_util_1.DataTypesUtil.getSchemaDataType(schema);
        switch (datatype) {
            case data_types_enum_1.DataTypesEnum.ARRAY:
                if (actualDeepLevel >= maxDeepLevel)
                    return [];
                return [
                    this.getMockedValue(schema.items)
                ];
            case data_types_enum_1.DataTypesEnum.STRING:
                return propName || "string";
            case data_types_enum_1.DataTypesEnum.PASSWORD:
                return propName || "password";
            case data_types_enum_1.DataTypesEnum.BINARY:
                return 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
            case data_types_enum_1.DataTypesEnum.BOOLEAN:
                return true;
            case data_types_enum_1.DataTypesEnum.LONG:
            case data_types_enum_1.DataTypesEnum.INTEGER:
            case data_types_enum_1.DataTypesEnum.FLOAT:
            case data_types_enum_1.DataTypesEnum.DOUBLE:
            case data_types_enum_1.DataTypesEnum.BYTE:
                return 25;
            case data_types_enum_1.DataTypesEnum.DATE:
            case data_types_enum_1.DataTypesEnum.DATETIME:
                return new Date();
            case data_types_enum_1.DataTypesEnum.OBJECT:
                if (actualDeepLevel >= maxDeepLevel)
                    return null;
                var obj = {};
                schema_mapper_1.SchemaMapper.instance
                    .schemaPropertiesRefToArray(schema)
                    .forEach(({ name, schemaRef }) => {
                    obj[name] = this.getMockedValue(schemaRef, name, maxDeepLevel, actualDeepLevel + 1);
                });
                return obj;
            default:
                return null;
        }
        return null;
    }
    static isNumber(dataType) {
        return [
            data_types_enum_1.DataTypesEnum.BYTE,
            data_types_enum_1.DataTypesEnum.DOUBLE,
            data_types_enum_1.DataTypesEnum.FLOAT,
            data_types_enum_1.DataTypesEnum.INTEGER,
            data_types_enum_1.DataTypesEnum.LONG,
        ].includes(dataType);
    }
    static getInitializationValue(schema) {
        const datatype = data_types_util_1.DataTypesUtil.getSchemaDataType(schema);
        switch (datatype) {
            case data_types_enum_1.DataTypesEnum.ARRAY:
                return [];
            case data_types_enum_1.DataTypesEnum.STRING:
            case data_types_enum_1.DataTypesEnum.PASSWORD:
            case data_types_enum_1.DataTypesEnum.BINARY:
                return '';
            case data_types_enum_1.DataTypesEnum.BOOLEAN:
                return false;
            case data_types_enum_1.DataTypesEnum.LONG:
            case data_types_enum_1.DataTypesEnum.INTEGER:
            case data_types_enum_1.DataTypesEnum.FLOAT:
            case data_types_enum_1.DataTypesEnum.DOUBLE:
            case data_types_enum_1.DataTypesEnum.BYTE:
            case data_types_enum_1.DataTypesEnum.DATE:
            case data_types_enum_1.DataTypesEnum.DATETIME:
            case data_types_enum_1.DataTypesEnum.OBJECT:
            default:
                return null;
        }
    }
    static stringfyValue(value) {
        if (value === undefined || value === null) {
            return 'null';
        }
        if (Array.isArray(value)) {
            return `[ ${value.map(this.stringfyValue).join(', ')} ]`;
        }
        if (value instanceof Date) {
            return `"${value.toISOString()}"`;
        }
        if (typeof value === "object") {
            let string = '{\n';
            for (const propertyName in value) {
                if (value.hasOwnProperty(propertyName)) {
                    const propertyValue = value[propertyName];
                    string += `  ${propertyName}: ${this.stringfyValue(propertyValue)},\n`;
                }
            }
            var result = string.substring(0, string.length - 2) + "\n}";
            ;
            return result;
        }
        if (typeof value === 'string') {
            return `"${value}"`;
        }
        return value;
    }
}
exports.JavascriptUtil = JavascriptUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC11dGlsLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3dpbGtlci9wcm9qZXRvcy9vcGVuQXBpM0pzb25Xcml0ZXJzL3NyYy8iLCJzb3VyY2VzIjpbInV0aWwvbGFuZ3VhZ2VzL2phdmFzY3JpcHQtdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdEQUFtRDtBQUNuRCx3REFBbUQ7QUFDbkQsb0RBQWdEO0FBQ2hELGdEQUE0QztBQUU1QztJQUVJLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBeUMsRUFBRSxlQUF1QixFQUFFLEVBQUUsZUFBdUIsQ0FBQyxFQUFFLGtCQUEwQixDQUFDO1FBQzdJLE1BQU0sUUFBUSxHQUFHLFlBQVksSUFBSSx3QkFBVSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ25GLE1BQU0sTUFBTSxHQUFHLDRCQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM3RCxNQUFNLFFBQVEsR0FBRywrQkFBYSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELFFBQVEsUUFBUSxFQUFFO1lBQ2QsS0FBSywrQkFBYSxDQUFDLEtBQUs7Z0JBQ3BCLElBQUcsZUFBZSxJQUFJLFlBQVk7b0JBQUUsT0FBTyxFQUFFLENBQUE7Z0JBQzdDLE9BQU87b0JBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO2lCQUNyQyxDQUFDO1lBQ04sS0FBSywrQkFBYSxDQUFDLE1BQU07Z0JBQ3JCLE9BQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQTtZQUMvQixLQUFLLCtCQUFhLENBQUMsUUFBUTtnQkFDdkIsT0FBTyxRQUFRLElBQUksVUFBVSxDQUFBO1lBQ2pDLEtBQUssK0JBQWEsQ0FBQyxNQUFNO2dCQUNyQixPQUFPLDZJQUE2SSxDQUFDO1lBQ3pKLEtBQUssK0JBQWEsQ0FBQyxPQUFPO2dCQUN0QixPQUFPLElBQUksQ0FBQztZQUNoQixLQUFL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