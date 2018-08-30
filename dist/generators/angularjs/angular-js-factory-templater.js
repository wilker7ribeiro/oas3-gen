"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_mapper_1 = require("../../util/schema-mapper");
const javascript_util_1 = require("../../util/languages/javascript-util");
class AngularJsFactoryTemplater {
    constructor(schema) {
        this.schema = schema;
    }
    getFileName(schemaName) {
        return `${schemaName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}-factory.js`;
    }
    getFactoryTemplate(schemaName) {
        this.schema = schema_mapper_1.SchemaMapper.instance.getFullSchema(this.schema);
        return `;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('${schemaName}', ${schemaName}Factory);
            
            /* @ngInject */
            function ${schemaName}Factory() {
                function ${schemaName}(){
                    ${schema_mapper_1.SchemaMapper.instance
            .schemaPropertiesRefToArray(this.schema)
            .map(property => this.getPropertyTemplate(property))
            .join('\n')}
                }
                return ${schemaName};
            }
        }());`;
    }
    getFactoryExtendingTemplate(schemaName) {
        this.schema = schema_mapper_1.SchemaMapper.instance.getFullSchema(this.schema, false);
        const schemaPaiUnit = schema_mapper_1.SchemaMapper.instance.getSchemasPai(this.schema).filter(schemapai => schemapai.isReference)[0];
        return `;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('${schemaName}', ${schemaName}Factory);
            
            /* @ngInject */
            function ${schemaName}Factory(${schemaPaiUnit ? schemaPaiUnit.name : ""}) {
                function ${schemaName}(){
                    ${schema_mapper_1.SchemaMapper.instance
            .schemaPropertiesRefToArray(this.schema)
            .map(property => this.getPropertyTemplate(property))
            .join('\n')}
                }
                ${schemaPaiUnit ? schemaName + ".prototype = new " + schemaPaiUnit.name + "()" : ""}
                return ${schemaName};
            }
        }());`;
    }
    getPropertyTemplate({ name, schemaRef }) {
        return `this.${name} = ${javascript_util_1.JavascriptUtil.stringfyValue(javascript_util_1.JavascriptUtil.getInitializationValue(schemaRef))}`;
    }
}
exports.AngularJsFactoryTemplater = AngularJsFactoryTemplater;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1qcy1mYWN0b3J5LXRlbXBsYXRlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS93aWxrZXIvcHJvamV0b3Mvb3BlbkFwaTNKc29uV3JpdGVycy9zcmMvIiwic291cmNlcyI6WyJnZW5lcmF0b3JzL2FuZ3VsYXJqcy9hbmd1bGFyLWpzLWZhY3RvcnktdGVtcGxhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNERBQXdEO0FBQ3hELDBFQUFzRTtBQUV0RTtJQUNJLFlBQW9CLE1BQW9CO1FBQXBCLFdBQU0sR0FBTixNQUFNLENBQWM7SUFBRSxDQUFDO0lBRTNDLFdBQVcsQ0FBQyxVQUFrQjtRQUMxQixPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxPQUFPLENBQUUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFBO0lBQ3pGLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxVQUFrQjtRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLDRCQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0QsT0FBTzs7Ozs7Ozs0QkFPYSxVQUFVLE1BQU0sVUFBVTs7O3VCQUcvQixVQUFVOzJCQUNOLFVBQVU7c0JBRWIsNEJBQVksQ0FBQyxRQUFRO2FBQ3BCLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25ELElBQUksQ0FBQyxJQUFJLENBQ2Q7O3lCQUVLLFVBQVU7O2NBRXJCLENBQUE7SUFDVixDQUFDO0lBRUQsMkJBQTJCLENBQUMsVUFBa0I7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyw0QkFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RSxNQUFNLGFBQWEsR0FBSSw0QkFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0SCxPQUFPOzs7Ozs7OzRCQU9hLFVBQVUsTUFBTSxVQUFVOzs7dUJBRy9CLFVBQVUsV0FBVyxhQUFhLENBQUEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7MkJBQ3ZELFVBQVU7c0JBRWIsNEJBQVksQ0FBQyxRQUFRO2FBQ3BCLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDdkMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25ELElBQUksQ0FBQyxJQUFJLENBQ2Q7O2tCQUVGLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFDLG1CQUFtQixHQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUUsSUFBSSxDQUFBLENBQUMsQ0FBQyxFQUFFO3lCQUNwRSxVQUFVOztjQUVyQixDQUFBO0lBQ1YsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBNEQ7UUFDcEcsT0FBTyxRQUFRLElBQUksTUFBTSxnQ0FBYyxDQUFDLGFBQWEsQ0FBQyxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUM3RyxDQUFDO0NBRUo7QUFsRUQsOERBa0VDIn0=