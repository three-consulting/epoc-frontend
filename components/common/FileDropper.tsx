import React, { useState } from "react"
import { useDropzone } from "react-dropzone"

interface IFileDropper {
    onDrop: <T extends File>(file: T[]) => void
}

const FileDropper = ({ onDrop }: IFileDropper): JSX.Element => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    const [isHover, setIsHover] = useState<boolean>(false)

    return (
        <div
            style={{
                borderColor: "grey",
                borderWidth: 1,
                borderRadius: 15,
                padding: "2rem",
                cursor: "pointer",
                backgroundColor: `${
                    isHover ? "rgba(130, 130, 130, 0.1)" : "white"
                }`,
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>{"Drop the files here.."}</p>
            ) : (
                <p>{"Drag and drop a file here, or click to select a file"}</p>
            )}
        </div>
    )
}

export default FileDropper
