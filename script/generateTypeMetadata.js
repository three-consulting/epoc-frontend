// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require("readline")

// eslint-disable-next-line id-length
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
})

const fieldToMetadata = (field, required) =>
    `${field}: {required: ${required.includes(field)}}`

const schemaToString = (type, schema) => {
    const fields = Object.keys(schema.properties)
    const { required } = schema
    const fieldMetadata = `export const ${type.toLowerCase()}FieldMetadata: Record<string, FieldMetadata> = {${fields
        .map((field) => `${fieldToMetadata(field, required)}`)
        .join(", ")}}`

    return `${fieldMetadata}`
}

rl.on("line", (data) => {
    const schema = JSON.parse(data)
    const types = schema.components.schemas
    const type = "ProjectDTO"
    const out = `
  export type FieldMetadata = { required: boolean }

  ${schemaToString(type.replace("DTO", ""), types[type])}`
    // eslint-disable-next-line no-console
    console.log(out)
})
