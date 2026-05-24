export interface HistoricalEra {
  id: string;
  name: string;
  start_year: number;
  end_year: number;
  description: string;
  civilizations: Civilization[];
  migrations: Migration[];
  created_at: string;
}

export interface Civilization {
  name: string;
  language: string;
  influence: number;
}

export interface Migration {
  from: string;
  to: string;
  type: string;
}

export interface HebrewLetter {
  id: string;
  letter: string;
  name: string;
  numeric_value: number;
  pictogram: string;
  original_meaning: string;
  evolution: string;
  created_at: string;
}

export interface AtomicComposition {
  letter: string;
  name: string;
  pictogram: string;
  meaning: string;
  value: number;
}

export interface LinguisticRoot {
  id: string;
  root: string;
  transliteration: string;
  core_meaning: string;
  category: string;
  era_origin_id: string;
  pictogram_url: string;
  atomic_composition: AtomicComposition[];
  created_at: string;
}

export interface RootConnection {
  id: string;
  source_root_id: string;
  target_root_id: string;
  connection_type: string;
  strength: number;
  description: string;
  created_at: string;
}

export interface AtomicBreakdown {
  letter: string;
  role: string;
  function: string;
}

export interface Word {
  id: string;
  word: string;
  transliteration: string;
  meaning: string;
  root_id: string;
  era_id: string;
  geographic_origin: {
    region: string;
    latitude: number;
    longitude: number;
  };
  atomic_breakdown: AtomicBreakdown[];
  code_representation: string;
  created_at: string;
}

export interface GeoOrigin {
  id: string;
  era_id: string;
  civilization: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  language_family: string;
  active_roots: string[];
  created_at: string;
}
