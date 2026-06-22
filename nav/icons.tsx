import React from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  CreditCard,
  DollarSign,
  File,
  HelpCircle,
  Home,
  Layers,
  Lock,
  Map,
  MapPin,
  Menu,
  Palette,
  Plus,
  Search,
  Settings,
  Shield,
  Sliders,
  Users,
  X,
  Zap,
} from 'lucide-react';

type IconComponent = React.FC<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  'activity':         Activity,
  'alert-triangle':   AlertTriangle,
  'bar-chart':        BarChart2,
  'bell':             Bell,
  'book-open':        BookOpen,
  'bot':              Bot,
  'briefcase':        Briefcase,
  'building-2':       Building2,
  'check-square':     CheckSquare,
  'chevron-down':     ChevronDown,
  'chevron-right':    ChevronRight,
  'chevrons-left':    ChevronsLeft,
  'chevrons-right':   ChevronsRight,
  'chevrons-up-down': ChevronsUpDown,
  'credit-card':      CreditCard,
  'dollar-sign':      DollarSign,
  'file':             File,
  'home':             Home,
  'layers':           Layers,
  'lock':             Lock,
  'map':              Map,
  'map-pinned':       MapPin,
  'menu':             Menu,
  'palette':          Palette,
  'plus':             Plus,
  'search':           Search,
  'settings':         Settings,
  'shield':           Shield,
  'sliders':          Sliders,
  'users':            Users,
  'x':                X,
  'zap':              Zap,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

export function Icon({ name, size = 16, color, style, strokeWidth = 2 }: IconProps) {
  const Comp: IconComponent = ICON_MAP[name] ?? HelpCircle;
  return <Comp size={size} color={color} style={style} strokeWidth={strokeWidth} />;
}
