import PlagiarismChecker from "@/components/plagiarism-checker"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">PlagiarismDetect</h1>
          <p className="text-sm">Academic integrity verification tool</p>
        </div>
      </header>

      <div className="flex-1 container mx-auto p-4 md:p-8">
        <PlagiarismChecker />
      </div>

      <footer className="bg-slate-100 p-4 text-center text-slate-600 text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} PlagiarismDetect - All rights reserved
        </div>
      </footer>
    </main>
  )
}
