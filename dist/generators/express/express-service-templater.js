"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_types_util_1 = require("../../util/data-types-util");
const javascript_util_1 = require("../../util/languages/javascript-util");
const schema_mapper_1 = require("../../util/schema-mapper");
class ExpressServiceTemplater {
    constructor(options, tagDefinition) {
        this.options = options;
        this.tagDefinition = tagDefinition;
    }
    getFileName() {
        return `${this.tagDefinition.name}-service.js`;
    }
    getServiceTemplate() {
        return `module.exports = function(app){

            ${this.tagDefinition.paths.map(pathDefinition => this.getExpressFunctionTemplateForPath(pathDefinition)).join('\n\n')}
        }`;
    }
    getExpressFunctionTemplateForPath(pathDefinition) {
        let responseBody = pathDefinition.schemaResponse;
        let value;
        if (responseBody) {
            responseBody = schema_mapper_1.SchemaMapper.instance.getFullSchema(responseBody);
            value = javascript_util_1.JavascriptUtil.getMockedValue(responseBody, '', this.options.deepLevel || 3);
        }
        return `app.${pathDefinition.method}("${this.getExpressUrl(pathDefinition)}", (req, res, next) => {
            ${responseBody ? `const responseBody = ${JSON.stringify(value)}` : ''}
            ${responseBody ? 'res.json(responseBody)' : 'res.status(200).send()'}
        })`;
    }
    getExpressUrl(pathDefinition) {
        const pathParams = pathDefinition.path.parameters.filter(param => param.in === 'path');
        return pathDefinition.url.replace(/{([^}]+)\}/g, (allMatch, group1) => {
            const pathParam = pathParams.find(pathParam => pathParam.name === group1);
            if (pathParam && pathParam.schema) {
                if (javascript_util_1.JavascriptUtil.isNumber(data_types_util_1.DataTypesUtil.getSchemaDataType(pathParam.schema))) {
                    return ":" + group1 + "(\\\\d+)";
                }
            }
            return ":" + group1;
        }).trim();
    }
}
exports.ExpressServiceTemplater = ExpressServiceTemplater;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy1zZXJ2aWNlLXRlbXBsYXRlci5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS93aWxrZXIvcHJvamV0b3Mvb3BlbkFwaTNKc29uV3JpdGVycy9zcmMvIiwic291cmNlcyI6WyJnZW5lcmF0b3JzL2V4cHJlc3MvZXhwcmVzcy1zZXJ2aWNlLXRlbXBsYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGdFQUEyRDtBQUMzRCwwRUFBc0U7QUFDdEUsNERBQXdEO0FBRXhEO0lBRUksWUFBbUIsT0FBWSxFQUFTLGFBQTRCO1FBQWpELFlBQU8sR0FBUCxPQUFPLENBQUs7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFFLENBQUM7SUFFdkUsV0FBVztRQUNQLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxDQUFBO0lBQ2xELENBQUM7SUFFRCxrQkFBa0I7UUFFZCxPQUFPOztjQUdDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3RIO1VBQ0YsQ0FBQTtJQUNOLENBQUM7SUFFRCxpQ0FBaUMsQ0FBQyxjQUE4QjtRQUM1RCxJQUFJLFlBQVksR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFBO1FBQ2hELElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBRyxZQUFZLEVBQUM7WUFDWixZQUFZLEdBQUcsNEJBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2pFLEtBQUssR0FBRyxnQ0FBYyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3hGO1FBQ0QsT0FBTyxPQUFPLGNBQWMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUM7Y0FDbkUsWUFBWSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO2NBQ25FLFlBQVksQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUEsQ0FBQyxDQUFDLHdCQUF3QjtXQUNyRSxDQUFBO0lBQ1AsQ0FBQztJQUVELGFBQWEsQ0FBQyxjQUE4QjtRQUN4QyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBRSxLQUF5QixDQUFDLEVBQUUsS0FBSyxNQUFNLENBQXNCLENBQUM7UUFDbEksT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbEUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDMUUsSUFBRyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBQztnQkFDN0IsSUFBRyxnQ0FBYyxDQUFDLFFBQVEsQ0FBQywrQkFBYSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO29CQUMzRSxPQUFPLEdBQUcsR0FBQyxNQUFNLEdBQUMsVUFBVSxDQUFBO2lCQUMvQjthQUNKO1lBQ0QsT0FBUyxHQUFHLEdBQUMsTUFBTSxDQUFBO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2IsQ0FBQztDQUVKO0FBNUNELDBEQTRDQyJ9