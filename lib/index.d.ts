import type { ExecPreset } from "./ts-types.ts";
export declare class abExecProcessor_Class {
    constructor();
    process(args: Array<string>, offset: number, presets: Array<ExecPreset>): abExecProcessor_Args;
    runAsync(asyncFn: () => Promise<void>): void;
}
declare const abExecProcessor: abExecProcessor_Class;
export default abExecProcessor;
declare class abExecProcessor_Args {
    #private;
    get valid(): boolean;
    constructor(argValues: {
        [name: string]: string | undefined;
    });
    $(argName: string): string | undefined;
    isSet(argName: string): boolean;
    log(): void;
}
//# sourceMappingURL=index.d.ts.map