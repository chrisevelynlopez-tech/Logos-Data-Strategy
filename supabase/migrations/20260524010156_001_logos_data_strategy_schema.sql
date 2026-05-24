/*
  # Logos Data Strategy Database Schema

  1. New Tables
    - `historical_eras`: Timeline periods with civilization data
    - `linguistic_roots`: Root words/elements with atomic composition
    - `root_connections`: Graph relationships between roots
    - `hebrew_letters`: Individual letter data with pictograms
    - `words`: Expanded words from roots
    - `geo_origins`: Geographic data for civilizations

  2. Security
    - Enable RLS on all tables
    - Public read access for educational/research purpose
    - Authenticated users can insert/update for data contribution
*/

-- Historical Eras Table
CREATE TABLE IF NOT EXISTS historical_eras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_year integer NOT NULL,
  end_year integer NOT NULL,
  description text DEFAULT '',
  civilizations jsonb DEFAULT '[]'::jsonb,
  migrations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Hebrew Letters Table (atomic elements)
CREATE TABLE IF NOT EXISTS hebrew_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  letter text NOT NULL UNIQUE,
  name text NOT NULL,
  numeric_value integer DEFAULT 0,
  pictogram text DEFAULT '',
  original_meaning text DEFAULT '',
  evolution text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Linguistic Roots Table
CREATE TABLE IF NOT EXISTS linguistic_roots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  root text NOT NULL,
  transliteration text NOT NULL,
  core_meaning text NOT NULL,
  category text DEFAULT 'concept',
  era_origin_id uuid REFERENCES historical_eras(id),
  pictogram_url text DEFAULT '',
  atomic_composition jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Root Connections (Graph edges)
CREATE TABLE IF NOT EXISTS root_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_root_id uuid REFERENCES linguistic_roots(id) ON DELETE CASCADE,
  target_root_id uuid REFERENCES linguistic_roots(id) ON DELETE CASCADE,
  connection_type text DEFAULT 'semantic',
  strength integer DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Words Table (expanded from roots)
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  transliteration text NOT NULL,
  meaning text NOT NULL,
  root_id uuid REFERENCES linguistic_roots(id) ON DELETE CASCADE,
  era_id uuid REFERENCES historical_eras(id),
  geographic_origin jsonb DEFAULT '{}'::jsonb,
  atomic_breakdown jsonb DEFAULT '[]'::jsonb,
  code_representation text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Geographic Origins Table
CREATE TABLE IF NOT EXISTS geo_origins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  era_id uuid REFERENCES historical_eras(id) ON DELETE CASCADE,
  civilization text NOT NULL,
  location jsonb DEFAULT '{}'::jsonb,
  language_family text DEFAULT '',
  active_roots jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE historical_eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE hebrew_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE linguistic_roots ENABLE ROW LEVEL SECURITY;
ALTER TABLE root_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_origins ENABLE ROW LEVEL SECURITY;

-- Public read policies (drop first to avoid conflicts)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read access for historical_eras" ON historical_eras;
  DROP POLICY IF EXISTS "Public read access for hebrew_letters" ON hebrew_letters;
  DROP POLICY IF EXISTS "Public read access for linguistic_roots" ON linguistic_roots;
  DROP POLICY IF EXISTS "Public read access for root_connections" ON root_connections;
  DROP POLICY IF EXISTS "Public read access for words" ON words;
  DROP POLICY IF EXISTS "Public read access for geo_origins" ON geo_origins;
  DROP POLICY IF EXISTS "Authenticated users can insert linguistic_roots" ON linguistic_roots;
  DROP POLICY IF EXISTS "Authenticated users can update linguistic_roots" ON linguistic_roots;
  DROP POLICY IF EXISTS "Authenticated users can insert root_connections" ON root_connections;
  DROP POLICY IF EXISTS "Authenticated users can insert words" ON words;
  DROP POLICY IF EXISTS "Authenticated users can update words" ON words;
END $$;

CREATE POLICY "Public read access for historical_eras"
  ON historical_eras FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for hebrew_letters"
  ON hebrew_letters FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for linguistic_roots"
  ON linguistic_roots FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for root_connections"
  ON root_connections FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for words"
  ON words FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for geo_origins"
  ON geo_origins FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert linguistic_roots"
  ON linguistic_roots FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update linguistic_roots"
  ON linguistic_roots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can insert root_connections"
  ON root_connections FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can insert words"
  ON words FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update words"
  ON words FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_linguistic_roots_era ON linguistic_roots(era_origin_id);
CREATE INDEX IF NOT EXISTS idx_root_connections_source ON root_connections(source_root_id);
CREATE INDEX IF NOT EXISTS idx_root_connections_target ON root_connections(target_root_id);
CREATE INDEX IF NOT EXISTS idx_words_root ON words(root_id);
CREATE INDEX IF NOT EXISTS idx_words_era ON words(era_id);
CREATE INDEX IF NOT EXISTS idx_geo_origins_era ON geo_origins(era_id);
