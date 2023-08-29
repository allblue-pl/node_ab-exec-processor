'use strict';

const
    js0 = require('js0')
;


class abExecProcessor_Class
{

    constructor()
    {

    }

    process(args, offset, presets)
    {
        js0.args(arguments, 'object', js0.Int, js0.Iterable(js0.Preset({
            name: 'string',
            aliases: [ js0.Iterable('string'), js0.Default([]) ],
            default: [ 'boolean', js0.Default(true) ],
            required: [ 'boolean', js0.Default(true) ],
            values: [ js0.Iterable('string'), js0.Null, js0.Default(null) ],
            defaultValue: [ null, js0.Default(js0.NotSet) ],
        })));

        let argValues = {};
        let args_Used = [];

        for (let preset of presets) {
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
                argValues[preset.name] = preset.defaultValue;
            }

            if (argValues[preset.name] === js0.NotSet && preset.required) {
                throw new Error(`Arg '${preset.name}' not set.`);
            }

            if (preset.values !== null) {
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

    runAsync(asyncFn)
    {
        js0.args(arguments, 'function');

        console.log('ABExecProcessor: Running async function...');

        let asyncFn_Result = asyncFn();
        if (!js0.type(asyncFn_Result, Promise))
            throw Error(`'asyncFn' is not asynchronous.`);

        asyncFn_Result
            .then(() => {
                console.log('ABExecProcessor: Done running async function.');
            })
            .catch((e) => {
                console.error('ABExecProcessor: Error running async function.');
                console.error(e.stack);
            });
    }

}

class abExecProcessor_Args
{

    get valid() {
        return true;
    }


    constructor(argValues)
    {
        this._argValues = argValues;
    }

    $(argName)
    {
        if (!this.isSet(argName))
            throw new Error(`Arg '${argName}' not set.`);

        return this._argValues[argName];
    }

    isSet(argName)
    {
        if (!(argName in this._argValues)) {
            throw new Error(`Arg '${argName}' not defined.`);
        }

        return this._argValues[argName] !== js0.NotSet;
    }

    log()
    {
        for (let argName in this._argValues)
            console.log(` - ${argName}: ${this._argValues[argName]}`);
    }

}

module.exports = new abExecProcessor_Class();