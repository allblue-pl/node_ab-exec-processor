export type ExecPreset = {
    name: string;
    aliases?: Array<string>,
    default?: boolean,
    required?: boolean,
    values?: Array<string>,
    defaultValue?: string,
}