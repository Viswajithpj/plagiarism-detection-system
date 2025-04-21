"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void
  acceptedFileTypes?: string
}

export default function FileUploader({ onFilesUploaded, acceptedFileTypes = "*" }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesUploaded(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesUploaded(Array.from(e.target.files))
      // Reset the input value so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-slate-400 bg-slate-50" : "border-slate-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
        accept={acceptedFileTypes}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-slate-100 rounded-full">
          <Upload className="h-6 w-6 text-slate-500" />
        </div>
        <div>
          <p className="text-lg font-medium">Drag and drop files here</p>
          <p className="text-sm text-slate-500 mt-1">or click to browse from your computer</p>
        </div>
        <Button variant="outline" onClick={handleButtonClick} className="mt-2">
          Select Files
        </Button>
        <p className="text-xs text-slate-400 mt-2">Accepted file types: {acceptedFileTypes || "All files"}</p>
      </div>
    </div>
  )
}
