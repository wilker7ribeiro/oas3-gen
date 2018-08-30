"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_mapper_1 = require("./core-mapper");
class PathMapper {
    constructor(openApiObj) {
        this.tagsDefinition = [];
        this.openApiObj = openApiObj;
    }
    static get instance() {
        if (this._instance)
            return this._instance;
        throw "PathMapper não inicializado";
    }
    static init(openApiObj) {
        if (!openApiObj.tags)
            openApiObj.tags = [];
        this._instance = new PathMapper(openApiObj);
        this._instance.mapearTags(openApiObj);
    }
    mapearTags(openApiObj) {
        this.tagsDefinition = openApiObj.tags.map(({ name, description }) => {
            return {
                name,
                description,
                paths: []
            };
        });
        Object
            .keys(this.openApiObj.paths)
            .map(pathUrl => {
            const pathObj = this.openApiObj.paths[pathUrl];
            const metodosDisponiveis = Object
                .keys(pathObj)
                .filter(key => Object
                .values(PathDefinitionHTTPMethod)
                .includes(key));
            return metodosDisponiveis.map(nomeMetodo => this.getPathDefinitionByMethod(nomeMetodo, pathUrl, pathObj));
        })
            .reduce((acm, cur) => acm.concat(...cur), [])
            .forEach(pathDefinition => {
            if (pathDefinition.path.tags.length) {
                pathDefinition.path.tags.forEach(tag => this.getOrCreateTagByName(tag).paths.push(pathDefinition));
            }
            else {
                this.getOrCreateTagByName('DefaultNoTag').paths.push(pathDefinition);
            }
        });
    }
    getParameter(pathParam) {
        return core_mapper_1.CoreMapper.instance.getObjectMaybeRef(pathParam);
    }
    getOrCreateTagByName(tagName) {
        const tag = this.tagsDefinition.find(tag => tag.name === tagName);
        if (tag)
            return tag;
        return this.createTag(tagName);
    }
    createTag(tagName) {
        const novaTag = {
            name: tagName,
            paths: []
        };
        this.tagsDefinition.push(novaTag);
        return novaTag;
    }
    getUrlPathParameters(path) {
        return path.parameters.filter(parameter => parameter.in === 'path');
    }
    getSchemaOrRefFromBodyJsonParameter(path) {
        if (!path.requestBody)
            return;
        const requestBody = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(path.requestBody);
        if (!requestBody.content || !this.getResponseContent(requestBody.content))
            return;
        return (this.getResponseContent(requestBody.content) || {}).schema;
    }
    getPathDefinitionByMethod(method, url, paths) {
        const path = this.normalizarPath(paths[method]);
        return {
            method,
            url,
            path: path,
            name: path ? path.operationId : "",
            schemaResponse: this.getSchemaOrRefFromPathResponseJson(path),
            hasHeaderParams: path.parameters.some(param => param.in === 'header'),
            hasQueryParams: path.parameters.some(param => param.in === 'query'),
            hasCookieParams: path.parameters.some(param => param.in === 'cookie')
        };
    }
    normalizarPath(path) {
        if (!path.parameters)
            path.parameters = [];
        if (!path.tags)
            path.tags = [];
        path.parameters = path.parameters.map(parameter => this.getParameter(parameter));
        return path;
    }
    getSchemaOrRefFromPathResponseJson(path) {
        let happyResponse = path.responses['200'] || path.responses['default'];
        if (happyResponse) {
            happyResponse = core_mapper_1.CoreMapper.instance.getObjectMaybeRef(happyResponse);
            return (this.getResponseContent(happyResponse.content || {}) || {}).schema;
        }
    }
    getResponseContent(content) {
        if (content['application/json'])
            return content['application/json'];
        if (content['*/*'])
            return content['*/*'];
    }
    static getQueryParams(pathDefinition) {
        return pathDefinition.path.parameters.filter(param => param.in === 'query');
    }
    static getCookieParams(pathDefinition) {
        return pathDefinition.path.parameters.filter(param => param.in === 'cookie');
    }
    static getHeaderParams(pathDefinition) {
        return pathDefinition.path.parameters.filter(param => param.in === 'header');
    }
}
exports.PathMapper = PathMapper;
var PathDefinitionHTTPMethod;
(function (PathDefinitionHTTPMethod) {
    PathDefinitionHTTPMethod["GET"] = "get";
    PathDefinitionHTTPMethod["POST"] = "post";
    PathDefinitionHTTPMethod["PUT"] = "put";
    PathDefinitionHTTPMethod["DELETE"] = "delete";
    PathDefinitionHTTPMethod["OPTIONS"] = "options";
    PathDefinitionHTTPMethod["HEAD"] = "head";
    PathDefinitionHTTPMethod["PATCH"] = "patch";
    PathDefinitionHTTPMethod["TRACE"] = "trace";
})(PathDefinitionHTTPMethod = exports.PathDefinitionHTTPMethod || (exports.PathDefinitionHTTPMethod = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC1tYXBwZXIuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsidXRpbC9wYXRoLW1hcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUEyQztBQUczQztJQU1JLFlBQW9CLFVBQXlCO1FBSjdDLG1CQUFjLEdBQW9CLEVBQUUsQ0FBQztRQUtqQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsTUFBTSxLQUFLLFFBQVE7UUFDZixJQUFJLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFDLE1BQU0sNkJBQTZCLENBQUE7SUFDdkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBeUI7UUFDakMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1lBQUUsVUFBVSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQXlCO1FBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ2pFLE9BQU87Z0JBQ0gsSUFBSTtnQkFDSixXQUFXO2dCQUNYLEtBQUssRUFBRSxFQUFFO2FBQ1osQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTTthQUNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzthQUMzQixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDWCxNQUFNLE9BQU8sR0FBbUIs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