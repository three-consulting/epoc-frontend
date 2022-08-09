// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require("readline")

// eslint-disable-next-line id-length
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
})

const dataTransferObects = [
    "CustomerDTO", "EmployeeDTO", "ProjectDTO",
    "TimesheetDTO", "TaskDTO", "TimeCategoryDTO", "TimesheetEntryDTO"
]

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

function GenerateFields(DTO) {
    rl.on("line", (data) => {
        const schema = JSON.parse(data)
        const types = schema.components.schemas
        const type = DTO
        const out = `
    
      ${schemaToString(type.replace("DTO", ""), types[type])}`
        // eslint-disable-next-line no-console
        console.log(out)
    })
}

// eslint-disable-next-line no-console
rl.on("line", () => console.log(`export type FieldMetadata = { required: boolean }`))

const writeFields = () => {
    dataTransferObects.map((data) => (GenerateFields(data)))
}

writeFields()
