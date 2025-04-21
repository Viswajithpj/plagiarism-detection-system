"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload, FileText } from "lucide-react"
import { useEffect } from "react"
import { coursesAPI, assignmentsAPI } from "@/lib/api"

export default function UploadAssignmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    student_name: "",
    student_id: "",
    submission_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await coursesAPI.getCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    if (!formData.course) {
      setError("Please select a course")
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", selectedFile)
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("course", formData.course)
      formDataToSend.append("student_name", formData.student_name)
      formDataToSend.append("student_id", formData.student_id)
      formDataToSend.append("submission_date", formData.submission_date)

      const response = await assignmentsAPI.uploadAssignment(formDataToSend)

      // Redirect to the assignment page or dashboard
      router.push(`/dashboard/assignments/${response.id}`)
    } catch (error: any) {
      console.error("Error uploading assignment:", error)
      setError(error.message || "Failed to upload assignment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Assignment</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Upload a document to check for plagiarism</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Research Paper on Climate Change"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the assignment"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleSelectChange("course", value)}
                disabled={isLoadingCourses}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_name">Student Name</Label>
                <Input
                  id="student_name"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                  placeholder="Full name of student"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  placeholder="Student ID number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission_date">Submission Date</Label>
              <Input
                id="submission_date"
                name="submission_date"
                type="date"
                value={formData.submission_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Document</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-6 w-6 text-slate-500" />
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="file" className="cursor-pointer block">
                    <Upload className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="mt-2 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500 mt-1">PDF, DOC, DOCX, or TXT (Max 10MB)</p>
                  </label>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? "Uploading..." : "Upload Assignment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
