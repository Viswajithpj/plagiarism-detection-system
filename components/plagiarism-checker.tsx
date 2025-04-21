"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Info, FileText, AlertTriangle } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import ResultsTable from "@/components/results-table"

export default function PlagiarismChecker() {
  const [activeTab, setActiveTab] = useState("upload")
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please upload at least one file to check")
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      // In a real application, you would send the files to your Django backend
      // For demo purposes, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate results
      const mockResults = files.map((file) => ({
        filename: file.name,
        size: file.size,
        plagiarismScore: Math.floor(Math.random() * 100),
        matches: [
          {
            source: "Internet Source",
            similarity: Math.floor(Math.random() * 100),
            url: "https://example.com/source1",
          },
          {
            source: "Student Database",
            similarity: Math.floor(Math.random() * 100),
            url: null,
          },
        ],
      }))

      setResults(mockResults)
      setActiveTab("results")
    } catch (err) {
      setError("An error occurred while processing your files. Please try again.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Plagiarism Checker</CardTitle>
        <CardDescription>Upload student assignments to check for plagiarism</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="results" disabled={results.length === 0}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 mt-4">
              <FileUploader onFilesUploaded={handleFileUpload} acceptedFileTypes=".pdf,.doc,.docx,.txt" />

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Uploaded Files ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-slate-500 mr-2" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results">
            {results.length > 0 ? (
              <ResultsTable results={results} />
            ) : (
              <div className="text-center py-8">
                <p>No results to display. Upload and check files first.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-slate-500">
          <Info className="h-4 w-4 mr-1" />
          <span>Files are processed securely and confidentially</span>
        </div>
        {activeTab === "upload" && (
          <Button onClick={handleSubmit} disabled={isProcessing || files.length === 0}>
            {isProcessing ? (
              <>
                <span className="mr-2">Processing</span>
                <Progress value={45} className="w-20 h-2" />
              </>
            ) : (
              <>Check for Plagiarism</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
