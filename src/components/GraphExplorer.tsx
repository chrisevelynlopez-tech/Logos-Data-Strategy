import { useEffect, useRef, useState } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { LinguisticRoot, RootConnection } from '../types';
import type { Language } from '../App';

interface GraphExplorerProps {
  roots: LinguisticRoot[];
  connections: RootConnection[];
  lang: Language;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  root: LinguisticRoot;
}

interface Edge {
  source: Node;
  target: Node;
  connection: RootConnection;
}

const translations = {
  en: {
    title: 'Root Network',
    semantic: 'Semantic',
    conceptual: 'Conceptual',
    relational: 'Relational',
    causal: 'Causal',
    clickNode: 'Click a node to explore',
    connections: 'connections',
    category: 'Category',
    numericValue: 'Gematria',
    graphCanvasTitle: 'LDS-Matrix Graph Canvas',
    graphCanvasSubtitle: 'Future Neo4j Integration',
    graphCanvasStatus: 'RESERVED FOR VECTOR NODE RENDERING',
    systemStatus: 'ONLINE',
    nodeCount: 'Nodes',
    edgeCount: 'Edges',
  },
  es: {
    title: 'Red de Raices',
    semantic: 'Semantica',
    conceptual: 'Conceptual',
    relational: 'Relacional',
    causal: 'Causal',
    clickNode: 'Haz clic en un nodo para explorar',
    connections: 'conexiones',
    category: 'Categoria',
    numericValue: 'Guematria',
    graphCanvasTitle: 'Lienzo de Grafo LDS-Matrix',
    graphCanvasSubtitle: 'Futura Integracion Neo4j',
    graphCanvasStatus: 'RESERVADO PARA RENDERIZADO DE NODOS VECTORIALES',
    systemStatus: 'EN LINEA',
    nodeCount: 'Nodos',
    edgeCount: 'Aristas',
  },
} as const;

const CONNECTION_COLORS: Record<string, string> = {
  semantic: '#22c55e',
  conceptual: '#3b82f6',
  relational: '#f59e0b',
  causal: '#ef4444',
};

