import { OpenAPIObject, ReferenceObject, TagObject, PathsObject, OperationObject, ParameterObject, PathItemObject, SchemaObject, ResponseObject } from "openapi3-ts";
import { CoreMapper } from "./core-mapper";
import { SchemaMapper } from "./schema-mapper";

export class PathMapper {

    tagsDefinition: TagDefinition[] = [];
    private static _instance?: PathMapper
    openApiObj: OpenAPIObject;

    private constructor(openApiObj: OpenAPIObject) {
        this.openApiObj = openApiObj;
    }

    static get instance(): PathMapper {
        if (this._instance) return this._instance;
        throw "PathMapper não inicializado"
    }

    static init(openApiObj: OpenAPIObject) {
        if (!openApiObj.tags) openApiObj.tags = [];
        this._instance = new PathMapper(openApiObj);
        this._instance.mapearTags(openApiObj);
    }

    mapearTags(openApiObj: OpenAPIObject) {
        this.tagsDefinition = openApiObj.tags!.map(({ name, description }) => {
            return {
                name,
                description,
                paths: []
            }
        })

        Object
            .keys(this.openApiObj.paths)
            .map(pathUrl => {
                const pathObj: PathItemObject = this.openApiObj.paths[pathUrl]
                const metodosDisponiveis: PathDefinitionHTTPMethod[] = Object
                    .keys(pathObj)
                    .filter(
                        key => Object
                            .values(PathDefinitionHTTPMethod)
                            .includes(key)
                    ) as PathDefinitionHTTPMethod[]
                return metodosDisponiveis.map(nomeMetodo => this.getPathDefinitionByMethod(nomeMetodo, pathUrl, pathObj))
            })
            .reduce((acm, cur) => acm.concat(...cur), [])
            .forEach(pathDefinition => {
                pathDefinition.path.tags!.forEach(tag => this.getTagByName(tag).paths.push(pathDefinition))
            })


        console.log(this.tagsDefinition)
    }

    getParameter(pathParam: (ParameterObject | ReferenceObject)) {
        return CoreMapper.instance.getObjectMaybeRef(pathParam)
    }

    getTagByName(tagName: string): TagDefinition {
        const tag = this.tagsDefinition.find(tag => tag.name === tagName)
        if (tag) return tag;
        const novaTag: TagDefinition = {
            name: tagName,
            paths: []
        }
        this.tagsDefinition.push(novaTag)
        return novaTag;
    }

    getUrlPathParameters(path: OperationObject){
        return path.parameters!.filter(parameter => (parameter as ParameterObject).in === 'path')
    }

    getSchemaOrRefFromBodyJsonParameter(path: OperationObject): SchemaObject | ReferenceObject | undefined{
        if(!path.requestBody) return;
        const requestBody = CoreMapper.instance.getObjectMaybeRef(path.requestBody);
        if(!requestBody.content || !requestBody.content['application/json']) return;
        return requestBody.content['application/json'].schema
    }

    getPathDefinitionByMethod(method: PathDefinitionHTTPMethod, url: string, paths: PathsObject): PathDefinition {
        const path: OperationObject = this.normalizarPath(paths[method])
        return {
            method,
            url,
            path: path,
            name: path ? path.operationId! : "",
            schemaResponse: this.getSchemaOrRefFromPathResponseJson(path)
        }
    }

    normalizarPath(path: OperationObject): OperationObject {
        if (!path.parameters) path.parameters = []
        if (!path.tags) path.tags = [];

        path.parameters = path.parameters.map(parameter => this.getParameter(parameter))
        return path
    }
    
    getSchemaOrRefFromPathResponseJson(path: OperationObject): SchemaObject | undefined{
        let happyResponse: ResponseObject = path.responses['200'] || path.responses['default']
        if(happyResponse){
            happyResponse = CoreMapper.instance.getObjectMaybeRef(happyResponse);
            return ((happyResponse.content || {})['application/json'] || {}).schema!
        }
    }



}

export interface PathDefinition {
    url: string
    method: PathDefinitionHTTPMethod
    path: OperationObject
    name: string,
    schemaResponse?: SchemaObject | ReferenceObject
}

export interface TagDefinition {
    name: string,
    description?: string,
    paths: PathDefinition[]
}
export enum PathDefinitionHTTPMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    OPTIONS = 'options',
    HEAD = 'head',
    PATCH = 'patch',
    TRACE = 'trace'
}