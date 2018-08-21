import { Command, CommandOptions } from "commander";
import { OpenAPIObject } from "openapi3-ts";
export interface CommandConfigurator {
    customConfig?(commander: Command): Command;
    action(options: any, ...args:any[]): any;
    comando: string;
    alias?: string;
    description: string;
    options?: CommandOptions;
    flags?: CommandFlagConfig[]
    
}

export interface CommandFlagConfig {
    name: string,
    description: string,
    parser?: (v1:any, v2:any) => any | RegExp
    defaultValue?: any
}