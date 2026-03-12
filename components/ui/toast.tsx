import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

// ─── Module-level singleton (no Provider needed) ──────────────────────────────

type AddFn = (item: ToastItem) => void;
let _add: AddFn | null = null;

function emit(message: string, variant: ToastVariant, duration = 4000) {
  if (!_add) return;
  _add({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, message, variant, duration });
}

// ─── Public API ───────────────────────────────────────────────────────────────
// Import { toast } and call toast.success("...") from any component.

export const toast = {
  success: (msg: string, duration?: number) => emit(msg, 'success', duration),
  error:   (msg: string, duration?: number) => emit(msg, 'error',   duration),
  warning: (msg: string, duration?: number) => emit(msg, 'warning', duration),
  info:    (msg: string, duration?: number) => emit(msg, 'info',    duration),
};

// ─── Variant styles ───────────────────────────────────────────────────────────

const VARIANTS: Record<
  ToastVariant,
  {
    bg: string;
    border: string;
    iconColor: string;
    textColor: string;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  }
> = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', iconColor: '#10B981', textColor: '#064E3B', Icon: CheckCircle2  },
  error:   { bg: '#FEF2F2', border: '#FECACA', iconColor: '#EF4444', textColor: '#7F1D1D', Icon: XCircle       },
  warning: { bg: '#FFFBEB', border: '#FDE68A', iconColor: '#D97706', textColor: '#78350F', Icon: AlertTriangle },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', iconColor: '#3B82F6', textColor: '#1E3A8A', Icon: Info          },
};

// ─── Single toast card ────────────────────────────────────────────────────────

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  // 'enter' → opacity 0 + translated; 'idle' → visible; 'exit' → slide out
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const v    = VARIANTS[item.variant];
  const Icon = v.Icon;

  const dismiss = useCallback(() => {
    if (phase === 'exit') return;
    setPhase('exit');
    setTimeout(() => onRemove(item.id), 300);
  }, [item.id, onRemove, phase]);

  useEffect(() => {
    // Kick off enter animation on next tick
    const t1 = setTimeout(() => setPhase('idle'), 16);
    // Auto-dismiss
    timerRef.current = setTimeout(dismiss, item.duration);
    return () => {
      clearTimeout(t1);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const transform =
    phase === 'idle' ? 'translateX(0) scale(1)' : 'translateX(calc(100% + 24px)) scale(0.96)';
  const opacity = phase === 'idle' ? 1 : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '13px 14px 13px 14px',
        borderRadius: '10px',
        border: `1px solid ${v.border}`,
        backgroundColor: v.bg,
        boxShadow: '0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        fontFamily: 'Inter, sans-serif',
        minWidth: '280px',
        maxWidth: '380px',
        pointerEvents: 'all',
        transform,
        opacity,
        transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.22s ease',
        willChange: 'transform, opacity',
      }}
    >
      <Icon size={16} style={{ color: v.iconColor, flexShrink: 0, marginTop: '2px' }} />
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: 500,
          color: v.textColor,
          lineHeight: '1.45',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {item.message}
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#9CA3AF',
          padding: 0,
          lineHeight: 0,
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Toaster container ────────────────────────────────────────────────────────
// Place <Toaster /> once near the root of your app (inside App.tsx).
// It listens for toast() calls and renders up to 5 stacked notifications.

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Register this Toaster as the active sink
    _add = (item) =>
      setToasts((prev) => [...prev.slice(-4), item]); // max 5
    return () => {
      _add = null;
    };
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    // Fixed bottom-right; column-reverse so newest toast sits closest to the corner
    // and older toasts stack upward naturally.
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onRemove={remove} />
      ))}
    </div>
  );
}
