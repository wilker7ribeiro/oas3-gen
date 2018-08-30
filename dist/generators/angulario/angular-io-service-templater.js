"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_mapper_1 = require("../../util/path-mapper");
const string_util_1 = require("../../util/string-util");
const core_mapper_1 = require("../../util/core-mapper");
const typescript_util_1 = require("../../util/languages/typescript-util");
class AngularIoServiceTemplater {
    constructor(tagDefinition) {
        this.tagDefinition = tagDefinition;
    }
    getFileName() {
        return `${this.tagDefinition.name}.service.ts`;
    }
    getServiceTemplate() {
        const serviceName = string_util_1.StringUtil.dashToUpperCamelCase(this.tagDefinition.name);
        const needHttpParamImport = this.tagDefinition.paths.some(path => path.hasQueryParams);
        const needHttpHeaderImport = this.tagDefinition.paths.some(path => path.hasHeaderParams);
        const serviceBodyMethods = this.tagDefinition.paths.map(pathDefinition => this.getTemplateForMethod(pathDefinition)).join('\n');
        const listaRefencias = this.getListaReferencias();
        return `
        import { Injectable } from '@angular/core';
        import { HttpClient${needHttpParamImport ? ', HttpParams' : ''}${needHttpHeaderImport ? ', HttpHeaders' : ''} } from '@angular/common/http';
        import { Observable } from 'rxjs'
        ${listaRefencias.map(className => `import {${className}} from '../entity/${className}'`).join(';\n')}

        @Injectable()
        export class ${serviceName}Service{

        constructor(private http: HttpClient) {}
            ${serviceBodyMethods}                    
        }
            `;
    }
    getAllUsedReferences(pathDefinition) {
        var references = [];
    }
    adicionarEmListaReferencia(className) {
        if (className) {
            if (!this.tagDefinition.referenceList)
                this.tagDefinition.referenceList = new Set();
            this.tagDefinition.referenceList.add(className);
        }
    }
    getListaReferencias() {
        return Array.from(this.tagDefinition.referenceList).filter(name => !typescript_util_1.TypescriptUtil.isPrimitiveTipagem(name));
    }
    getMetodoName(pathDefinition) {
        if (pathDefinition.name)
            return string_util_1.StringUtil.dashToCamelCase(pathDefinition.name.replace(/\s/g, ''));
        return this.urlToMetodoName(pathDefinition.url);
    }
    urlToMetodoName(url) {
        return url.replace(/\/([a-z])/g, function (g) { return g[1].toUpperCase(); }).replace(/(\#|\{|\}|\/)/g, "");
    }
    getTemplateForMethod(pathDefinition) {
        const bodySchemeRef = path_mapper_1.PathMapper.instance.getSchemaOrRefFromBodyJsonParameter(pathDefinition.path);
        const bodyClassName = core_mapper_1.CoreMapper.getNameFromReferenceIfExists(bodySchemeRef);
        const parametersName = this.getNotBodyParamsNames(pathDefinition);
        if (bodySchemeRef) {
            if (bodyClassName) {
                this.adicionarEmListaReferencia(bodyClassName);
                parametersName.unshift(`${string_util_1.StringUtil.uperToLowerCamelCase(bodyClassName)}: ${bodyClassName}`);
            }
            else {
                parametersName.unshift(`bodyObj: any`);
            }
        }
        return `${this.getMetodoName(pathDefinition)}(${parametersName}): ${this.getMethodRetorno(pathDefinition)} {
            ${this.getMethodBody(pathDefinition, bodyClassName)}
        }
        `;
    }
    getMethodRetorno(pathDefinition) {
        const tipoResponse = core_mapper_1.CoreMapper.getNameFromReferenceIfExists(pathDefinition.schemaResponse);
        this.adicionarEmListaReferencia(tipoResponse);
        return tipoResponse ? `Observable<${tipoResponse}>` : "Observable<any>";
    }
    getMethodBody(pathDefinition, bodyClassName) {
        const httpMethodParams = this.getHttpMethodParameters(pathDefinition, bodyClassName);
        return `${pathDefinition.hasQueryParams ? this.getQueryParamsDeclarationTemplate(pathDefinition) : ''}\
                ${pathDefinition.hasHeaderParams ? this.getHeadersParamsDeclarationTemplate(pathDefinition) : ''}\
                return this.http.${this.getHttpMethodName(pathDefinition)}(${this.getHttpPath(pathDefinition)}${httpMethodParams ? ', ' + httpMethodParams : ''})`;
    }
    getHttpMethodName(pathDefinition) {
        return pathDefinition.method;
    }
    getHttpPath(pathDefinition) {
        var partialPaths = pathDefinition.url.split('\/').filter(partialPath => partialPath);
        var url = partialPaths.map((partialPath, index) => {
            return this.getPartialPathString(partialPath);
        }).join("/");
        return url ? `\`${url}\`` : '';
    }
    getHttpMethodParameters(pathDefinition, bodyClassName) {
        const angularIoHttpParams = this.getHttpMethodConfig(pathDefinition);
        const parameters = [];
        if (bodyClassName)
            parameters.push(string_util_1.StringUtil.uperToLowerCamelCase(bodyClassName));
        if (angularIoHttpParams)
            parameters.push(angularIoHttpParams);
        return parameters.join();
    }
    getHttpMethodConfig(pathDefinition) {
        const angularIoHttpParams = [];
        if (pathDefinition.hasQueryParams)
            angularIoHttpParams.push('params: queryParams');
        if (pathDefinition.hasHeaderParams)
            angularIoHttpParams.push('headers: headersParams');
        if (pathDefinition.hasHeaderParams || pathDefinition.hasQueryParams)
            return `{${angularIoHttpParams.join(',\n')}}`;
        return '';
    }
    getQueryParamsAsStringfyObj(queryParams) {
        return `{${queryParams.map(queryParam => `${queryParam.name}:${queryParam.name}`).join(',\n')}}`;
    }
    getPartialPathString(partialPath) {
        const result = /\{([^}]+)}/g.exec(partialPath);
        if (result) {
            return `\${${result[1]}}`;
        }
        return `${partialPath}`;
    }
    getNotBodyParamsNames(pathDefinition) {
        return pathDefinition
            .path
            .parameters
            .map(parameter => {
            // return ''
            const variableName = string_util_1.StringUtil.dashToCamelCase(parameter.name);
            const variableTipagem = typescript_util_1.TypescriptUtil.getTipagemForSchema(core_mapper_1.CoreMapper.instance.getObjectMaybeRef(parameter).schema);
            this.adicionarEmListaReferencia(variableTipagem.replace('\[\]', ''));
            return `${variableName}: ${variableTipagem}`;
        });
    }
    getQueryParamsDeclarationTemplate(pathDefinition) {
        const queryParams = path_mapper_1.PathMapper.getQueryParams(pathDefinition);
        return `let queryParams = new HttpParams()
            ${queryParams.map(queryParam => {
            return `.append('${queryParam.name}', ${string_util_1.StringUtil.dashToCamelCase(queryParam.name)})`;
        }).join('\n')};\n`;
    }
    getHeadersParamsDeclarationTemplate(pathDefinition) {
        const headerParams = path_mapper_1.PathMapper.getHeaderParams(pathDefinition);
        return `let headersParams = new HttpHeaders()
            ${headerParams.map(headerParam => {
            return `.append('${headerParam.name}', ${string_util_1.StringUtil.dashToCamelCase(headerParam.name)})`;
        }).join('\n')};\n`;
    }
}
exports.AngularIoServiceTemplater = AngularIoServiceTemplater;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1pby1zZXJ2aWNlLXRlbXBsYXRlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS93aWxrZXIvcHJvamV0b3Mvb3BlbkFwaTNKc29uV3JpdGVycy9zcmMvIiwic291cmNlcyI6WyJnZW5lcmF0b3JzL2FuZ3VsYXJpby9hbmd1bGFyLWlvLXNlcnZpY2UtdGVtcGxhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0RBQW1GO0FBQ25GLHdEQUFvRDtBQUVwRCx3REFBb0Q7QUFDcEQsMEVBQXNFO0FBRXRFO0lBRUksWUFBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFBRSxDQUFDO0lBQ25ELFdBQVc7UUFDUCxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsQ0FBQTtJQUNsRCxDQUFDO0lBRUQsa0JBQWtCO1FBRWQsTUFBTSxXQUFXLEdBQUcsd0JBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVFLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXpGLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hJLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO1FBQ2pE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