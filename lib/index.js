export class abExecProcessor_Class {
    constructor() {
    }
    process(args, offset, presets) {
        let argValues = {};
        let args_Used = [];
        for (let preset of presets) {
            if (preset.aliases === undefined)
                preset.aliases = [];
            if (preset.default === undefined)
                preset.default = true;
            if (preset.required === undefined)
                preset.required = true;
            for (let i = offset; i < args.length; i++) {
                if (preset.aliases.includes(args[i])) {
                    args_Used.push(i);
                    if (i + 1 < args.length) {
                        argValues[preset.name] = args[i + 1];
                        args_Used.push(i + 1);
                    }
                }
            }
        }
        for (let i = offset; i < args.length; i++) {
            if (args_Used.includes(i))
                continue;
            for (let preset of presets) {
                if (preset.name in argValues)
                    continue;
                if (preset.default) {
                    argValues[preset.name] = args[i];
                    args_Used.push(i);
                    break;
                }
            }
        }
        for (let preset of presets) {
            if (!(preset.name in argValues)) {
                if (preset.defaultValue !== undefined)
                    argValues[preset.name] = preset.defaultValue;
            }
            if (argValues[preset.name] === undefined && preset.required) {
                console.error(`Arg '${preset.name}' info: `, preset);
                throw new Error(`Arg '${preset.name}' not set.`);
            }
            if (preset.values !== undefined) {
                if (!preset.values.includes(argValues[preset.name])) {
                    throw new Error(`Wrong arg '${preset.name}' value '${argValues[preset.name]}'.` +
                        ` Available: ` + preset.values.join(', '));
                }
            }
        }
        for (let i = offset; i < args.length; i++) {
            if (!args_Used.includes(i)) {
                throw new Error(`Unknown arg at index '${i}': '${args[i]}'.`);
            }
        }
        return new abExecProcessor_Args(argValues);
    }
    runAsync(asyncFn) {
        console.log('ABExecProcessor: Running async function...');
        asyncFn()
            .then(() => {
            console.log('ABExecProcessor: Done running async function.');
        })
            .catch((err) => {
            console.error('ABExecProcessor: Error running async function.');
            console.error(err.stack);
        });
    }
}
const abExecProcessor = new abExecProcessor_Class();
export default abExecProcessor;
class abExecProcessor_Args {
    get valid() {
        return true;
    }
    #argValues;
    constructor(argValues) {
        this.#argValues = argValues;
    }
    $(argName) {
        if (!this.isSet(argName))
            throw new Error(`Arg '${argName}' not set.`);
        return this.#argValues[argName];
    }
    isSet(argName) {
        if (!(argName in this.#argValues)) {
            throw new Error(`Arg '${argName}' not defined.`);
        }
        return this.#argValues[argName] !== undefined;
    }
    log() {
        for (let argName in this.#argValues)
            console.log(` - ${argName}: ${this.#argValues[argName]}`);
    }
}
