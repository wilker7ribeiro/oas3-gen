"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_types_enum_1 = require("./data-types-enum");
const core_mapper_1 = require("./core-mapper");
class DataTypesUtil {
    static getSchemaDataType(schemaRef) {
        if ('$ref' in schemaRef)
            return this.getSchemaDataType(core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaRef));
        const schema = schemaRef;
        if (schema.type === 'array') {
            return data_types_enum_1.DataTypesEnum.ARRAY;
        }
        if (schema.type === 'integer') {
            if (schema.format === 'int32')
                return data_types_enum_1.DataTypesEnum.INTEGER;
            if (schema.format === 'int64')
                return data_types_enum_1.DataTypesEnum.LONG;
            return data_types_enum_1.DataTypesEnum.INTEGER;
        }
        else if (schema.type === 'number') {
            if (schema.format === 'float')
                return data_types_enum_1.DataTypesEnum.FLOAT;
            if (schema.format === 'double')
                return data_types_enum_1.DataTypesEnum.DOUBLE;
            data_types_enum_1.DataTypesEnum.INTEGER;
        }
        else if (schema.type === 'string') {
            if (!schema.format)
                return data_types_enum_1.DataTypesEnum.STRING;
            if (schema.format === 'byte')
                return data_types_enum_1.DataTypesEnum.BYTE;
            if (schema.format === 'binary')
                return data_types_enum_1.DataTypesEnum.BINARY;
            if (schema.format === 'date')
                return data_types_enum_1.DataTypesEnum.DATE;
            if (schema.format === 'date-time')
                return data_types_enum_1.DataTypesEnum.DATETIME;
            if (schema.format === 'password')
                return data_types_enum_1.DataTypesEnum.PASSWORD;
            data_types_enum_1.DataTypesEnum.STRING;
        }
        else if (schema.type === 'boolean') {
            return data_types_enum_1.DataTypesEnum.BOOLEAN;
        }
        else if (schema.type === 'object' || schema.properties) {
            return data_types_enum_1.DataTypesEnum.OBJECT;
        }
        return data_types_enum_1.DataTypesEnum.ANY;
    }
}
exports.DataTypesUtil = DataTypesUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10eXBlcy11dGlsLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3dpbGtlci9wcm9qZXRvcy9vcGVuQXBpM0pzb25Xcml0ZXJzL3NyYy8iLCJzb3VyY2VzIjpbInV0aWwvZGF0YS10eXBlcy11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQWtEO0FBQ2xELCtDQUEyQztBQUUzQztJQUVJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUF5QztRQUM5RCxJQUFHLE1BQU0sSUFBSSxTQUFTO1lBQUUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsd0JBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4RyxNQUFNLE1BQU0sR0FBRyxTQUF5QixDQUFDO1FBQ3pDLElBQUcsTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUM7WUFDdkIsT0FBTywrQkFBYSxDQUFDLEtBQUssQ0FBQztTQUM5QjtRQUNELElBQUcsTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUM7WUFDekIsSUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLE9BQU87Z0JBQUUsT0FBTywrQkFBYSxDQUFDLE9BQU8sQ0FBQztZQUMzRCxJQUFHLE1BQU0sQ0FBQyxNQUFNLEtBQUssT0FBTztnQkFBRSxPQUFPLCtCQUFhLENBQUMsSUFBSSxDQUFDO1lBQ3hELE9BQU8sK0JBQWEsQ0FBQyxPQUFPLENBQUM7U0FDaEM7YUFBTSxJQUFHLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQ2hDLElBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxPQUFPO2dCQUFFLE9BQU8sK0JBQWEsQ0FBQyxLQUFLLENBQUM7WUFDekQsSUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLFFBQVE7Z0JBQUUsT0FBTywrQkFBYSxDQUFDLE1BQU0sQ0FBQztZQUMzRCwrQkFBYSxDQUFDLE9BQU8sQ0FBQztTQUN6QjthQUFNLElBQUcsTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDaEMsSUFBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNO2dCQUFFLE9BQU8sK0JBQWEsQ0FBQyxNQUFNLENBQUM7WUFDL0MsSUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU07Z0JBQUUsT0FBTywrQkFBYSxDQUFDLElBQUksQ0FBQztZQUN2RCxJQUFHLE1BQU0sQ0FBQyxNQUFNLEtBQUssUUFBUTtnQkFBRSxPQUFPLCtCQUFhLENBQUMsTUFBTSxDQUFDO1lBQzNELElBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNO2dCQUFFLE9BQU8sK0JBQWEsQ0FBQyxJQUFJLENBQUM7WUFDdkQsSUFBRyxNQUFNLENBQUMsTUFBTSxLQUFLLFdBQVc7Z0JBQUUsT0FBTywrQkFBYSxDQUFDLFFBQVEsQ0FBQztZQUNoRSxJQUFHLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVTtnQkFBRSxPQUFPLCtCQUFhLENBQUMsUUFBUSxDQUFDO1lBQy9ELCtCQUFhLENBQUMsTUFBTSxDQUFDO1NBQ3hCO2FBQU0sSUFBRyxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUNqQyxPQUFPLCtCQUFhLENBQUMsT0FBTyxDQUFBO1NBQy9CO2FBQU0sSUFBRyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3JELE9BQU8sK0JBQWEsQ0FBQyxNQUFNLENBQUE7U0FDOUI7UUFDRCxPQUFPLCtCQUFhLENBQUMsR0FBRyxDQUFDO0lBQzdCLENBQUM7Q0FHSjtBQWpDRCxzQ0FpQ0MifQ==