export class StringUtil {
    static dashToCamelCase(string: string): string {
        return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }
    static dashToUpperCamelCase(string: string): string {
        const camelCase = StringUtil.dashToCamelCase(string)
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    }
    static camelCaseToDash(string: string): string {
        return string.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase()
    }

    static uperToLowerCamelCase(camelCase: string): string {
        return camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
    }
}