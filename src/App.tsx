import { useEffect, useState } from 'react';
import { BookOpen, Scroll, Map, Binary, Sparkles, Globe as GlobeIcon, Languages } from 'lucide-react';
import { supabase } from './lib/supabase';
import type {
  HistoricalEra,
  LinguisticRoot,
  RootConnection,
  Word,
  GeoOrigin,
  HebrewLetter,
} from './types';
import { Globe } from './components/Globe';
import { GraphExplorer } from './components/GraphExplorer';
import { LanguageAsCode } from './components/LanguageAsCode';
import { AtomicRootDecoder } from './components/AtomicRootDecoder';

export type Language = 'en' | 'es';

export const translations = {
  en: {
    title: 'Logos Data Strategy',
    subtitle: 'Ancient Language Architecture',
    loading: 'Loading ancient wisdom...',
    sections: {
      globe: 'Global Origins',
      graph: 'Root Network',
      code: 'Language as Code',
      decoder: 'Atomic Decoder',
    },
    footer: 'Decoding the architecture of ancient language',
    era: 'Era',
    roots: 'Roots',
    words: 'Words',
    unknown: 'Unknown',
    civilizations: 'Civilizations',
    migrations: 'Migration Patterns',
  },
  es: {
    title: 'Logos Data Strategy',
    subtitle: 'Arquitectura del Lenguaje Antiguo',
    loading: 'Cargando sabiduria antigua...',
    sections: {
      globe: 'Origenes Globales',
      graph: 'Red de Raices',
      code: 'Lenguaje como Codigo',
      decoder: 'Decodificador Atomico',
    },
    footer: 'Decodificando la arquitectura del lenguaje antiguo',
    era: 'Era',
    roots: 'Raices',
    words: 'Palabras',
    unknown: 'Desconocido',
    civilizations: 'Civilizaciones',
    migrations: 'Patrones de Migracion',
  },
} as const;

type Section = 'globe' | 'graph' | 'code' | 'decoder';

function App() {
  const [eras, setEras] = useState<HistoricalEra[]>([]);
  const [roots, setRoots] = useState<LinguisticRoot[]>([]);
  const [connections, setConnections] = useState<RootConnection[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [geoOrigins, setGeoOrigins] = useState<GeoOrigin[]>([]);
  const [letters, setLetters] = useState<HebrewLetter[]>([]);
  const [selectedEraId, setSelectedEraId] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('globe');
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [erasRes, rootsRes, connectionsRes, wordsRes, geoRes, lettersRes] = await Promise.all([
        supabase.from('historical_eras').select('*').order('start_year', { ascending: true }),
        supabase.from('linguistic_roots').select('*'),
        supabase.from('root_connections').select('*'),
        supabase.from('words').select('*'),
        supabase.from('geo_origins').select('*'),
        supabase.from('hebrew_letters').select('*'),
      ]);

      if (erasRes.data) {
        setEras(erasRes.data);
        if (erasRes.data.length > 0) setSelectedEraId(erasRes.data[0].id);
      }
      if (rootsRes.data) setRoots(rootsRes.data);
      if (connectionsRes.data) setConnections(connectionsRes.data);
      if (wordsRes.data) setWords(wordsRes.data);
      if (geoRes.data) setGeoOrigins(geoRes.data);
      if (lettersRes.data) setLetters(lettersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const sections: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'globe', label: t.sections.globe, icon: Map },
    { id: 'graph', label: t.sections.graph, icon: Binary },
    { id: 'code', label: t.sections.code, icon: Scroll },
    { id: 'decoder', label: t.sections.decoder, icon: Sparkles },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <BookOpen className="w-12 h-12 text-amber-400 animate-pulse" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-amber-400/30 animate-ping" />
          </div>
          <p className="text-amber-400 font-mono text-sm tracking-widest animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }

  const selectedEra = eras.find(e => e.id === selectedEraId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100 tracking-wide">{t.title}</h1>
                <p className="text-xs text-slate-500 font-mono">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 mr-2">
                <div className="text-center">
                  <div className="text-sm font-bold text-amber-400">{eras.length}</div>
                  <div className="text-xs text-slate-600">{t.era}s</div>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-400">{roots.length}</div>
                  <div className="text-xs text-slate-600">{t.roots}</div>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="text-center">
                  <div className="text-sm font-bold text-cyan-400">{words.length}</div>
                  <div className="text-xs text-slate-600">{t.words}</div>
                </div>
              </div>

              <button
                onClick={() => setLang(l => l === 'en' ? 'es' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
              >
                <Languages className="w-3.5 h-3.5" />
                {lang === 'en' ? 'ES' : 'EN'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-12 overflow-x-auto">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  activeSection === id
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'globe' && (
          <div className="flex flex-col gap-8">
            <Globe
              eras={eras}
              geoOrigins={geoOrigins}
              selectedEraId={selectedEraId}
              onEraChange={setSelectedEraId}
              lang={lang}
            />
            {selectedEra && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <GlobeIcon className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-amber-400">{selectedEra.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{selectedEra.description}</p>
                  <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-2">{t.civilizations}</h4>
                  <div className="flex flex-col gap-2">
                    {selectedEra.civilizations.map((civ, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div>
                          <span className="text-sm text-slate-300 font-medium">{civ.name}</span>
                          <span className="text-xs text-slate-600 ml-2 font-mono">{civ.language}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.round(civ.influence / 2) }).map((_, j) => (
                            <span key={j} className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-5">
                  <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-3">{t.migrations}</h4>
                  <div className="flex flex-col gap-2">
                    {selectedEra.migrations.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <span className="text-sm text-slate-300">{m.from}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-sm text-slate-300">{m.to}</span>
                        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-slate-700/60 text-slate-500 border border-slate-600/40">{m.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'graph' && (
          <GraphExplorer roots={roots} connections={connections} lang={lang} />
        )}

        {activeSection === 'code' && (
          <LanguageAsCode words={words} lang={lang} />
        )}

        {activeSection === 'decoder' && (
          <AtomicRootDecoder roots={roots} letters={letters} lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 font-mono">{t.footer}</p>
            <span className="text-xs text-slate-700 font-mono">א → β → A</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
