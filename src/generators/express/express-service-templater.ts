import { TagDefinition, PathDefinition, PathMapper, PathDefinitionHTTPMethod } from "../../util/path-mapper";
import { StringUtil } from "../../util/string-util";
import { ParameterObject } from "openapi3-ts";
import { DataTypesUtil } from "../../util/data-types-util";
import { JavascriptUtil } from "../../util/languages/javascript-util";
import { SchemaMapper } from "../../util/schema-mapper";

export class ExpressServiceTemplater {

    constructor(public options: any, public tagDefinition: TagDefinition){}

    getFileName(): string {
        return `${this.tagDefinition.name}-service.js`
    }

    getServiceTemplate() {

        return `module.exports = function(app){

            ${
                this.tagDefinition.paths.map(pathDefinition => this.getExpressFunctionTemplateForPath(pathDefinition)).join('\n\n')
            }
        }`
    }

    getExpressFunctionTemplateForPath(pathDefinition: PathDefinition) {
        let responseBody = pathDefinition.schemaResponse
        let value;
        if(responseBody){
            responseBody = SchemaMapper.instance.getFullSchema(responseBody);
            value = JavascriptUtil.getMockedValue(responseBody, '', this.options.deepLevel || 3);
        }
        return `app.${pathDefinition.method}("${this.getExpressUrl(pathDefinition)}", (req, res, next) => {
            ${ responseBody ? `const responseBody = ${JSON.stringify(value)}` : ''}
            ${ responseBody ? 'res.json(responseBody)': 'res.status(200).send()'}
        })`
    }

    getExpressUrl(pathDefinition: PathDefinition){
        const pathParams = pathDefinition.path.parameters!.filter(param => (param as ParameterObject).in === 'path') as ParameterObject[];
        return pathDefinition.url.replace(/{([^}]+)\}/g, (allMatch, group1) => {
            const pathParam = pathParams.find(pathParam => pathParam.name === group1);
            if(pathParam && pathParam.schema){
                if(JavascriptUtil.isNumber(DataTypesUtil.getSchemaDataType(pathParam.schema)) ){
                    return ":"+group1+"(\\\\d+)"
                }
            }
            return   ":"+group1
        }).trim()
    }

}