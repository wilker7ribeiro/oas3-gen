"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_mapper_1 = require("./core-mapper");
const data_types_util_1 = require("./data-types-util");
const data_types_enum_1 = require("./data-types-enum");
class SchemaMapper {
    constructor(openApiObj) {
        this.openApiObj = openApiObj;
    }
    static get instance() {
        if (this._instance)
            return this._instance;
        throw "SchemaMapper não inicializado";
    }
    static init(openApiObj) {
        if (!openApiObj.components)
            openApiObj.components = {};
        if (!openApiObj.components.schemas)
            openApiObj.components.schemas = {};
        this._instance = new SchemaMapper(openApiObj);
    }
    getSchemaByName(schemaName) {
        return this.openApiObj.components.schemas[schemaName];
    }
    getFullSchema(schemaRef, followReferences = true) {
        const schema = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaRef);
        if (schema.allOf && schema.allOf.length) {
            schema.allOf.forEach(schemaPaiRef => {
                if (!core_mapper_1.CoreMapper.isReference(schemaPaiRef) || followReferences) {
                    this.extendSchemaProperties(schema, schemaPaiRef);
                }
            });
        }
        return schema;
    }
    getSchemasPai(schemaRef) {
        const schema = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaRef);
        if (!schema.allOf)
            return [];
        return schema.allOf.map(schemaPaiRef => {
            return {
                name: core_mapper_1.CoreMapper.getNameFromReference(core_mapper_1.CoreMapper.isReference(schemaPaiRef) ? core_mapper_1.CoreMapper.getNameFromReference(core_mapper_1.CoreMapper.getReferemce(schemaPaiRef)) : ''),
                isReference: core_mapper_1.CoreMapper.isReference(schemaPaiRef),
                schema: core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaPaiRef)
            };
        });
    }
    getNamesSchemasFilhosUtilizados(schemaPai) {
        var schemasUtilizados = [];
        SchemaMapper.instance.schemaPropertiesRefToArray(schemaPai)
            .forEach(({ name, schemaRef }) => {
            const refName = core_mapper_1.CoreMapper.getNameFromReferenceIfExists(schemaRef);
            if (refName)
                return schemasUtilizados.push({
                    name: refName,
                    schemaRef
                });
            const schema = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaRef);
            if (data_types_util_1.DataTypesUtil.getSchemaDataType(schema) === data_types_enum_1.DataTypesEnum.ARRAY) {
                const typeName = core_mapper_1.CoreMapper.getNameFromReferenceIfExists(schema.items);
                if (typeName)
                    return schemasUtilizados.push({
                        name: typeName,
                        schemaRef: schema.items
                    });
            }
        });
        return schemasUtilizados;
    }
    extendSchemaProperties(schemaRef, schemaPaiRef) {
        const schema = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaRef);
        const schemaPai = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(schemaPaiRef);
        if (!schemaPai.properties)
            schemaPai.properties = {};
        if (!schema.properties)
            schema.properties = {};
        Object.keys(schemaPai.properties).forEach(propertyPaiName => {
            schema.properties[propertyPaiName] = schemaPai.properties[propertyPaiName];
        });
        return schema;
    }
    schemaPropertiesRefToArray(schema) {
        if (!schema.properties)
            schema.properties = {};
        return Object.keys(schema.properties).map(schemaName => {
            return {
                name: schemaName,
                schemaRef: schema.properties[schemaName]
            };
        });
    }
    getAllSchemasAsArray() {
        return Object.keys(this.openApiObj.components.schemas).map(schemaName => {
            return {
                name: schemaName,
                schema: this.openApiObj.components.schemas[schemaName]
            };
        });
    }
}
exports.SchemaMapper = SchemaMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLW1hcHBlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS93aWxrZXIvcHJvamV0b3Mvb3BlbkFwaTNKc29uV3JpdGVycy9zcmMvIiwic291cmNlcyI6WyJ1dGlsL3NjaGVtYS1tYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQ0FBMkM7QUFDM0MsdURBQWtEO0FBQ2xELHVEQUFrRDtBQUVsRDtJQUtJLFlBQW9CLFVBQXlCO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNLEtBQUssUUFBUTtRQUNmLElBQUcsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDekMsTUFBTSwrQkFBK0IsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUF5QjtRQUNqQyxJQUFHLENBQUMsVUFBVSxDQUFDLFVBQVU7WUFBRSxVQUFVLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0RCxJQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPO1lBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELGVBQWUsQ0FBQyxVQUFrQjtRQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVyxDQUFDLE9BQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsYUFBYSxDQUFDLFNBQXlDLEVBQUUsbUJBQTRCLElBQUk7UUFDckYsTUFBTSxNQUFNLEdBQUcsd0JBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEUsSUFBRyxNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDO1lBQ25D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