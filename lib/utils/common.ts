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
