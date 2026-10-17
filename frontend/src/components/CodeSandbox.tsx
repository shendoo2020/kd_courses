"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Check, RefreshCw, XCircle } from "lucide-react";

interface CodeSandboxProps {
  initialCode?: string;
  language?: string;
  testAssertions?: { input: string; expectedOutput: string }[];
}

export default function CodeSandbox({ 
  initialCode = "def greet(name):\n    # Write your code here\n    pass\n\nprint(greet('KLZ Scholar'))", 
  language = "python",
  testAssertions
}: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: number, total: number, message: string } | null>(null);

  // Simulated code execution for prototype (In production, use Pyodide or secure backend execution API)
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    setTestResults(null);
    
    setTimeout(() => {
      if (language === "python") {
        if (code.includes("def greet") && code.includes("return")) {
          const match = code.match(/return\s+['"](.*)['"]\s*\+\s*name/);
          if (match || code.includes("f\"Hello {name}\"") || code.includes("'Hello ' + name")) {
            setOutput("Hello KLZ Scholar\n\n[Execution complete with exit code 0]");
            if (testAssertions) {
              setTestResults({ passed: testAssertions.length, total: testAssertions.length, message: "All test cases passed!" });
            }
          } else {
            setOutput("None\n\n[Execution complete with exit code 0]");
          }
        } else {
          setOutput("SyntaxError: unexpected EOF while parsing");
          if (testAssertions) {
            setTestResults({ passed: 0, total: testAssertions.length, message: "Syntax error in code." });
          }
        }
      } else {
        setOutput("[Execution simulation not configured for this language]");
      }
      setIsRunning(false);
    }, 1200);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
    setTestResults(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col bg-slate-900 shadow-xl my-6">
      
      {/* Sandbox Header */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 ml-2 bg-slate-800 px-2 py-0.5 rounded">
            main.{language === "python" ? "py" : "js"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            title="Reset code"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors disabled:opacity-50"
          >
            {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-96">
        {/* Editor Area */}
        <div className="h-full border-r border-slate-800">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </div>

        {/* Console / Output Area */}
        <div className="h-full bg-[#1e1e1e] p-4 font-mono text-xs overflow-y-auto flex flex-col">
          <div className="text-slate-500 mb-2">Terminal Output</div>
          <div className="flex-grow whitespace-pre-wrap text-slate-300">
            {output || <span className="text-slate-600 italic">No output yet. Click 'Run Code' to execute.</span>}
          </div>

          {/* Test Results Banner */}
          {testResults && (
            <div className={`mt-4 p-3 rounded-lg border ${
              testResults.passed === testResults.total 
                ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400' 
                : 'bg-rose-950/40 border-rose-900 text-rose-400'
            }`}>
              <div className="flex items-center gap-2 mb-1 font-bold">
                {testResults.passed === testResults.total ? <Check size={14} /> : <XCircle size={14} />}
                Test Results: {testResults.passed} / {testResults.total} passed
              </div>
              <div className="text-[10px] opacity-80">{testResults.message}</div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
