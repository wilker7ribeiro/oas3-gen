"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_mapper_1 = require("../../util/path-mapper");
const string_util_1 = require("../../util/string-util");
const core_mapper_1 = require("../../util/core-mapper");
const data_types_util_1 = require("../../util/data-types-util");
const data_types_enum_1 = require("../../util/data-types-enum");
const typescript_util_1 = require("../../util/languages/typescript-util");
class AngularJsServiceTemplater {
    constructor(tagDefinition) {
        this.tagDefinition = tagDefinition;
    }
    getFileName() {
        return `${this.tagDefinition.name}-service.js`;
    }
    getServiceTemplate() {
        const serviceName = string_util_1.StringUtil.dashToUpperCamelCase(this.tagDefinition.name);
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

                ${metodosName.map(metodosName => `this.${metodosName} = ${metodosName}`).join('\n')}
                    
                ${this.tagDefinition.paths.map(pathDefinition => this.getTemplateForApi(pathDefinition)).join('\n')}                    
            }   
        }());`;
    }
    getAllMetodosName() {
        return this.tagDefinition.paths.map(pathDefinition => this.getMetodoName(pathDefinition));
    }
    urlToMetodoName(url) {
        return url.replace(/\/([a-z])/g, function (g) { return g[1].toUpperCase(); }).replace(/(\#|\{|\}|\/)/g, "");
    }
    getMetodoName(pathDefinition) {
        if (pathDefinition.name)
            return string_util_1.StringUtil.dashToCamelCase(pathDefinition.name);
        return this.urlToMetodoName(pathDefinition.url);
    }
    getTemplateForApi(pathDefinition) {
        return this.criarTemplateForApi(pathDefinition);
    }
    criarTemplateForApi(pathDefinition) {
        const bodySchemeRef = path_mapper_1.PathMapper.instance.getSchemaOrRefFromBodyJsonParameter(pathDefinition.path);
        const bodyName = bodySchemeRef ? core_mapper_1.CoreMapper.getNameFromReferenceIfExists(bodySchemeRef) || "bodyObj" : '';
        const parametersName = this.getNotBodyParamsNames(pathDefinition);
        if (bodyName)
            parametersName.unshift(bodyName);
        return `// ${pathDefinition.method} ${pathDefinition.url} -> ${pathDefinition.schemaResponse ? typescript_util_1.TypescriptUtil.getTipagemForSchema(pathDefinition.schemaResponse) || "any" : ""}
        function ${this.getMetodoName(pathDefinition)}(${parametersName}) {
            ${this.getRestangularFunctionBody(pathDefinition, bodyName)}
        }
        `;
    }
    getRestangularFunctionBody(pathDefinition, bodyVariableName) {
        return `return endpoint${this.getRestangularPaths(pathDefinition)}.${this.getRestangularFinalMethodName(pathDefinition)}(${this.getRestangularFinalParameter(pathDefinition, bodyVariableName)})`;
    }
    getRestangularFinalMethodName(pathDefinition) {
        if (pathDefinition.method === path_mapper_1.PathDefinitionHTTPMethod.PUT && pathDefinition.path.requestBody)
            return 'customPUT';
        if (pathDefinition.method === path_mapper_1.PathDefinitionHTTPMethod.POST && pathDefinition.path.requestBody)
            return 'customPOST';
        if (pathDefinition.method === path_mapper_1.PathDefinitionHTTPMethod.GET && pathDefinition.schemaResponse && data_types_util_1.DataTypesUtil.getSchemaDataType(pathDefinition.schemaResponse) === data_types_enum_1.DataTypesEnum.ARRAY)
            return 'getList';
        return pathDefinition.method;
    }
    getRestangularPaths(pathDefinition) {
        var partialPaths = pathDefinition.url.split('\/').filter(partialPath => partialPath);
        return partialPaths.map((partialPath, index) => {
            return `.${this.getRestangularOneOrAll(pathDefinition, partialPaths, index)}(${this.getRestangularPathParameter(partialPath)})`;
        }).join("");
    }
    getRestangularOneOrAll(path, partialPaths, index) {
        var isUltimoPartial = partialPaths.length === index + 1;
        if (isUltimoPartial) {
            if (path.schemaResponse && data_types_util_1.DataTypesUtil.getSchemaDataType(path.schemaResponse) === data_types_enum_1.DataTypesEnum.ARRAY) {
                return 'all';
            }
        }
        return 'one';
    }
    getRestangularFinalParameter(pathDefinition, bodyVariableName) {
        // if(pathDefinition.method === PathDefinitionHTTPMethod.PUT && bodyVariableName)
        const queryParams = path_mapper_1.PathMapper.getQueryParams(pathDefinition);
        if (pathDefinition.hasQueryParams) {
            if (bodyVariableName) {
                return `${bodyVariableName},${pathDefinition.hasQueryParams ? `${this.getQueryParamsAsStringfyObj(queryParams)}` : ``} `;
            }
            else {
                return `${pathDefinition.hasQueryParams ? `${this.getQueryParamsAsStringfyObj(queryParams)}` : ``}`;
            }
        }
        return bodyVariableName;
    }
    getQueryParamsAsStringfyObj(queryParams) {
        return `{${queryParams.map(queryParam => `${queryParam.name}:${queryParam.name}`).join(',\n')}}`;
    }
    getRestangularPathParameter(partialPath) {
        const result = /\{([^}]+)}/g.exec(partialPath);
        if (result) {
            return `'${result[1]}', ${result[1]}`;
        }
        return `'${partialPath}'`;
    }
    getNotBodyParamsNames(pathDefinition) {
        return pathDefinition
            .path
            .parameters
            .map((parameter) => string_util_1.StringUtil.dashToCamelCase(parameter.name));
    }
}
exports.AngularJsServiceTemplater = AngularJsServiceTemplater;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1qcy1zZXJ2aWNlLXRlbXBsYXRlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS93aWxrZXIvcHJvamV0b3Mvb3BlbkFwaTNKc29uV3JpdGVycy9zcmMvIiwic291cmNlcyI6WyJnZW5lcmF0b3JzL2FuZ3VsYXJqcy9hbmd1bGFyLWpzLXNlcnZpY2UtdGVtcGxhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0RBQTZHO0FBQzdHLHdEQUFvRDtBQUdwRCx3REFBb0Q7QUFDcEQsZ0VBQTJEO0FBQzNELGdFQUEyRDtBQUMzRCwwRUFBc0U7QUFFdEU7SUFDSSxZQUFtQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFDbkQsV0FBVztRQUNQLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxDQUFBO0lBQ2xELENBQUM7SUFFRCxrQkFBa0I7UUFFZCxNQUFNLFdBQVcsR0FBRyx3QkFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFN0MsT0FBTzs7Ozs7Ozs7NEJBUWEsV0FBVyxhQUFhLFdBQVc7Ozt1QkFHeEMsV0FBVzs7O2tCQUdmLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxRQUFRLFdBQVcsTUFBTSxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7O2tCQUVqRixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztjQUV0RyxDQUFBO0lBQ1YsQ0FBQztJQUVELGlCQUFpQjtRQUNiLE9BQU8sSUFBSSxDQUFDLGFBQWEs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