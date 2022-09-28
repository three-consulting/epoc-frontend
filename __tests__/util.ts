import { FieldMetadata } from "@/lib/types/typeMetadata"

export const checkTestRequestBodyRequiredFields = (
    data: object | object[],
    fieldMetadata: Record<string, FieldMetadata>
) => {
    const mockRequestFields = Object.keys(Array.isArray(data) ? data[0] : data)
    const metadataFields = Object.keys(fieldMetadata)
    const requiredFields = metadataFields.filter(
        (item) => fieldMetadata[item].required === true
    )
    return requiredFields.every((val) => mockRequestFields.includes(val))
}
