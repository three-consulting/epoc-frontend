import { FieldMetadata } from "@/lib/types/typeMetadata"

export const checkTestRequestBodyRequiredFields = (
    data: object,
    fieldMetadata: Record<string, FieldMetadata>
) => {
    const mockRequestFields = Object.keys(data)
    const metadataFields = Object.keys(fieldMetadata)
    const requiredFields = metadataFields.filter(
        (item) => fieldMetadata[item].required === true
    )
    return requiredFields.every((val) => mockRequestFields.includes(val))
}
