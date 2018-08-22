import { TagDefinition, PathDefinition, PathMapper, PathDefinitionHTTPMethod } from "../../util/path-mapper";
import { StringUtil } from "../../util/string-util";
import { ParameterObject } from "openapi3-ts";
import { SchemaMapper } from "../../util/schema-mapper";
import { CoreMapper } from "../../util/core-mapper";
import { DataTypesUtil } from "../../util/data-types-util";
import { DataTypesEnum } from "../../util/data-types-enum";

export class AngularJsServiceTemplater {
    constructor(public tagDefinition: TagDefinition) {}
    getFileName(): string {
        return `${this.tagDefinition.name}-service.js`
    }

    getServiceTemplate() {

        const serviceName = StringUtil.dashToUpperCamelCase(this.tagDefinition.name)
        const metodosName = this.getAllMetodosName();

        return `;
        (function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.service')
                .service('${serviceName}Service', ${serviceName}Service);
            
            /* @ngInject */
            function ${serviceName}Service(Restangular) {
                var endpoint = Restangular

                ${ metodosName.map(metodosName => `this.${metodosName} = ${metodosName}`).join('\n')}
                    
                ${ this.tagDefinition.paths.map(pathDefinition => this.getTemplateForApi(pathDefinition)).join('\n')}                    
            }   
        }());`
    }

    getAllMetodosName(): string[] {
        return this.tagDefinition.paths.map(pathDefinition => this.getMetodoName(pathDefinition));
    }

    urlToMetodoName(url:string){
        return url.replace(/\/([a-z])/g, function (g) { return g[1].toUpperCase(); }).replace(/(\#|\{|\}|\/)/g, "");
    }
    getMetodoName(pathDefinition: PathDefinition) {
        if(pathDefinition.name) return StringUtil.dashToCamelCase(pathDefinition.name);
        return this.urlToMetodoName(pathDefinition.url)
    }

    getTemplateForApi(pathDefinition: PathDefinition): string {
        return this.criarTemplateForApi(pathDefinition);
    }



    criarTemplateForApi(pathDefinition: PathDefinition): string {
        const bodySchemeRef = PathMapper.instance.getSchemaOrRefFromBodyJsonParameter(pathDefinition.path);
        const bodyName = bodySchemeRef ? CoreMapper.getNameFromReferenceIfExists(bodySchemeRef) || "bodyObj" : '';
        const parametersName = this.getNotBodyParamsNames(pathDefinition);
        if(bodyName) parametersName.unshift(bodyName)
        return `// ${pathDefinition.method} ${pathDefinition.url} - ${pathDefinition.schemaResponse ? CoreMapper.getNameFromReferenceIfExists(pathDefinition.schemaResponse) || "any" : ""}
        function ${this.getMetodoName(pathDefinition)}(${parametersName}) {
            ${this.getRestangularFunctionBody(pathDefinition, bodyName)}
        }
        `;

    }

    getRestangularFunctionBody(pathDefinition: PathDefinition, bodyVariableName: string): string {
        return `return endpoint${this.getRestangularPaths(pathDefinition)}.${this.getRestangularFinalMethodName(pathDefinition)}(${this.getRestangularFinalParameter(pathDefinition, bodyVariableName)})`
    }

    getRestangularFinalMethodName(pathDefinition: PathDefinition): string{
        if(pathDefinition.method === PathDefinitionHTTPMethod.PUT && pathDefinition.path.requestBody) return 'customPUT'
        if(pathDefinition.method === PathDefinitionHTTPMethod.POST && pathDefinition.path.requestBody) return 'customPOST'
        if(pathDefinition.method === PathDefinitionHTTPMethod.GET && pathDefinition.schemaResponse && DataTypesUtil.getSchemaDataType(pathDefinition.schemaResponse) === DataTypesEnum.ARRAY) return 'getList'
        return pathDefinition.method
    }

    getRestangularPaths(pathDefinition: PathDefinition) {

        var partialPaths = pathDefinition.url.split('\/').filter(partialPath => partialPath);
        return partialPaths.map((partialPath, index) => {
            return `.${this.getRestangularOneOrAll(pathDefinition, partialPaths, index)}(${this.getRestangularPathParameter(partialPath)})`
        }).join("");
    }

    getRestangularOneOrAll(path: PathDefinition, partialPaths: string[], index:number){
        var isUltimoPartial = partialPaths.length === index + 1;
        if(isUltimoPartial) {
            if(path.schemaResponse && DataTypesUtil.getSchemaDataType(path.schemaResponse) === DataTypesEnum.ARRAY) {
                return 'all' 
            }
        } 
        return 'one'
    }


    getRestangularFinalParameter(pathDefinition: PathDefinition, bodyVariableName: string): string {
        // if(pathDefinition.method === PathDefinitionHTTPMethod.PUT && bodyVariableName)
        const queryParams = PathMapper.getQueryParams(pathDefinition);
        if(pathDefinition.hasQueryParams) {
            if(bodyVariableName){
                return `${bodyVariableName},${pathDefinition.hasQueryParams? `${this.getQueryParamsAsStringfyObj(queryParams)}`: ``} `
            } else {
                return `${pathDefinition.hasQueryParams? `${this.getQueryParamsAsStringfyObj(queryParams)}`: ``}`
            }
        }
        return bodyVariableName
    }

    getQueryParamsAsStringfyObj(queryParams: ParameterObject[]){
        return`{${queryParams.map(queryParam => `${queryParam.name}:${queryParam.name}`).join(',\n')}}`
    }
    getRestangularPathParameter(partialPath: string){
        const result = /\{([^}]+)}/g.exec(partialPath)
        if(result){
            return `'${result[1]}', ${result[1]}`
        }
        return `'${partialPath}'`
    }

    getNotBodyParamsNames(pathDefinition: PathDefinition): string[] {
  
        return pathDefinition
                .path
                .parameters!
                .map(
                    (parameter) => StringUtil.dashToCamelCase((parameter as ParameterObject).name)
                )
    }

}