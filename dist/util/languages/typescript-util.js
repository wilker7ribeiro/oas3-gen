"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_types_util_1 = require("../data-types-util");
const data_types_enum_1 = require("../data-types-enum");
const core_mapper_1 = require("../core-mapper");
class TypescriptUtil {
    static isPrimitiveTipagem(nomeTipagem) {
        return ['any', 'string', 'boolean', 'number', 'Date'].includes(nomeTipagem);
    }
    static getTipagemForSchema(schemaRef) {
        if (!schemaRef)
            return 'any';
        let typeName = core_mapper_1.CoreMapper.getNameFromReferenceIfExists(schemaRef);
        if (typeName) {
            return typeName;
        }
        const datatype = data_types_util_1.DataTypesUtil.getSchemaDataType(schemaRef);
        switch (datatype) {
            case data_types_enum_1.DataTypesEnum.ARRAY:
                const schema = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaRef);
                return TypescriptUtil.getTipagemForSchema(schema.items) + "[]";
            case data_types_enum_1.DataTypesEnum.STRING:
            case data_types_enum_1.DataTypesEnum.PASSWORD:
            case data_types_enum_1.DataTypesEnum.BINARY:
                return "string";
            case data_types_enum_1.DataTypesEnum.BOOLEAN:
                return "boolean";
            case data_types_enum_1.DataTypesEnum.LONG:
            case data_types_enum_1.DataTypesEnum.INTEGER:
            case data_types_enum_1.DataTypesEnum.FLOAT:
            case data_types_enum_1.DataTypesEnum.DOUBLE:
            case data_types_enum_1.DataTypesEnum.BYTE:
                return "number";
            case data_types_enum_1.DataTypesEnum.DATE:
            case data_types_enum_1.DataTypesEnum.DATETIME:
                return "Date";
            case data_types_enum_1.DataTypesEnum.OBJECT:
            default:
                return "any";
        }
    }
}
exports.TypescriptUtil = TypescriptUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC11dGlsLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3dpbGtlci9wcm9qZXRvcy9vcGVuQXBpM0pzb25Xcml0ZXJzL3NyYy8iLCJzb3VyY2VzIjpbInV0aWwvbGFuZ3VhZ2VzL3R5cGVzY3JpcHQtdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdEQUFtRDtBQUNuRCx3REFBbUQ7QUFDbkQsZ0RBQTRDO0FBRTVDO0lBRUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQW1CO1FBQzFDLE9BQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFDRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBb0Q7UUFDM0UsSUFBRyxDQUFDLFNBQVM7WUFBRSxPQUFPLEtBQUssQ0FBQTtRQUMzQixJQUFJLFFBQVEsR0FBRyx3QkFBVSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xFLElBQUcsUUFBUSxFQUFFO1lBQ1QsT0FBTyxRQUFRLENBQUE7U0FDbEI7UUFDRCxNQUFNLFFBQVEsR0FBRywrQkFBYSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzNELFFBQVEsUUFBUSxFQUFFO1lBQ2QsS0FBSywrQkFBYSxDQUFDLEtBQUs7Z0JBQ3BCLE1BQU0sTUFBTSxHQUFHLHdCQUFVLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUMvRCxPQUFPLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDLEdBQUMsSUFBSSxDQUFDO1lBQ2xFLEtBQUssK0JBQWEsQ0FBQyxNQUFNLENBQUM7WUFDMUIsS0FBSywrQkFBYSxDQUFDLFFBQVEsQ0FBQztZQUM1QixLQUFLLCtCQUFhLENBQUMsTUFBTTtnQkFDckIsT0FBTyxRQUFRLENBQUE7WUFDbkIsS0FBSywrQkFBYSxDQUFDLE9BQU87Z0JBQ3RCLE9BQU8sU0FBUyxDQUFDO1lBQ3JCLEtBQUssK0JBQWEsQ0FBQyxJQUFJLENBQUM7WUFDeEIsS0FBSywrQkFBYSxDQUFDLE9BQU8sQ0FBQztZQUMzQixLQUFLLCtCQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEtBQUssK0JBQWEsQ0FBQyxNQUFNLENBQUM7WUFDMUIsS0FBSywrQkFBYSxDQUFDLElBQUk7Z0JBQ25CLE9BQU8sUUFBUSxDQUFBO1lBQ25CLEtBQUssK0JBQWEsQ0FBQyxJQUFJLENBQUM7WUFDeEIsS0FBSywrQkFBYSxDQUFDLFFBQVE7Z0JBQ3ZCLE9BQU8sTUFBTSxDQUFDO1lBQ2xCLEtBQUssK0JBQWEsQ0FBQyxNQUFNLENBQUM7WUFDMUI7Z0JBQ0ksT0FBTyxLQUFLLENBQUE7U0FDbkI7SUFDTCxDQUFDO0NBQ0o7QUFwQ0Qsd0NBb0NDIn0=