import { useState, useMemo } from 'react';
import { Sparkles, Search, Terminal, Network, X, Zap } from 'lucide-react';
import { LinguisticRoot, HebrewLetter } from '../types';
import type { Language } from '../App';

interface AtomicRootDecoderProps {
  roots: LinguisticRoot[];
  letters: HebrewLetter[];
  lang: Language;
}

const translations = {
  en: {
    title: 'Atomic Root Decoder',
    pictograms: 'Pictograms',
    atomicComposition: 'Atomic Composition',
    value: 'Value',
    originalMeaning: 'Original Meaning',
    numericValue: 'Numeric Value',
    historicalEvolution: 'Historical Evolution',
    combinedConcept: 'Combined Concept',
    gematria: 'Gematria Total',
    hidePictograms: 'Hide Pictograms',
    showPictograms: 'Show Pictograms',
    clickToExpand: 'Click to expand',
    searchPlaceholder: 'Search atoms by character, name, or function...',
    noResults: 'No matching atoms found',
    matrixTerminal: 'LDS-Matrix Terminal',
    graphCanvasTitle: 'LDS-Matrix Graph Canvas',
    graphCanvasSubtitle: 'Future Neo4j Integration',
    graphCanvasStatus: 'RESERVED FOR VECTOR NODE RENDERING',
    totalAtoms: 'Total Atoms',
    filteredAtoms: 'Filtered',
    activeConnections: 'Active Connections',
    systemStatus: 'ONLINE',
  },
  es: {
    title: 'Decodificador Atomico de Raices',
    pictograms: 'Pictogramas',
    atomicComposition: 'Composicion Atomica',
    value: 'Valor',
    originalMeaning: 'Significado Original',
    numericValue: 'Valor Numerico',
    historicalEvolution: 'Evolucion Historica',
    combinedConcept: 'Concepto Combinado',
    gematria: 'Guematria Total',
    hidePictograms: 'Ocultar Pictogramas',
    showPictograms: 'Mostrar Pictogramas',
    clickToExpand: 'Haz clic para expandir',
    searchPlaceholder: 'Buscar atomos por caracter, nombre o funcion...',
    noResults: 'No se encontraron atomos',
    matrixTerminal: 'Terminal LDS-Matrix',
    graphCanvasTitle: 'Lienzo de Grafo LDS-Matrix',
    graphCanvasSubtitle: 'Futura Integracion Neo4j',
    graphCanvasStatus: 'RESERVADO PARA RENDERIZADO DE NODOS VECTORIALES',
    totalAtoms: 'Atomos Totales',
    filteredAtoms: 'Filtrados',
    activeConnections: 'Conexiones Activas',
    systemStatus: 'EN LINEA',
  },
} as const;

