"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface InteractiveLessonPlayerProps {
  lessonTitle: string;
  content: string;
  onCompleteLesson?: () => void;
  isCompleted?: boolean;
}

// Interactive Component 1: Before & After Prompt Comparison Sandbox
export const PromptComparisonWidget: React.FC<{
  badPrompt: string;
  badOutput: string;
  goodPrompt: string;
  goodOutput: string;
  explanation: string;
}> = ({ badPrompt, badOutput, goodPrompt, goodOutput, explanation }) => {
  const [activeTab, setActiveTab] = useState<"bad" | "good">("bad");

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-1.5 gap-2">
        <button
          onClick={() => setActiveTab("bad")}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "bad"
              ? "bg-red-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <span>❌ Weak Prompt</span>
        </button>
        <button
          onClick={() => setActiveTab("good")}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "good"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <span>✅ Engineered Prompt</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {activeTab === "bad" ? (
          <div>
            <div className="mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Input Prompt:
              </span>
              <div className="mt-1 p-3 bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl font-mono text-xs text-red-900 dark:text-red-200">
                &ldquo;{badPrompt}&rdquo;
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Typical LLM Output:
              </span>
              <div className="mt-1 p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {badOutput}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Engineered Prompt (C.I.C.O. Structure):
              </span>
              <div className="mt-1 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl font-mono text-xs text-emerald-900 dark:text-emerald-200 whitespace-pre-line">
                {goodPrompt}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Deterministic High-Quality Output:
              </span>
              <div className="mt-1 p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                {goodOutput}
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Sparkles size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <span><strong>Why it matters:</strong> {explanation}</span>
        </div>
      </div>
    </div>
  );
};

// Interactive Component 2: Tokenization Visualizer Diagram
export const TokenizationDiagram: React.FC = () => {
  const [inputText, setInputText] = useState("Prompt Engineering unlocks AI potential");
  
  // Heuristic token simulation for visual demonstration
  const tokens = useMemo(() => {
    return inputText
      .split(/(\s+|[.,!?;:])/g)
      .filter((t) => t.length > 0)
      .map((t, idx) => ({
        id: idx + 1042,
        text: t,
        color: [
          "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
          "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
          "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
          "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
          "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
        ][idx % 5],
      }));
  }, [inputText]);

  return (
    <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-brand-50/40 dark:from-slate-900 dark:to-slate-950 border border-indigo-200/60 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="text-brand-600 dark:text-brand-400" size={18} />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Interactive Token Decomposition Sandbox
        </h4>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
        Type any phrase below to see how an LLM segments words into distinct token units:
      </p>

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mb-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Type a sentence to visualize tokens..."
      />

      <div className="flex flex-wrap gap-1.5 p-3.5 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[50px] items-center">
        {tokens.map((token, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-transform hover:scale-105 shadow-xs ${token.color}`}
            title={`Token ID #${token.id}`}
          >
            {token.text === " " ? "␣" : token.text}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>Total Tokens: ~{tokens.length}</span>
        <span>Avg characters per token: ~{(inputText.length / (tokens.length || 1)).toFixed(1)}</span>
      </div>
    </div>
  );
};

// Interactive Component 3: The C.I.C.O. 4-Pillar Visual Matrix
export const CicoMatrixDiagram: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const pillars = [
    {
      key: "C",
      name: "Context",
      color: "border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      description: "Background domain, target audience persona, and situational facts.",
      example: "'We are deploying a mission-critical financial dashboard for Fortune 500 CFOs.'",
    },
    {
      key: "I",
      name: "Instruction",
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      description: "Direct action verbs specifying the exact core objective.",
      example: "'Refactor this SQL query to eliminate Cartesian joins and add index hints.'",
    },
    {
      key: "C",
      name: "Constraints",
      color: "border-amber-500 bg-amber-50/50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      description: "Explicit boundaries, forbidden approaches, word limits, and security rules.",
      example: "'Do not use any external dependencies. Keep under 200 lines. Output no placeholder comments.'",
    },
    {
      key: "O",
      name: "Output Format",
      color: "border-purple-500 bg-purple-50/50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
      description: "The syntactic contract: JSON schema, Markdown table, CSV, or script.",
      example: "'Return strictly a valid JSON object matching the provided TypeScript interface.'",
    },
  ];

  return (
    <div className="my-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="text-brand-600 dark:text-brand-400" size={18} />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          The C.I.C.O. Prompt Architecture Matrix
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {pillars.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPillar(idx)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedPillar === idx
                ? `${p.color} ring-2 ring-brand-500 shadow-sm scale-102`
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80"
            }`}
          >
            <span className="text-lg font-black block">{p.key}</span>
            <span className="text-xs font-bold block">{p.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
        <h5 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
          {pillars[selectedPillar].name} Breakdown
        </h5>
        <p className="text-xs text-slate-700 dark:text-slate-300 mb-2.5">
          {pillars[selectedPillar].description}
        </p>
        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
          {pillars[selectedPillar].example}
        </div>
      </div>
    </div>
  );
};

// Interactive Component 4: Chain-of-Thought Reasoning Flow Diagram
export const CotFlowDiagram: React.FC = () => {
  return (
    <div className="my-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="text-brand-600 dark:text-brand-400" size={18} />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Direct vs. Chain-of-Thought (CoT) Compute Pathways
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direct Pathway */}
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/20">
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs mb-2">
            <AlertCircle size={14} />
            <span>Standard Direct Prompting (High Hallucination Risk)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono mb-2">
            <span className="p-1.5 bg-white dark:bg-slate-900 rounded border">Input Task</span>
            <ArrowRight size={14} className="text-slate-400" />
            <span className="p-1.5 bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 rounded border border-red-300">
              Immediate Guess ❌
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            With only 1 forward pass to predict the answer, complex multi-step reasoning leads to impulsive arithmetic and logic mistakes.
          </p>
        </div>

        {/* CoT Pathway */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-2">
            <ShieldCheck size={14} />
            <span>Chain-of-Thought Prompting (Verified Logic)</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono mb-2">
            <span className="p-1.5 bg-white dark:bg-slate-900 rounded border">Task</span>
            <ArrowRight size={12} className="text-slate-400" />
            <span className="p-1 bg-emerald-100 dark:bg-emerald-900/50 rounded text-[10px]">Step 1</span>
            <ArrowRight size={12} className="text-slate-400" />
            <span className="p-1 bg-emerald-100 dark:bg-emerald-900/50 rounded text-[10px]">Step 2</span>
            <ArrowRight size={12} className="text-slate-400" />
            <span className="p-1.5 bg-emerald-600 text-white rounded font-bold">
              Correct Answer ✅
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Forcing intermediate tokens allocates autoregressive compute power to solve each sub-problem in succession.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Interactive Slide Player Component
export default function InteractiveLessonPlayer({
  lessonTitle,
  content,
  onCompleteLesson,
  isCompleted,
}: InteractiveLessonPlayerProps) {
  // Parse slides separated by <!-- SLIDE --> or ---SLIDE--- or fallback by major headers ##
  const slides = useMemo(() => {
    if (!content) return [];
    if (content.includes("<!-- SLIDE -->")) {
      return content.split("<!-- SLIDE -->").map((s) => s.trim()).filter(Boolean);
    }
    if (content.includes("---SLIDE---")) {
      return content.split("---SLIDE---").map((s) => s.trim()).filter(Boolean);
    }
    
    // Auto-split into slides if content has multiple major sections (###)
    const sectionSplit = content.split(/\n(?=###?\s+)/);
    if (sectionSplit.length >= 3) {
      return sectionSplit.map((s) => s.trim()).filter(Boolean);
    }

    return [content];
  }, [content]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Web Speech API Voice Storyteller State (Option A)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  // Copy code helper state
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSpeechSupported(true);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Find natural English voice if possible
        const preferredVoice =
          voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];
        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech when slide changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [currentSlideIndex, lessonTitle]);

  // Clean narration text (stripping markdown syntax for pleasant audio listening)
  const getCleanNarrationText = (rawMarkdown: string) => {
    return rawMarkdown
      .replace(/###?\s+/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`{1,3}[^`]*`{1,3}/g, "code block")
      .replace(/<[^>]*>/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/•/g, "")
      .trim();
  };

  const toggleVoiceNarration = () => {
    if (!isSpeechSupported) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlayingAudio(true);
      } else {
        window.speechSynthesis.cancel();
        const currentSlideContent = slides[currentSlideIndex] || "";
        const cleanText = getCleanNarrationText(currentSlideContent);

        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = audioSpeed;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsPlayingAudio(false);
        };

        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const restartNarration = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setTimeout(() => toggleVoiceNarration(), 100);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setAudioSpeed(nextSpeed);

    // If currently playing, restart with new speed
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const currentSlideContent = slides[currentSlideIndex] || "";
        const cleanText = getCleanNarrationText(currentSlideContent);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = nextSpeed;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const copyCodeToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const currentSlideContent = slides[currentSlideIndex] || "";

  // Inspect current slide to see if we should inject rich visual diagrams
  const hasTokenizationRef = currentSlideContent.toLowerCase().includes("token");
  const hasCicoRef = currentSlideContent.includes("C.I.C.O.") || currentSlideContent.includes("Anatomy");
  const hasCotRef = currentSlideContent.toLowerCase().includes("chain-of-thought") || currentSlideContent.toLowerCase().includes("step-by-step");
  const hasCompareRef = currentSlideContent.toLowerCase().includes("zero-shot vs") || currentSlideContent.toLowerCase().includes("few-shot");

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-card">
      
      {/* Top Header: Slide Stepper & AI Voice Storyteller Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        
        {/* Slide Counter & Progress Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span className="text-xs font-black text-brand-700 dark:text-brand-300">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="hidden sm:flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? "w-8 bg-brand-600 dark:bg-brand-500"
                    : idx < currentSlideIndex
                    ? "w-3 bg-emerald-500/70"
                    : "w-3 bg-slate-200 dark:bg-slate-800"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* AI Voice Storyteller Bar (Option A) */}
        {isSpeechSupported && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-2xl shadow-xs">
            <button
              onClick={toggleVoiceNarration}
              className={`p-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                isPlayingAudio
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100"
              }`}
              title={isPlayingAudio ? "Pause Audio Narration" : "Play AI Mentor Voice Storytelling"}
            >
              {isPlayingAudio ? (
                <>
                  <Pause size={14} className="animate-pulse" />
                  <span>Pause Voice</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>🎙️ Voice Story</span>
                </>
              )}
            </button>

            {isPlayingAudio && (
              <button
                onClick={restartNarration}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Restart Slide Narration"
              >
                <RotateCcw size={13} />
              </button>
            )}

            <button
              onClick={cycleSpeed}
              className="text-[11px] font-mono font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800"
              title="Change Voice Speed"
            >
              {audioSpeed}x
            </button>
          </div>
        )}
      </div>

      {/* Main Slide Interactive Card Canvas */}
      <div className="p-6 sm:p-10 min-h-[420px] flex flex-col justify-between">
        
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-6 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-600 rounded-full inline-block" />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-5 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 mb-4 pl-4 list-disc text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-2 mb-4 pl-4 list-decimal text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="my-4 p-4 rounded-xl border-l-4 border-brand-500 bg-brand-50/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm not-italic shadow-xs">
                  {children}
                </blockquote>
              ),
              code: ({ inline, className, children, ...props }: any) => {
                const codeString = String(children).replace(/\n$/, "");
                const isBlock = !inline && codeString.includes("\n");

                if (isBlock) {
                  const codeIdx = Math.abs(codeString.length * 31);
                  return (
                    <div className="my-4 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
                      <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Terminal size={13} className="text-brand-400" />
                          <span>Code Snippet</span>
                        </span>
                        <button
                          onClick={() => copyCodeToClipboard(codeString, codeIdx)}
                          className="flex items-center gap-1 hover:text-white transition-colors p-1"
                          title="Copy to clipboard"
                        >
                          {copiedCodeIndex === codeIdx ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-950 text-slate-200">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                }

                return (
                  <code className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-300 font-bold">
                    {children}
                  </code>
                );
              },
            }}
          >
            {currentSlideContent}
          </ReactMarkdown>

          {/* Contextual Dynamic Diagrams & Interactive Sandboxes */}
          {hasTokenizationRef && currentSlideIndex === 0 && <TokenizationDiagram />}
          {hasCicoRef && <CicoMatrixDiagram />}
          {hasCotRef && <CotFlowDiagram />}
          {hasCompareRef && (
            <PromptComparisonWidget
              badPrompt="Write a blog post about artificial intelligence in healthcare."
              badOutput="AI is transforming healthcare in many ways. Doctors use it to diagnose diseases. Hospitals use computers to schedule appointments. It is very important for the future of medicine."
              goodPrompt={`Act as a HealthTech Journalist writing for MIT Technology Review.
Topic: Generative AI in diagnostic radiology.
Constraints:
- Focus on FDA-cleared computer vision models (e.g. breast cancer screening).
- Keep length to 3 concise bullet points.
- Tone: Technical, objective, evidence-based.
Output: Markdown bulleted list with citation references.`}
              goodOutput={`• Sensitivity Benchmarks: FDA-cleared DL algorithms have achieved a 94.5% AUC in detecting microcalcifications, outperforming dual-reader baseline panels.
• Workflow Integration: Prioritizing triage queues in PACS systems reduced radiologist turnaround times for acute pulmonary embolisms by 37%.
• Limitations: False-positive rates persist in atypical breast density subgroups, underscoring the necessity of human-in-the-loop oversight.`}
              explanation="By assigning a specialized persona (MIT Tech Review), specifying the exact sub-domain (radiology), setting clear constraints, and demanding bulleted metric benchmarks, the response jumped from middle-school summary to publishable executive brief."
            />
          )}
        </div>

        {/* Bottom Slide Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
          
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className="w-full sm:w-auto btn-secondary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2 dark:bg-slate-800 dark:border-slate-700 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            <span>Previous Slide</span>
          </button>

          <div className="text-xs text-slate-400 font-medium text-center">
            Tip: Press Play on Voice Story to listen while reviewing the slide.
          </div>

          {currentSlideIndex < slides.length - 1 ? (
            <button
              onClick={handleNextSlide}
              className="w-full sm:w-auto btn-primary py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-transform"
            >
              <span>Next Slide</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onCompleteLesson}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-transform"
            >
              <CheckCircle2 size={16} />
              <span>{isCompleted ? "Lesson Completed" : "Mark Lesson Complete"}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
