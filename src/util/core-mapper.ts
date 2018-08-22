import { OpenAPIObject, ReferenceObject } from "openapi3-ts";
export class CoreMapper {

    private static _instance?: CoreMapper
    openApiObj: OpenAPIObject;

    private constructor(openApiObj: OpenAPIObject) {
        this.openApiObj = openApiObj;
    }

    static get instance(): CoreMapper {
        if (this._instance) return this._instance;
        throw "CoreMapper não inicializado"
    }

    static init(openApiObj: OpenAPIObject) {
        if (!openApiObj.tags) openApiObj.tags = [];
        this._instance = new CoreMapper(openApiObj);
    }


    
    getObjectMaybeRef<T>(obj: T | ReferenceObject): T{
        if(CoreMapper.isReference(obj)) return this.getJsonPathValue<T>(CoreMapper.getReferemce(obj));
        return obj as T;
    }

    static getNameFromReferenceIfExists<T>(obj?: T | ReferenceObject): string{
        if(!obj) return "";
        if(CoreMapper.isReference(obj)) return CoreMapper.getNameFromReference((obj as any)['$ref']);
        return "";
    }
    static getNameFromReference(string: string) {
        const strings = string.split("\/");
        return strings[strings.length - 1];
    }

    static isReference<T>(obj: T | ReferenceObject): boolean{
        return '$ref' in (obj as any);
    }
    

    static getReferemce<T>(obj: T | ReferenceObject): string{
        return (obj as any)['$ref']
    }

    getJsonPathValue<T>(string: string): T {
        const paths = string.split("\/");
        let value: any = this.openApiObj;
        paths.forEach(path => {
            if (path === '#') {
                value = this.openApiObj;
            } else {
                value = value[path]
            }
        })
        return value;
    }

}