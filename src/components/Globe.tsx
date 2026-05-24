import { useEffect, useRef, useState } from 'react';
import { MapPin, Layers } from 'lucide-react';
import { HistoricalEra, GeoOrigin } from '../types';
import type { Language } from '../App';

interface GlobeProps {
  eras: HistoricalEra[];
  geoOrigins: GeoOrigin[];
  selectedEraId: string;
  onEraChange: (eraId: string) => void;
  lang: Language;
}

const translations = {
  en: {
    title: 'Global Origins',
    selectEra: 'Select an era',
    historicalTimeline: 'Historical Timeline',
    languageFamily: 'Language Family',
    activeRoots: 'Active Roots',
  },
  es: {
    title: 'Origenes Globales',
    selectEra: 'Selecciona una era',
    historicalTimeline: 'Linea Temporal Historica',
    languageFamily: 'Familia Linguistica',
    activeRoots: 'Raices Activas',
  },
} as const;

export function Globe({ eras, geoOrigins, selectedEraId, onEraChange, lang }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef(0);
  const [hoveredLocation, setHoveredLocation] = useState<GeoOrigin | null>(null);

  const selectedEra = eras.find(e => e.id === selectedEraId);
  const eraGeoOrigins = geoOrigins.filter(g => g.era_id === selectedEraId);
  const t = translations[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    const draw = () => {
      const frameRotation = rotationRef.current;
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
      bgGrad.addColorStop(0, '#0d1b2a');
      bgGrad.addColorStop(0.5, '#0a1628');
      bgGrad.addColorStop(1, '#060e1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars background
      for (let i = 0; i < 120; i++) {
        const x = (Math.sin(i * 567.8) + 1) / 2 * width;
        const y = (Math.cos(i * 123.4) + 1) / 2 * height;
        const size = (Math.sin(i * 89.3) + 1) * 0.8;
        const opacity = 0.3 + (Math.sin(i * 45.1) + 1) * 0.35;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      }

      // Globe base
      const globeGrad = ctx.createRadialGradient(
        centerX - radius / 3, centerY - radius / 3, 0,
        centerX, centerY, radius
      );
      globeGrad.addColorStop(0, '#1a3a5c');
      globeGrad.addColorStop(0.5, '#0f2340');
      globeGrad.addColorStop(1, '#061628');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Globe border glow
      const borderGlow = ctx.createRadialGradient(centerX, centerY, radius - 4, centerX, centerY, radius + 8);
      borderGlow.addColorStop(0, 'rgba(100,180,255,0.4)');
      borderGlow.addColorStop(1, 'rgba(100,180,255,0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = borderGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100,160,220,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude lines
      ctx.strokeStyle = 'rgba(100,160,220,0.15)';
      ctx.lineWidth = 0.8;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        const latRad = (lat * Math.PI) / 180;
        const y = centerY - Math.sin(latRad) * radius;
        const r = Math.cos(latRad) * radius;
        ctx.ellipse(centerX, y, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines
      for (let lon = 0; lon < 180; lon += 30) {
        const lonRad = ((lon + frameRotation) * Math.PI) / 180;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.abs(Math.cos(lonRad)) * radius, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Landmasses
      ctx.fillStyle = 'rgba(30,80,60,0.35)';
      const drawContinent = (points: { lat: number; lon: number }[]) => {
        ctx.beginPath();
        let started = false;
        points.forEach((p) => {
          const lonRad = ((p.lon + frameRotation) * Math.PI) / 180;
          const latRad = (p.lat * Math.PI) / 180;
          const x = centerX + Math.cos(lonRad) * Math.cos(latRad) * radius;
          const y = centerY - Math.sin(latRad) * radius;
          const z = Math.sin(lonRad);
          if (z > -0.1) {
            if (!started) { ctx.moveTo(x, y); started = true; }
            else ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.fill();
      };

      drawContinent([
        { lat: 50, lon: -10 }, { lat: 60, lon: 30 }, { lat: 45, lon: 40 },
        { lat: 35, lon: 35 }, { lat: 30, lon: 50 }, { lat: 20, lon: 60 },
        { lat: 10, lon: 50 }, { lat: -10, lon: 40 }, { lat: -35, lon: 20 },
        { lat: -35, lon: -5 }, { lat: 45, lon: -10 },
      ]);
      drawContinent([
        { lat: 70, lon: -100 }, { lat: 50, lon: -60 }, { lat: 20, lon: -80 },
        { lat: 0, lon: -80 }, { lat: -20, lon: -70 }, { lat: -55, lon: -70 },
        { lat: -50, lon: -75 }, { lat: -20, lon: -80 }, { lat: 30, lon: -120 },
        { lat: 60, lon: -140 }, { lat: 70, lon: -100 },
      ]);
      drawContinent([
        { lat: 30, lon: 60 }, { lat: 50, lon: 80 }, { lat: 70, lon: 100 },
        { lat: 60, lon: 140 }, { lat: 40, lon: 140 }, { lat: 20, lon: 120 },
        { lat: 0, lon: 110 }, { lat: -10, lon: 120 }, { lat: -30, lon: 130 },
        { lat: -40, lon: 150 }, { lat: -35, lon: 140 }, { lat: 10, lon: 100 },
        { lat: 30, lon: 60 },
      ]);

      // Civilizations
      eraGeoOrigins.forEach((origin) => {
        const lonRad = ((origin.location.longitude + frameRotation) * Math.PI) / 180;
        const latRad = (origin.location.latitude * Math.PI) / 180;
        const x = centerX + Math.cos(lonRad) * Math.cos(latRad) * radius;
        const y = centerY - Math.sin(latRad) * radius;
        const z = Math.sin(lonRad);

        if (z > -0.1) {
          const time = Date.now() / 1000;
          const pulse = Math.sin(time * 2 + origin.location.longitude) * 0.3 + 0.7;

          const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
          glow.addColorStop(0, `rgba(234,179,8,${0.9 * pulse})`);
          glow.addColorStop(0.4, `rgba(234,179,8,${0.3 * pulse})`);
          glow.addColorStop(1, 'rgba(234,179,8,0)');
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#eab308';
          ctx.fill();
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = '11px "SF Mono", "Fira Code", monospace';
          ctx.fillStyle = 'rgba(240,240,240,0.9)';
          ctx.textAlign = 'center';
          ctx.fillText(origin.civilization, x, y - 14);
        }
      });

      rotationRef.current = (frameRotation + 0.08) % 360;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [eraGeoOrigins]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    let found: GeoOrigin | null = null;
    eraGeoOrigins.forEach((origin) => {
      const lonRad = ((origin.location.longitude + rotationRef.current) * Math.PI) / 180;
      const latRad = (origin.location.latitude * Math.PI) / 180;
      const mx = centerX + Math.cos(lonRad) * Math.cos(latRad) * radius;
      const my = centerY - Math.sin(latRad) * radius;
      const z = Math.sin(lonRad);
      if (z > -0.1) {
        const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
        if (dist < 18) found = origin;
      }
    });
    setHoveredLocation(found);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-semibold text-amber-400 tracking-wide">{t.title}</h2>
        <div className="flex items-center gap-2 ml-auto">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">{selectedEra?.name || t.selectEra}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative">
          <canvas
            ref={canvasRef}
            width={560}
            height={420}
            className="w-full rounded-xl border border-slate-700/50"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredLocation(null)}
            style={{ cursor: hoveredLocation ? 'pointer' : 'default' }}
          />
          {hoveredLocation && (
            <div className="absolute top-4 left-4 bg-slate-900/95 border border-amber-500/40 rounded-lg p-3 backdrop-blur-sm max-w-[200px]">
              <h3 className="text-amber-400 font-semibold text-sm mb-1">{hoveredLocation.civilization}</h3>
              <p className="text-slate-300 text-xs mb-1">{hoveredLocation.location.name}</p>
              <p className="text-slate-400 text-xs">{t.languageFamily}: <span className="text-slate-300">{hoveredLocation.language_family}</span></p>
              <p className="text-slate-400 text-xs">{t.activeRoots}: <span className="text-amber-400">{hoveredLocation.active_roots.length}</span></p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{t.historicalTimeline}</p>
          <div className="flex flex-col gap-2">
            {eras.map((era, index) => {
              const isActive = era.id === selectedEraId;
              return (
                <button
                  key={era.id}
                  onClick={() => onEraChange(era.id)}
                  className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                      : 'bg-slate-800/50 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400' : 'bg-slate-600'}`} />
                    <span className="text-xs font-medium">{era.name}</span>
                  </div>
                  <span className="text-xs opacity-60 ml-4 font-mono">
                    {era.start_year < 0 ? `${Math.abs(era.start_year)} BCE` : `${era.start_year} CE`}
                    {' — '}
                    {era.end_year < 0 ? `${Math.abs(era.end_year)} BCE` : `${era.end_year} CE`}
                  </span>
                  {isActive && index < eras.length && (
                    <p className="text-xs text-slate-400 mt-1.5 ml-4 leading-relaxed line-clamp-2">{era.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
