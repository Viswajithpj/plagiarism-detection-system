"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, AlertTriangle, CheckCircle } from "lucide-react"

interface Match {
  source: string
  similarity: number
  url: string | null
}

interface Result {
  filename: string
  size: number
  plagiarismScore: number
  matches: Match[]
}

interface ResultsTableProps {
  results: Result[]
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)

  const getPlagiarismSeverity = (score: number) => {
    if (score < 20) return { label: "Low", color: "bg-green-100 text-green-800" }
    if (score < 50) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { label: "High", color: "bg-red-100 text-red-800" }
  }

  const handleViewDetails = (result: Result) => {
    setSelectedResult(result)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Plagiarism Score</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => {
            const severity = getPlagiarismSeverity(result.plagiarismScore)

            return (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-slate-400" />
                  {result.filename}
                </TableCell>
                <TableCell>{(result.size / 1024).toFixed(2)} KB</TableCell>
                <TableCell>{result.plagiarismScore}%</TableCell>
                <TableCell>
                  <Badge className={severity.color}>{severity.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(result)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              {selectedResult?.filename}
            </DialogTitle>
            <DialogDescription>Plagiarism detection results and source matches</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
              <div>
                <h3 className="font-medium">Overall Plagiarism Score</h3>
                <p className="text-sm text-slate-500">Based on content analysis and source matching</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{selectedResult?.plagiarismScore}%</div>
                <Badge className={getPlagiarismSeverity(selectedResult?.plagiarismScore || 0).color}>
                  {getPlagiarismSeverity(selectedResult?.plagiarismScore || 0).label} Risk
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Matched Sources</h3>
              {selectedResult?.matches.length === 0 ? (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p>No significant matches found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedResult?.matches.map((match, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{match.source}</h4>
                          {match.url && (
                            <a
                              href={match.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 flex items-center mt-1"
                            >
                              View Source <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                        <Badge className={getPlagiarismSeverity(match.similarity).color}>
                          {match.similarity}% Match
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-50 p-4 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Important Note</h4>
                <p className="text-sm text-amber-700">
                  This is an automated analysis. Results should be reviewed manually for context and accuracy. Some
                  matches may be coincidental or represent common phrases.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
