"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringUtil {
    static dashToCamelCase(string) {
        return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }
    static dashToUpperCamelCase(string) {
        const camelCase = StringUtil.dashToCamelCase(string);
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    }
    static camelCaseToDash(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    static uperToLowerCamelCase(camelCase) {
        return camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
    }
}
exports.StringUtil = StringUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLXV0aWwuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd2lsa2VyL3Byb2pldG9zL29wZW5BcGkzSnNvbldyaXRlcnMvc3JjLyIsInNvdXJjZXMiOlsidXRpbC9zdHJpbmctdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFjO1FBQ2pDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQ0QsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQWM7UUFDdEMsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNwRCxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFjO1FBQ2pDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsRUFBRSxPQUFPLENBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUNyRSxDQUFDO0lBRUQsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQWlCO1FBQ3pDLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Q0FDSjtBQWZELGdDQWVDIn0=