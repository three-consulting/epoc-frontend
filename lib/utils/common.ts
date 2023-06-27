import { isError } from "lodash"
import { parse } from "csv-parse/sync"
import { TimesheetEntry } from "../types/apiTypes"
import { DateTime } from "luxon"

export const downloadFile = (blob: Blob, fileName: string) => {
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    if (link.parentElement) {
        link.parentElement.removeChild(link)
    }
}

export const parseCsv = (
    input: Buffer | string,
    errorHandler: (err: Error) => void,
    delimiter?: string,
    encoding?: BufferEncoding
): Array<object> => {
    try {
        const parsedCsv = parse(input, {
            delimiter: delimiter || ",",
            columns: true,
            skipEmptyLines: true,
            encoding: encoding || "utf-8",
        })

        return parsedCsv
    } catch (err) {
        if (isError(err)) {
            errorHandler(err)
        }
    }

    return []
}

export const parseQuantity = (
    quantity: unknown
): TimesheetEntry["quantity"] => {
    if (typeof quantity === "string") {
        const indexOfComma = quantity.indexOf(",")
        if (indexOfComma > -1) {
            return parseFloat(quantity.replace(",", "."))
        }
        return parseFloat(quantity)
    }
    throw new Error("Quantity can't be parsed")
}

export const functionCompose =
    <T>(fs: ((t: T) => T)[]): ((t: T) => T) =>
    (t: T) =>
        fs.reduce((acc, f) => f(acc), t)

export const getDayAndMonth = (datetime: DateTime) =>
    `${datetime.day}.${datetime.month}.`

export const yyyymmddToDateTime = (yyyymmdd: string) =>
    DateTime.fromFormat(yyyymmdd, "yyyy-MM-dd")
