import { useState, memo } from 'react';
import { Code2, Copy, Check, ChevronRight } from 'lucide-react';
import { Word } from '../types';
import type { Language } from '../App';

interface LanguageAsCodeProps {
  words: Word[];
  lang: Language;
}

const translations = {
  en: {
    title: 'Language as Code',
    fileExplorer: 'root_files',
    copyCode: 'Copy',
    copied: 'Copied!',
    origin: 'Origin',
    wordInstances: 'Word Instances',
    lines: 'lines',
  },
  es: {
    title: 'Lenguaje como Codigo',
    fileExplorer: 'archivos_raiz',
    copyCode: 'Copiar',
    copied: 'Copiado!',
    origin: 'Origen',
    wordInstances: 'Instancias de Palabras',
    lines: 'lineas',
  },
} as const;

const TOKEN_COLORS: Record<string, string> = {
  keyword: 'text-sky-400',
  string: 'text-amber-300',
  literal: 'text-orange-400',
  number: 'text-emerald-400',
  function: 'text-cyan-300',
  identifier: 'text-slate-200',
  bracket: 'text-slate-400',
  punctuation: 'text-slate-500',
  comment: 'text-slate-600 italic',
  other: 'text-slate-300',
  type: 'text-emerald-300',
};

const PATTERNS: [RegExp, string][] = [
  [/^(\/\/.*$)/, 'comment'],
  [/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, 'string'],
  [/^(\b(?:const|let|var|function|return|class|interface|constructor|import|export|from|async|await|new|this|typeof|instanceof|type|extends|implements|readonly|static|public|private|protected)\b)/, 'keyword'],
  [/^(\b(?:true|false|null|undefined|NaN|Infinity)\b)/, 'literal'],
  [/^(\b\d+\b)/, 'number'],
  [/^(\b[A-Z][a-zA-Z0-9_$]*\b)/, 'type'],
  [/^(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/, 'function'],
  [/^(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)/, 'identifier'],
  [/^([{}()[\]])/, 'bracket'],
  [/^([;,.:?=<>|&!])/, 'punctuation'],
  [/^(\S)/, 'other'],
];

const SyntaxHighlight = memo(function SyntaxHighlight({ line }: { line: string }) {
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    if (remaining[0] === ' ') {
      tokens.push(<span key={key++}> </span>);
      remaining = remaining.slice(1);
      continue;
    }

    let matched = false;
    for (const [pattern, type] of PATTERNS) {
      const match = remaining.match(pattern);
      if (match) {
        const value = match[1];
        tokens.push(
          <span key={key++} className={TOKEN_COLORS[type] || 'text-slate-300'}>{value}</span>
        );
        remaining = remaining.slice(value.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
  }

  return <>{tokens}</>;
});

export function LanguageAsCode({ words, lang }: LanguageAsCodeProps) {
  const [selectedWord, setSelectedWord] = useState<Word>(words[0] || null!);
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handleCopy = async () => {
    if (!selectedWord) return;
    await navigator.clipboard.writeText(selectedWord.code_representation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedWord || words.length === 0) return (
    <div className="flex items-center justify-center h-64 text-slate-500">
      No words available
    </div>
  );

  const lines = selectedWord.code_representation.split('\n');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Code2 className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-cyan-400 tracking-wide">{t.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[480px]">
        {/* File Explorer Sidebar */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-700/50">
            <span className="text-xs text-slate-500 font-mono">{t.fileExplorer}</span>
          </div>
          <div className="p-2 flex flex-col gap-0.5">
            {words.map((word) => {
              const isActive = selectedWord.id === word.id;
              return (
                <button
                  key={word.id}
                  onClick={() => setSelectedWord(word)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                  }`}
                >
                  <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  <span className="text-xs font-mono truncate">{word.word}.root</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Editor */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">{selectedWord.word}.root</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-mono">{lines.length} {t.lines}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/60 border border-slate-600/50 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all duration-150"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? t.copied : t.copyCode}
              </button>
            </div>
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs font-mono">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="select-none text-right pr-4 pl-4 py-0.5 text-slate-700 w-12 border-r border-slate-800 sticky left-0 bg-slate-900">
                      {i + 1}
                    </td>
                    <td className="pl-4 pr-4 py-0.5 text-slate-300 whitespace-pre">
                      <SyntaxHighlight line={line} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-4 px-4 py-1.5 bg-slate-800/60 border-t border-slate-700/50 text-xs font-mono">
            <span className="text-amber-400">{selectedWord.word}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">{selectedWord.transliteration}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{selectedWord.meaning}</span>
            <span className="ml-auto text-slate-600">{t.origin}: {selectedWord.geographic_origin?.region}</span>
          </div>
        </div>
      </div>

      {/* Word grid */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">{t.wordInstances}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {words.map((word) => {
            const isActive = selectedWord.id === word.id;
            return (
              <button
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className={`p-2.5 rounded-lg border text-center transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-800/50 border-slate-700/40 text-slate-500 hover:border-slate-600 hover:text-slate-400'
                }`}
              >
                <div className="text-lg font-bold mb-0.5" style={{ direction: 'rtl', fontFamily: 'serif' }}>
                  {word.word}
                </div>
                <div className="text-xs font-mono truncate">{word.transliteration}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