export function AtomicRootDecoder({ roots, letters, lang }: AtomicRootDecoderProps) {
  const [expandedRoot, setExpandedRoot] = useState<string | null>(roots[0]?.id ?? null);
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(new Set());
  const [showPictograms, setShowPictograms] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[lang];

  // Filter roots and letters based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return { filteredRoots: roots, filteredLetters: letters, hasSearch: false };
    }

    const query = searchQuery.toLowerCase().trim();

    // Filter letters
    const matchingLetters = letters.filter(letter =>
      letter.letter.includes(searchQuery) ||
      letter.name.toLowerCase().includes(query) ||
      letter.original_meaning.toLowerCase().includes(query) ||
      letter.evolution.toLowerCase().includes(query)
    );

    // Filter roots that contain matching letters or match themselves
    const matchingRoots = roots.filter(root => {
      // Check root itself
      if (root.root.includes(searchQuery) ||
          root.transliteration.toLowerCase().includes(query) ||
          root.core_meaning.toLowerCase().includes(query)) {
        return true;
      }

      // Check if any atomic composition letter matches
      return root.atomic_composition.some(atom =>
        atom.letter.includes(searchQuery) ||
        atom.name.toLowerCase().includes(query) ||
        atom.meaning.toLowerCase().includes(query)
      );
    });

    return {
      filteredRoots: matchingRoots,
      filteredLetters: matchingLetters,
      hasSearch: true,
    };
  }, [searchQuery, roots, letters]);

  const toggleRoot = (rootId: string) => {
    setExpandedRoot(expandedRoot === rootId ? null : rootId);
    if (expandedRoot === rootId) setExpandedLetters(new Set());
  };

  const toggleLetter = (letterKey: string) => {
    const next = new Set(expandedLetters);
    if (next.has(letterKey)) next.delete(letterKey);
    else next.add(letterKey);
    setExpandedLetters(next);
  };

  const clearSearch = () => setSearchQuery('');

  // Calculate stats
  const totalConnections = filteredData.filteredRoots.reduce((sum, root) =>
    sum + root.atomic_composition.length, 0
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Matrix Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded-md">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">{t.matrixTerminal}</span>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-emerald-400 tracking-wide">{t.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-emerald-600/70">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">{filteredData.filteredRoots.length}</span>
              <span className="text-emerald-600/50">roots</span>
            </div>
            <span className="text-emerald-700/40">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500">{filteredData.filteredLetters.length}</span>
              <span className="text-emerald-600/50">atoms</span>
            </div>
          </div>

          {/* Pictogram toggle */}
          <button
            onClick={() => setShowPictograms(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-500 hover:text-emerald-300 hover:border-emerald-500/40 transition-all"
          >
            {showPictograms ? <X className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            <span className="uppercase tracking-wider">{showPictograms ? t.hidePictograms : t.showPictograms}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-[#020617] border border-emerald-500/40 rounded-lg px-4 py-2.5">
          <Search className="w-4 h-4 text-emerald-500/70 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-emerald-300 placeholder-emerald-600/50 font-mono outline-none"
            style={{ caretColor: '#10b981' }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-emerald-500/10 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-emerald-500/70 hover:text-emerald-400" />
            </button>
          )}
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600/60">
            <Zap className="w-3 h-3" />
            <span className="uppercase tracking-wider">Search</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </div>

      {/* No Results */}
      {filteredData.filteredRoots.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 flex items-center justify-center mb-4">
            <Search className="w-5 h-5 text-emerald-500/40" />
          </div>
          <p className="text-sm font-mono text-emerald-600/70">{t.noResults}</p>
          <button
            onClick={clearSearch}
            className="mt-3 text-xs font-mono text-emerald-500 hover:text-emerald-300 underline underline-offset-2"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Graph Canvas Reservation */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-emerald-500/70" />
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Network Visualization</span>
        </div>

        <div className="relative bg-[#020617] border border-emerald-500/30 rounded-xl overflow-hidden min-h-[280px]">
          {/* Scanlines effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(16,185,129,0.03) 1px, rgba(16,185,129,0.03) 2px)`,
              backgroundSize: '100% 2px',
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-500/40" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-500/40" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-500/40" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-500/40" />

          {/* Content */}
          <div className="flex flex-col items-center justify-center h-full py-12 px-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {t.graphCanvasTitle}
              </h3>
            </div>
            <p className="text-sm font-mono text-emerald-500/60 mb-4">{t.graphCanvasSubtitle}</p>

            <div className="flex items-center gap-4 px-6 py-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-md">
              <span className="text-xs font-mono text-emerald-600/70 uppercase tracking-widest">
                {t.graphCanvasStatus}
              </span>
            </div>

            {/* Node preview dots */}
            <div className="flex items-center gap-3 mt-6 opacity-40">
              {filteredData.filteredRoots.slice(0, 5).map((root, i) => (
                <div key={root.id} className="relative">
                  <div
                    className="w-6 h-6 rounded-full border border-emerald-500/50 flex items-center justify-center text-xs text-emerald-500/70 font-mono"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <span className="opacity-60">{root.root.slice(0, 1)}</span>
                  </div>
                  {i < filteredData.filteredRoots.length - 1 && i < 4 && (
                    <div className="absolute top-1/2 left-full w-3 h-px bg-emerald-500/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status indicators */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-600/50 uppercase tracking-wider">
              {t.systemStatus}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-4 text-xs font-mono text-emerald-600/50">
            <span>{t.totalAtoms}: <span className="text-emerald-500">{letters.length}</span></span>
            <span className="text-emerald-600/30">|</span>
            <span>{t.filteredAtoms}: <span className="text-emerald-500">{filteredData.filteredLetters.length}</span></span>
            <span className="text-emerald-600/30">|</span>
            <span>{t.activeConnections}: <span className="text-emerald-500">{totalConnections}</span></span>
          </div>
        </div>
      </div>

      {/* Root Cards */}
      {filteredData.filteredRoots.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-600/50 uppercase tracking-widest">Atomic Decoding Stream</span>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent" />
          </div>

          {filteredData.filteredRoots.map((root) => {
            const isExpanded = expandedRoot === root.id;
            const totalValue = root.atomic_composition.reduce((sum, a) => sum + a.value, 0);

            return (
              <div
                key={root.id}
                className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-emerald-500/50 bg-[#020617]'
                    : 'border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40 hover:bg-[#020617]'
                }`}
              >
                {/* Root header */}
                <button
                  className="w-full flex items-center gap-4 p-4 text-left"
                  onClick={() => toggleRoot(root.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-2xl font-bold text-emerald-400 leading-none"
                      style={{ fontFamily: 'serif', direction: 'rtl' }}
                    >
                      {root.root}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base text-emerald-300 font-mono">{root.transliteration}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-950/60 text-emerald-500 border border-emerald-500/30 font-mono uppercase">
                          {root.category}
                        </span>
                        <span className="text-xs text-emerald-600/70 font-mono">
                          gematria: <span className="text-emerald-400">{totalValue}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-4">
                    <p className="text-sm text-emerald-300/80 font-mono">{root.core_meaning}</p>
                  </div>

                  {/* Letter atoms preview */}
                  <div className="flex items-center gap-1 mr-2">
                    {root.atomic_composition.map((atom, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400"
                        style={{ fontFamily: 'serif' }}
                      >
                        {atom.letter}
                      </div>
                    ))}
                  </div>

                  <span className={`text-emerald-500/50 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-emerald-500/20 p-4 flex flex-col gap-4 bg-emerald-950/30">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs text-emerald-500 font-mono uppercase tracking-widest">
                        {t.atomicComposition}
                      </code>
                      <div className="flex-1 h-px bg-emerald-500/20" />
                      <code className="text-xs text-emerald-600/50 font-mono">{root.atomic_composition.length} atoms</code>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {root.atomic_composition.map((atom, index) => {
                        const letterData = letters.find(l => l.letter === atom.letter);
                        const letterKey = `${root.id}-${atom.letter}-${index}`;
                        const isLetterExpanded = expandedLetters.has(letterKey);

                        return (
                          <div
                            key={letterKey}
                            className={`rounded-lg border transition-all duration-150 overflow-hidden ${
                              isLetterExpanded
                                ? 'border-emerald-500/40 bg-[#020617]'
                                : 'border-emerald-500/20 bg-emerald-950/30'
                            }`}
                          >
                            <button
                              className="w-full flex items-center gap-3 p-3 text-left"
                              onClick={() => toggleLetter(letterKey)}
                            >
                              {showPictograms && (
                                <div className="w-10 h-10 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-lg flex-shrink-0">
                                  {letterData?.pictogram || atom.pictogram}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span
                                    className="text-lg font-bold text-emerald-400"
                                    style={{ fontFamily: 'serif' }}
                                  >
                                    {atom.letter}
                                  </span>
                                  <span className="text-xs text-emerald-500/70 font-mono">{atom.name}</span>
                                </div>
                                <p className="text-xs text-emerald-400/60 font-mono truncate mt-0.5">
                                  <span className="text-emerald-500/40">func:</span> {atom.meaning}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <code className="text-sm font-mono text-emerald-400">{atom.value}</code>
                              </div>
                            </button>

                            {isLetterExpanded && letterData && (
                              <div className="border-t border-emerald-500/20 p-3 space-y-2 bg-[#020617]">
                                <div>
                                  <code className="text-xs text-emerald-600/60 uppercase tracking-wider">
                                    {t.originalMeaning}
                                  </code>
                                  <p className="text-xs text-emerald-300 font-mono mt-1">
                                    {letterData.original_meaning}
                                  </p>
                                </div>
                                <div>
                                  <code className="text-xs text-emerald-600/60 uppercase tracking-wider">
                                    {t.historicalEvolution}
                                  </code>
                                  <p className="text-xs text-emerald-400/60 font-mono mt-1 leading-relaxed">
                                    {letterData.evolution}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/10">
                                  <code className="text-xs text-emerald-600/60">{t.numericValue}:</code>
                                  <code className="text-sm font-mono text-emerald-400">{letterData.numeric_value}</code>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Combined Concept */}
                    <div className="bg-[#020617] border border-emerald-500/30 rounded-lg p-4 mt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <code className="text-xs text-emerald-500 font-mono uppercase tracking-widest">
                          {t.combinedConcept}
                        </code>
                        <div className="flex-1 h-px bg-emerald-500/20" />
                      </div>
                      <div className="flex items-center flex-wrap gap-2 font-mono">
                        {root.atomic_composition.map((atom, index) => (
                          <span key={index} className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-sm text-emerald-400">
                              {atom.name}
                            </span>
                            {index < root.atomic_composition.length - 1 && (
                              <span className="text-emerald-600/50 font-bold">+</span>
                            )}
                          </span>
                        ))}
                        <span className="text-emerald-500/70 font-bold mx-2">=</span>
                        <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/40 text-sm text-emerald-300 font-semibold">
                          {root.core_meaning}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
