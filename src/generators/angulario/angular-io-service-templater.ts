import { TagDefinition, PathDefinition, PathMapper } from "../../util/path-mapper";
import { StringUtil } from "../../util/string-util";
import { ParameterObject } from "openapi3-ts";
import { CoreMapper } from "../../util/core-mapper";
import { TypescriptUtil } from "../../util/languages/typescript-util";

export class AngularIoServiceTemplater {

    constructor(private tagDefinition: TagDefinition){}
    getFileName(): string {
        return `${this.tagDefinition.name}.service.ts`
    }

    getServiceTemplate() {

        const serviceName = StringUtil.dashToUpperCamelCase(this.tagDefinition.name)
        const needHttpParamImport = this.tagDefinition.paths.some(path => path.hasQueryParams);
        const needHttpHeaderImport = this.tagDefinition.paths.some(path => path.hasHeaderParams);

        const serviceBodyMethods = this.tagDefinition.paths.map(pathDefinition => this.getTemplateForMethod(pathDefinition)).join('\n');
        const listaRefencias = this.getListaReferencias()
        return `
        import { Injectable } from '@angular/core';
        import { HttpClient${needHttpParamImport? ', HttpParams' : ''}${needHttpHeaderImport? ', HttpHeaders' : ''} } from '@angular/common/http';
        import { Observable } from 'rxjs'
        ${listaRefencias.map(className => `import {${className}} from '../entity/${className}'`).join(';\n')}

        @Injectable()
        export class ${serviceName}Service{

        constructor(private http: HttpClient) {}
            ${serviceBodyMethods}                    
        }
            `
    }

    getAllUsedReferences(pathDefinition: PathDefinition){
        var references = [];
    }

    adicionarEmListaReferencia(className: string){
        if(className){
            if(!(this.tagDefinition as any).referenceList) (this.tagDefinition as any).referenceList = new Set();
            (this.tagDefinition as any).referenceList.add(className)
        }
    }
    getListaReferencias(): string[] {
        return Array.from<string>((this.tagDefinition as any).referenceList).filter(name => !TypescriptUtil.isPrimitiveTipagem(name));
    }
    getMetodoName(pathDefinition: PathDefinition) {
        if(pathDefinition.name) return StringUtil.dashToCamelCase(pathDefinition.name.replace(/\s/g, ''));
        return this.urlToMetodoName(pathDefinition.url)
    }
    urlToMetodoName(url: string) {
        return url.replace(/\/([a-z])/g, function (g) { return g[1].toUpperCase(); }).replace(/(\#|\{|\}|\/)/g, "");
    }


    getTemplateForMethod(pathDefinition: PathDefinition): string {
        const bodySchemeRef = PathMapper.instance.getSchemaOrRefFromBodyJsonParameter(pathDefinition.path);
        const bodyClassName = CoreMapper.getNameFromReferenceIfExists(bodySchemeRef);
        const parametersName = this.getNotBodyParamsNames(pathDefinition);
        if(bodySchemeRef){
            if(bodyClassName) { 
                this.adicionarEmListaReferencia(bodyClassName);
                parametersName.unshift(`${StringUtil.uperToLowerCamelCase(bodyClassName)}: ${bodyClassName}`)
            } else {
                parametersName.unshift(`bodyObj: any`);
            }
        }
        return `${this.getMetodoName(pathDefinition)}(${parametersName}): ${this.getMethodRetorno(pathDefinition)} {
            ${this.getMethodBody(pathDefinition, bodyClassName)}
        }
        `;

    }
    getMethodRetorno(pathDefinition: PathDefinition){
        const tipoResponse = CoreMapper.getNameFromReferenceIfExists(pathDefinition.schemaResponse) ;
        this.adicionarEmListaReferencia(tipoResponse);
        return tipoResponse ? `Observable<${tipoResponse}>` : "Observable<any>"
    }

    getMethodBody(pathDefinition: PathDefinition, bodyClassName?: string ): string {
        const httpMethodParams = this.getHttpMethodParameters(pathDefinition, bodyClassName)
        return `${pathDefinition.hasQueryParams ? this.getQueryParamsDeclarationTemplate(pathDefinition): ''}\
                ${pathDefinition.hasHeaderParams ? this.getHeadersParamsDeclarationTemplate(pathDefinition): ''}\
                return this.http.${this.getHttpMethodName(pathDefinition)}(${this.getHttpPath(pathDefinition)}${httpMethodParams? ', '+httpMethodParams: ''})`
    }
    getHttpMethodName(pathDefinition: PathDefinition){
        return pathDefinition.method
    }


    getHttpPath(pathDefinition: PathDefinition) {
        var partialPaths = pathDefinition.url.split('\/').filter(partialPath => partialPath);
        var url = partialPaths.map((partialPath, index) => {
            return this.getPartialPathString(partialPath)
        }).join("/");
        return url? `\`${url}\``: '';
    }

    getHttpMethodParameters(pathDefinition: PathDefinition, bodyClassName?: string): string {
        const angularIoHttpParams = this.getHttpMethodConfig(pathDefinition)
        const parameters:string[] = []
        if(bodyClassName) parameters.push(StringUtil.uperToLowerCamelCase(bodyClassName));
        if(angularIoHttpParams) parameters.push(angularIoHttpParams)
        return parameters.join()
    }
    getHttpMethodConfig(pathDefinition: PathDefinition): string{
        const angularIoHttpParams:string[] = []
        if(pathDefinition.hasQueryParams) angularIoHttpParams.push('params: queryParams')
        if(pathDefinition.hasHeaderParams) angularIoHttpParams.push('headers: headersParams')
        if(pathDefinition.hasHeaderParams || pathDefinition.hasQueryParams) return `{${angularIoHttpParams.join(',\n')}}`
        return '';
    }

    getQueryParamsAsStringfyObj(queryParams: ParameterObject[]){
        return`{${queryParams.map(queryParam => `${queryParam.name}:${queryParam.name}`).join(',\n')}}`
    }
    getPartialPathString(partialPath: string){
        const result = /\{([^}]+)}/g.exec(partialPath)
        if(result){
            return `\${${result[1]}}`
        }
        return `${partialPath}`
    }

    getNotBodyParamsNames(pathDefinition: PathDefinition): string[] {
  
        return pathDefinition
                .path
                .parameters!
                .map(parameter => {
                    // return ''
                    const variableName  = StringUtil.dashToCamelCase((parameter as ParameterObject).name)
                    const variableTipagem = TypescriptUtil.getTipagemForSchema(CoreMapper.instance.getObjectMaybeRef(parameter).schema);
                    this.adicionarEmListaReferencia(variableTipagem.replace('\[\]', ''));
                    return `${variableName}: ${variableTipagem}`;
                })
 }

    getQueryParamsDeclarationTemplate(pathDefinition: PathDefinition): string{
        const queryParams = PathMapper.getQueryParams(pathDefinition);
        return `let queryParams = new HttpParams()
            ${queryParams.map(queryParam => {
                return `.append('${queryParam.name}', ${ StringUtil.dashToCamelCase(queryParam.name)})`
            }).join('\n')};\n`
    }

    getHeadersParamsDeclarationTemplate(pathDefinition: PathDefinition): string{
        const headerParams = PathMapper.getHeaderParams(pathDefinition);
        return `let headersParams = new HttpHeaders()
            ${headerParams.map(headerParam => {
                return `.append('${headerParam.name}', ${ StringUtil.dashToCamelCase(headerParam.name)})`
            }).join('\n')};\n`
    }
}