export function GraphExplorer({ roots, connections, lang }: GraphExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const t = translations[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || roots.length === 0) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const initialNodes: Node[] = roots.map((root, i) => {
      const angle = (i / roots.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 140;
      return {
        id: root.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        root,
      };
    });

    const initialEdges: Edge[] = connections
      .map(conn => {
        const source = initialNodes.find(n => n.id === conn.source_root_id);
        const target = initialNodes.find(n => n.id === conn.target_root_id);
        if (!source || !target) return null;
        return { source, target, connection: conn };
      })
      .filter((e): e is Edge => e !== null);

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [roots, connections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#060e1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(zoom, zoom);

      const time = Date.now() / 1000;

      // Draw edges
      edges.forEach(edge => {
        const pulse = Math.sin(time * 1.5) * 0.2 + 0.8;
        const color = CONNECTION_COLORS[edge.connection.connection_type] || '#f59e0b';
        const strength = edge.connection.strength / 10;

        ctx.beginPath();
        ctx.moveTo(edge.source.x, edge.source.y);
        ctx.lineTo(edge.target.x, edge.target.y);
        ctx.strokeStyle = `${color}${Math.round(pulse * 0.35 * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = strength * 3;
        ctx.stroke();

        if (edge.source === selectedNode || edge.target === selectedNode) {
          const midX = (edge.source.x + edge.target.x) / 2;
          const midY = (edge.source.y + edge.target.y) / 2;
          ctx.font = '9px monospace';
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.fillText(edge.connection.connection_type, midX, midY - 6);
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const { x, y } = node;

        const glowR = isSelected ? 55 : 38;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        gradient.addColorStop(0, isSelected ? 'rgba(251,191,36,0.55)' : 'rgba(234,179,8,0.25)');
        gradient.addColorStop(1, 'rgba(234,179,8,0)');
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 26, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#92400e' : '#0f2340';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#fbbf24' : '#2563eb';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        ctx.font = `bold ${node.root.root.length > 2 ? '14px' : '18px'} serif`;
        ctx.fillStyle = isSelected ? '#fde047' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.root.root, x, y);

        ctx.font = '9px monospace';
        ctx.fillStyle = isSelected ? '#fbbf24' : '#64748b';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(node.root.transliteration, x, y + 36);
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [nodes, edges, selectedNode, zoom, offset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;

    let found: Node | null = null;
    nodes.forEach(node => {
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist < 30) found = node;
    });
    setSelectedNode(found);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedNode) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  const nodeConnections = selectedNode
    ? edges.filter(e => e.source.id === selectedNode.id || e.target.id === selectedNode.id)
    : [];

  const gematriaValue = selectedNode
    ? selectedNode.root.atomic_composition.reduce((sum, a) => sum + a.value, 0)
    : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Matrix Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded-md">
            <Network className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">LDS-Network</span>
          </div>
          <h2 className="text-xl font-semibold text-emerald-400 tracking-wide">{t.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-emerald-500 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="p-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-emerald-500 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={resetView} className="p-1.5 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-emerald-500 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Graph Canvas */}
        <div className="lg:col-span-2">
          <div className="relative bg-[#020617] border border-emerald-500/30 rounded-xl overflow-hidden">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-500/40" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-500/40" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-500/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-500/40" />

            <canvas
              ref={canvasRef}
              width={560}
              height={420}
              className="w-full"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : selectedNode ? 'pointer' : 'grab' }}
            />

            {/* Status bar */}
            <div className="absolute bottom-2 left-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-600/50 uppercase tracking-wider">{t.systemStatus}</span>
            </div>

            <div className="absolute bottom-2 right-3 flex items-center gap-4 text-xs font-mono text-emerald-600/50">
              <span>{t.nodeCount}: <span className="text-emerald-400">{nodes.length}</span></span>
              <span className="text-emerald-600/30">|</span>
              <span>{t.edgeCount}: <span className="text-emerald-400">{edges.length}</span></span>
            </div>

            {/* Matrix watermark */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-950/70 border border-emerald-500/30 rounded-md">
                <Layers className="w-3.5 h-3.5 text-emerald-500/70" />
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
                  {t.graphCanvasTitle}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600/40 mt-1">{t.graphCanvasSubtitle}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {selectedNode ? (
            <div className="bg-[#020617] border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-emerald-400" style={{ fontFamily: 'serif', direction: 'rtl' }}>
                  {selectedNode.root.root}
                </span>
                <span className="text-lg text-emerald-300/70 font-mono">{selectedNode.root.transliteration}</span>
              </div>
              <p className="text-emerald-300/80 text-sm mb-3 leading-relaxed">{selectedNode.root.core_meaning}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono">
                  {selectedNode.root.category}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono">
                  {t.numericValue}: {gematriaValue}
                </span>
              </div>
              <p className="text-xs text-emerald-600/70 font-mono mb-2">{nodeConnections.length} {t.connections}</p>
              <div className="flex flex-col gap-1.5">
                {nodeConnections.slice(0, 4).map((edge, i) => {
                  const other = edge.source.id === selectedNode.id ? edge.target : edge.source;
                  const color = CONNECTION_COLORS[edge.connection.connection_type] || '#10b981';
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-emerald-400 font-mono">{other.root.root}</span>
                      <span className="text-emerald-600/40">—</span>
                      <span className="text-emerald-500/70">{edge.connection.connection_type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#020617] border border-emerald-500/20 rounded-xl p-4 flex items-center justify-center h-32">
              <p className="text-emerald-600/60 text-sm text-center font-mono">{t.clickNode}</p>
            </div>
          )}

          <div className="bg-[#020617] border border-emerald-500/20 rounded-xl p-4">
            <p className="text-xs text-emerald-600/60 uppercase tracking-widest mb-3 font-mono">Connection Types</p>
            <div className="flex flex-col gap-2">
              {Object.entries(CONNECTION_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded" style={{ backgroundColor: color }} />
                  <span className="text-xs text-emerald-500/70 font-mono capitalize">
                    {t[type as keyof typeof t] as string}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
