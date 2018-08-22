import { SchemaObject, ReferenceObject } from "openapi3-ts";
import { SchemaMapper } from "../../util/schema-mapper";
import { JavascriptUtil } from "../../util/languages/javascript-util";

export class AngularJsFactoryTemplater {
    constructor(private schema: SchemaObject){}

    getFileName(schemaName: string): string{
        return `${schemaName.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase()}-factory.js`
    }

    getFactoryTemplate(schemaName: string){
        this.schema = SchemaMapper.instance.getFullSchema(this.schema);
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
                    ${
                        SchemaMapper.instance
                        .schemaPropertiesRefToArray(this.schema)
                        .map(property => this.getPropertyTemplate(property))
                        .join('\n')
                    }
                }
                return ${schemaName};
            }
        }());`
    }

    getFactoryExtendingTemplate(schemaName: string){
        this.schema = SchemaMapper.instance.getFullSchema(this.schema, false);
        const schemaPaiUnit  = SchemaMapper.instance.getSchemasPai(this.schema).filter(schemapai => schemapai.isReference)[0];
    
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
                    ${
                        SchemaMapper.instance
                        .schemaPropertiesRefToArray(this.schema)
                        .map(property => this.getPropertyTemplate(property))
                        .join('\n')
                    }
                }
                ${schemaPaiUnit ? schemaName+".prototype = new "+schemaPaiUnit.name +"()": ""}
                return ${schemaName};
            }
        }());`
    }

    private getPropertyTemplate({name, schemaRef}: {name: string, schemaRef: SchemaObject | ReferenceObject}){
        return `this.${name} = ${JavascriptUtil.stringfyValue(JavascriptUtil.getInitializationValue(schemaRef))}`
    }

}