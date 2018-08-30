"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoreMapper {
    constructor(openApiObj) {
        this.openApiObj = openApiObj;
    }
    static get instance() {
        if (this._instance)
            return this._instance;
        throw "CoreMapper não inicializado";
    }
    static init(openApiObj) {
        if (!openApiObj.tags)
            openApiObj.tags = [];
        this._instance = new CoreMapper(openApiObj);
    }
    getObjectMaybeRef(obj) {
        if (CoreMapper.isReference(obj))
            return this.getJsonPathValue(CoreMapper.getReferemce(obj));
        return obj;
    }
    static getNameFromReferenceIfExists(obj) {
        if (!obj)
            return "";
        if (CoreMapper.isReference(obj))
            return CoreMapper.getNameFromReference(obj['$ref']);
        return "";
    }
    static getNameFromReference(string) {
        const strings = string.split("\/");
        return strings[strings.length - 1];
    }
    static isReference(obj) {
        return '$ref' in obj;
    }
    static getReferemce(obj) {
        return obj['$ref'];
    }
    getJsonPathValue(string) {
        const paths = string.split("\/");
        let value = this.openApiObj;
        paths.forEach(path => {
            if (path === '#') {
                value = this.openApiObj;
            }
            else {
                value = value[path];
            }
        });
        return value;
    }
}
exports.CoreMapper = CoreMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS1tYXBwZXIuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsidXRpbC9jb3JlLW1hcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBO0lBS0ksWUFBb0IsVUFBeUI7UUFDekMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU0sS0FBSyxRQUFRO1FBQ2YsSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQyxNQUFNLDZCQUE2QixDQUFBO0lBQ3ZDLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXlCO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtZQUFFLFVBQVUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUlELGlCQUFpQixDQUFJLEdBQXdCO1FBQ3pDLElBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUYsT0FBTyxHQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyw0QkFBNEIsQ0FBSSxHQUF5QjtRQUM1RCxJQUFHLENBQUMsR0FBRztZQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ25CLElBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFBRSxPQUFPLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBRSxHQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3RixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDRCxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBYztRQUN0QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXLENBQUksR0FBd0I7UUFDMUMsT0FBTyxNQUFNLElBQUssR0FBVyxDQUFDO0lBQ2xDLENBQUM7SUFHRCxNQUFNLENBQUMsWUFBWSxDQUFJLEdBQXdCO1FBQzNDLE9BQVEsR0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQy9CLENBQUM7SUFFRCxnQkFBZ0IsQ0FBSSxNQUFjO1FBQzlCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxLQUFLLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pCLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtnQkFDZCxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUMzQjtpQkFBTTtnQkFDSCxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3RCO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBRUo7QUExREQsZ0NBMERDIn0=