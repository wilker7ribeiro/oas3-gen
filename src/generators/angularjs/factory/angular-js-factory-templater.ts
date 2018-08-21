import { SchemaObject } from "openapi3-ts";
import { SchemaMapper } from "../../../util/schema-mapper";
import { JavascriptUtil } from "../../../util/languages/javascript-util";

export class AngularJsFactoryTemplater {

    getFileName(schemaName: string, schema: SchemaObject): string{
        return `${schemaName.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase()}-factory.js`
    }

    getFactoryTemplate(schemaName: string, schema: SchemaObject){
        schema = SchemaMapper.instance.getFullSchema(schema, true);
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
                    ${SchemaMapper.instance.schemaPropertiesToArray(schema).map(property => this.getPropertyTemplate(property))}
                }
                return ${schemaName};
            }
        }());`
    }

    getFactoryExtendingTemplate(schemaName: string, schema: SchemaObject){
        schema = SchemaMapper.instance.getFullSchema(schema, false);
        const schemaPaiUnit  = SchemaMapper.instance.getSchemasPai(schema).filter(schemapai => schemapai.isReference)[0];
    
        return `;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('${schemaName}', ${schemaName}Factory);
            
            /* @ngInject */
            function ${schemaName}Factory(${schemaPaiUnit? schemaPaiUnit.name : ""}) {
                function ${schemaName}(){
                    ${SchemaMapper.instance.schemaPropertiesToArray(schema).map(property => this.getPropertyTemplate(property)).join('\n')}
                }
                ${schemaPaiUnit ? schemaName+".prototype = new "+schemaPaiUnit.name +"()": ""}
                return ${schemaName};
            }
        }());`
    }

    private getPropertyTemplate({name, schema}: {name: string, schema: SchemaObject}){
        return `this.${name} = ${JavascriptUtil.stringfyValue(JavascriptUtil.getInitializationValue(schema))}`
    }

}