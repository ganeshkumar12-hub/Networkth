import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  Rocket,
  Flame,
  Video,
  Code2,
  Building2,
  Users,
  Sparkles,
} from 'lucide-react';

interface NodeItem {
  id: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  angle: number; // in degrees
  distance: number; // distance from center in px
  color: string;
  highlightText: string;
  partnerId: string;
}

export const NetworkVisualization: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [pulseTick, setPulseTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const nodes: NodeItem[] = [
    {
      id: 'students',
      label: 'Students',
      category: 'Talent & Aspirants',
      icon: GraduationCap,
      angle: 215,
      distance: 195,
      color: '#3b82f6', // blue
      highlightText: 'Career Guidance & Mentorship',
      partnerId: 'professionals',
    },
    {
      id: 'professionals',
      label: 'Professionals',
      category: 'Industry Leaders',
      icon: Briefcase,
      angle: 35,
      distance: 195,
      color: '#0284c7', // sky
      highlightText: 'Mentoring & Knowledge Sharing',
      partnerId: 'students',
    },
    {
      id: 'founders',
      label: 'Founders',
      category: 'Builders & Visionaries',
      icon: Rocket,
      angle: 300,
      distance: 205,
      color: '#8b5cf6', // violet
      highlightText: 'Founder Sessions & Co-Founders',
      partnerId: 'startups',
    },
    {
      id: 'startups',
      label: 'Startups',
      category: 'Early Stage Products',
      icon: Flame,
      angle: 120,
      distance: 200,
      color: '#f97316', // orange
      highlightText: 'Early Users & Community Launch',
      partnerId: 'communities',
    },
    {
      id: 'creators',
      label: 'Creators',
      category: 'Tech Media & Voices',
      icon: Video,
      angle: 170,
      distance: 190,
      color: '#ec4899', // pink
      highlightText: 'Brand Partnerships & Campaigns',
      partnerId: 'brands',
    },
    {
      id: 'brands',
      label: 'Brands',
      category: 'Sponsors & Ecosystems',
      icon: Building2,
      angle: 350,
      distance: 190,
      color: '#10b981', // emerald
      highlightText: 'Creator Discoverability & Reach',
      partnerId: 'creators',
    },
    {
      id: 'developers',
      label: 'Developers',
      category: 'Software Engineers',
      icon: Code2,
      angle: 260,
      distance: 195,
      color: '#6366f1', // indigo
      highlightText: 'Technical Synergy & DevRel',
      partnerId: 'startups',
    },
    {
      id: 'communities',
      label: 'Communities',
      category: 'Niche Tech Hubs',
      icon: Users,
      angle: 75,
      distance: 205,
      color: '#eab308', // amber
      highlightText: 'Community-Led Growth & Feedback',
      partnerId: 'startups',
    },
  ];

  // Primary curated connections
  const coreConnections = [
    { from: 'students', to: 'professionals', label: 'Students ↔ Working Professionals', note: 'Career Guidance & Mentorship' },
    { from: 'creators', to: 'brands', label: 'Brands ↔ Creators', note: 'Discovery & Sponsored Campaigns' },
    { from: 'startups', to: 'communities', label: 'Startups ↔ Target Communities', note: 'Beta Users & Product Feedback' },
    { from: 'developers', to: 'startups', label: 'Developers ↔ Startups', note: 'DevRel & Early Adopters' },
  ];

  const centerCoord = { x: 260, y: 260 };

  const getNodeCoord = (node: NodeItem) => {
    const rad = (node.angle * Math.PI) / 180;
    return {
      x: centerCoord.x + node.distance * Math.cos(rad),
      y: centerCoord.y + node.distance * Math.sin(rad),
    };
  };

  return (
    <div className="relative w-full max-w-[560px] h-[520px] mx-auto select-none flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* SVG Canvas for connection lines */}
      <svg
        viewBox="0 0 520 520"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Rings */}
        <circle
          cx={centerCoord.x}
          cy={centerCoord.y}
          r={195}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="opacity-70"
        />
        <circle
          cx={centerCoord.x}
          cy={centerCoord.y}
          r={120}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="opacity-40"
        />

        {/* Subtle Lines to Center */}
        {nodes.map((n) => {
          const coord = getNodeCoord(n);
          const isHighlighted = activeNode === n.id;
          return (
            <line
              key={`spoke-${n.id}`}
              x1={centerCoord.x}
              y1={centerCoord.y}
              x2={coord.x}
              y2={coord.y}
              stroke={isHighlighted ? n.color : '#cbd5e1'}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={isHighlighted ? 'none' : '3 3'}
              opacity={isHighlighted ? 0.9 : 0.4}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Direct Connections between matching user types */}
        {coreConnections.map((conn) => {
          const nodeA = nodes.find((n) => n.id === conn.from);
          const nodeB = nodes.find((n) => n.id === conn.to);
          if (!nodeA || !nodeB) return null;

          const coordA = getNodeCoord(nodeA);
          const coordB = getNodeCoord(nodeB);
          const isHighlighted =
            activeNode === conn.from ||
            activeNode === conn.to ||
            hoveredLine === `${conn.from}-${conn.to}`;

          return (
            <g key={`conn-${conn.from}-${conn.to}`}>
              {/* Outer stroke for easier clicking/hovering */}
              <line
                x1={coordA.x}
                y1={coordA.y}
                x2={coordB.x}
                y2={coordB.y}
                stroke="transparent"
                strokeWidth={20}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredLine(`${conn.from}-${conn.to}`)}
                onMouseLeave={() => setHoveredLine(null)}
              />
              <line
                x1={coordA.x}
                y1={coordA.y}
                x2={coordB.x}
                y2={coordB.y}
                stroke={isHighlighted ? nodeA.color : '#94a3b8'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={isHighlighted ? '6 4' : '4 4'}
                strokeDashoffset={-pulseTick}
                opacity={isHighlighted ? 0.95 : 0.45}
                filter={isHighlighted ? 'url(#glow)' : undefined}
                className="transition-all duration-200"
              />
            </g>
          );
        })}
      </svg>

      {/* Central Brand Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative group p-4 sm:p-5 rounded-3xl bg-slate-900 border-2 border-indigo-500/60 shadow-xl shadow-indigo-500/20 text-white flex flex-col items-center justify-center cursor-default backdrop-blur-md"
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs sm:text-sm font-mono text-indigo-300 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            NETWORKTH
          </div>
          <span className="text-[11px] font-medium text-slate-300">
            Relevant Discovery
          </span>
        </motion.div>
      </div>

      {/* Orbiting User Type Nodes */}
      {nodes.map((node) => {
        const coord = getNodeCoord(node);
        const isActive = activeNode === node.id || nodes.find(n => n.id === activeNode)?.partnerId === node.id;
        const Icon = node.icon;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="z-20"
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            <div
              className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all duration-300 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-white border-indigo-500 shadow-lg scale-108 ring-2 ring-indigo-500/20'
                  : 'bg-white/95 border-slate-200/90 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: node.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {node.label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {node.category}
                </div>
              </div>
            </div>

            {/* Hover Tooltip showing synergy partner */}
            {activeNode === node.id && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-md z-30 pointer-events-none">
                {node.highlightText}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
