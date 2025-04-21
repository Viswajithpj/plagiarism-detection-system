"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    re_password: "",
    first_name: "",
    last_name: "",
    institution: "",
    department: "",
    is_teacher: true,
  })
  const [error, setError] = useState<string | null>(null)
  const { register, isLoading } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.re_password) {
      setError("Passwords do not match")
      return
    }

    try {
      await register(formData)
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Enter your details to register</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="re_password">Confirm Password</Label>
              <Input
                id="re_password"
                name="re_password"
                type="password"
                value={formData.re_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" name="institution" value={formData.institution} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" value={formData.department} onChange={handleChange} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_teacher"
              name="is_teacher"
              checked={formData.is_teacher}
              onCheckedChange={(checked) => setFormData({ ...formData, is_teacher: checked as boolean })}
            />
            <Label htmlFor="is_teacher">I am a teacher/professor</Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-slate-700 hover:text-slate-900">
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
