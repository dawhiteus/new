import React, { useEffect, useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { toast } from './ui/toast';
import type { RequirementDocument } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const BLUE = '#0D619B';
const INK = '#0F2A3D';

const fmtSize = (b: number) => {
  const kb = b / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${Number(kb.toFixed(2))} KB`;
};
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function DocMenu({ onDownload, onRemove }: { onDownload: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const item = (label: string, fn: () => void) => (
    <button key={label} onClick={() => { setOpen(false); fn(); }} className="hover:bg-gray-100"
      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 24px 8px 16px', fontSize: 14, color: INK, fontFamily: FONT, background: 'transparent', border: 'none', cursor: 'pointer' }}>
      {label}
    </button>
  );
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button aria-label="Document actions" onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: open ? `2px solid #9CC3E0` : '2px solid transparent', borderRadius: 4, cursor: 'pointer', color: '#9CA3AF', padding: '2px 6px', display: 'inline-flex' }}>
        <span style={{ letterSpacing: 2, fontSize: 18, lineHeight: 1 }}>•••</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 30, minWidth: 150, background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', padding: '6px 0', marginTop: 4 }}>
          {item('Download', onDownload)}
          {item('Remove', onRemove)}
        </div>
      )}
    </div>
  );
}

interface Props {
  documents: RequirementDocument[];
  onChange: (docs: RequirementDocument[]) => void;
}

export function RequirementDocumentsTab({ documents, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    const added: RequirementDocument[] = list.map((f, i) => ({
      id: `doc-${Date.now()}-${i}`,
      name: f.name,
      sizeBytes: f.size,
      uploadedAt: today(),
      url: URL.createObjectURL(f),
    }));
    onChange([...documents, ...added]);
  };

  const download = (d: RequirementDocument) => {
    if (!d.url) {
      toast.info('This sample document is not downloadable in the demo.');
      return;
    }
    const a = document.createElement('a');
    a.href = d.url;
    a.download = d.name;
    a.click();
  };

  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${drag ? BLUE : '#E5E7EB'}`, background: drag ? '#F0F7FF' : '#fff', borderRadius: 20, padding: '40px 20px 44px', textAlign: 'center', cursor: 'pointer', fontFamily: FONT }}
      >
        <Upload size={44} color="#6B7280" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: 18, fontWeight: 600, color: INK, marginBottom: 8 }}>Upload Document</div>
        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>Drag and drop files here or click to browse</div>
        <span style={{ display: 'inline-block', background: '#F1F3F5', color: INK, borderRadius: 8, padding: '12px 18px', fontSize: 15, fontWeight: 500 }}>Choose Files</span>
        <input ref={inputRef} type="file" multiple className="hidden" onClick={(e) => e.stopPropagation()}
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} />
      </div>

      {documents.length > 0 && (
        <div style={{ marginTop: 28, paddingBottom: 90 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: INK, fontFamily: FONT, marginBottom: 16 }}>Associated Documents</div>
          {documents.map((d) => (
            <div key={d.id} style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 16, fontFamily: FONT }}>
              <FileText size={28} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: INK, wordBreak: 'break-word' }}>{d.name}</div>
                <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{fmtSize(d.sizeBytes)} • {d.uploadedAt}</div>
              </div>
              <DocMenu onDownload={() => download(d)} onRemove={() => onChange(documents.filter((x) => x.id !== d.id))} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
