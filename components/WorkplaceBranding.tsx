import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Palette, Upload, Trash2, MoreHorizontal, Plus, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link2, Undo2, Redo2, Highlighter, Eraser } from 'lucide-react';
import { toast } from './ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkplaceBrandingProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

type TabId = 'general' | 'onboarding' | 'portal' | 'email';

interface FaqRow {
  id: string;
  type: string;
  subject: string;
  visible: boolean;
  content: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const FAQ_ROWS: FaqRow[] = [
  {
    id: '1', type: 'QuestionAnswer', subject: 'What is LiquidSpace?', visible: false,
    content: 'LiquidSpace is a marketplace that connects providers of office space (hosts) with users (guests) who need on-demand space. Users of LiquidSpace can search for desks and conference rooms in any city of their choosing using a variety of filters to narrow down results, and can book a desired space directly through the platform.',
  },
  {
    id: '2', type: 'QuestionAnswer', subject: 'Welcome to LiquidSpace!', visible: false,
    content: 'Congratulations, with LiquidSpace you now have access to a global marketplace of on-demand workspaces! Find the perfect space to work or meet at thousands of independent and brand-name flexible office spaces. Book instantly with a click and pay-as-you-go, by the hour, day, month or longer.',
  },
  {
    id: '3', type: 'QuestionAnswer', subject: 'Payments for reservations', visible: false,
    content: 'LiquidSpace provides simple and secure payment processing to book and manage all of your reservations in one place. You may add a credit card to your account to pay for reservations, your card will be charged 24 hours before the start-time of the reservation. If your company is paying you will see the cost of the reservation but will not be required to enter a payment method.',
  },
  {
    id: '4', type: 'QuestionAnswer', subject: 'Where can I book?', visible: false,
    content: 'Your company has configured preferred locations to empower employees with the freedom to choose where to work from a network of approved workspace locations. View recommended locations nearby or use the search bar in the header to search anywhere you need to work.',
  },
  {
    id: '5', type: 'QuestionAnswer', subject: 'How much can I spend?', visible: false,
    content: 'Your company has configured a budget for each employee to empower you with the freedom to make your own workspace choices. You will see a warning on the booking window if you exceed the approved budget limits. If you need to continue you may contact your admin to request help in booking space above your budget limit.',
  },
  {
    id: '6', type: 'QuestionAnswer', subject: 'How do I book a desk or conference room on Liquidspace?', visible: true,
    content: 'Booking is as easy as a few clicks. First– start by going to www.liquidspace.com/teltech and search for the space type, duration, and location where you’d like to book. Once you find something that looks good, click on the listing and it will bring you to a page with a description and (for most listings) an interactive calendar. Then, select the times that you need the space and click the “Book It” button. Many listings are ‘instant book’ and will send you instructions on how to check in right away, but others may require the host to confirm availability before they confirm and send instructions. Feel familiar?',
  },
  {
    id: '7', type: 'QuestionAnswer', subject: 'What happens when I book a desk or conference room? How do I get into the building and know where to go?', visible: true,
    content: 'Each coworking space listing will have its own set of instructions for how to access a desk or conference room. Liquidspace works with each individual provider to make sure that they are prepared to receive folks who book through the platform, so your visit will not be a surprise to your host. Most reservations will involve you checking in at some kind of reception desk, where you can be shown to your booked space.',
  },
  {
    id: '8', type: 'QuestionAnswer', subject: 'Cancellation policy', visible: true,
    content: 'Most LiquidSpace locations have a standard 24-hour cancellation policy to provide the most flexibility for your schedule. However, some venues require an earlier cancellation notice. You can always view the cancellation policy in the bottom right-hand corner of your reservation details.\n\nWe recommend you book ahead and make changes as needed. You can cancel or modify your reservation up to the cancellation notice stated before the start time of your reservation, no questions asked. If you cancel after this period, the full reservation cost will be charged to your payment method.',
  },
  {
    id: '9', type: 'QuestionAnswer', subject: 'I’m trying to book a Liquidspace in a certain city, but there’s a red bubble around the city and it’s not showing anything there. What’s going on?', visible: true,
    content: 'Any listings within 50 miles of an existing Tel Tech office have automatically been restricted. The purpose of this program is to support employees who don’t live near a Tel Tech office and who have an unsustainable working situation. Anyone living in general proximity to a Tel Tech office is expected to utilize that office space (e.g. Bay Area employees should visit our SF office).',
  },
  {
    id: '10', type: 'QuestionAnswer', subject: 'Is there a limit to what I can book?', visible: true,
    content: 'An individual budget limit of $150/USD per day and $800/USD per month has been set. If you need to make a booking that exceeds this limit for a business-approved reason, please contact coworkingspace@teltech.com.',
  },
  {
    id: '11', type: 'QuestionAnswer', subject: 'I can’t find any locations on Liquidspace that are conveniently located for me. Am I out of luck?', visible: true,
    content: 'Liquidspace is constantly bringing new providers and locations online. If you can’t find an existing office location on the platform that works for you, please reach out to coworkingspace@teltech.com and we will see if there is an office space near you that can be onboarded to the platform. If you are already aware of a provider that is close by, please let us know.',
  },
  {
    id: '12', type: 'QuestionAnswer', subject: 'Need help?', visible: true,
    content: 'Contact the LiquidSpace team through chat, email (support@liquidspace.com), or phone at 1-855-257-2665. Our team is here to help you with any questions about the LiquidSpace.com platform or with our flexible office space partners.',
  },
  {
    id: '13', type: 'QuestionAnswer', subject: 'Request to Book', visible: true,
    content: 'Some locations within LiquidSpace will have a ‘Request to book’ button instead of ‘Book it now’. ‘Request to book’ spaces require a person to review the request to confirm availability for the booker. Because of the confirmation step, request to book spaces require 2-day notice so we can confirm space availability in time to notify the booker. It may take up to 1 business day to confirm a space request.\n\nIf the space requested is unavailable during the requested duration, the LiquidSpace team will be available to assist in sourcing an alternative.',
  },
  {
    id: '14', type: 'QuestionAnswer', subject: 'Social Discovery', visible: true,
    content: 'When you have colleagues booking in your area, you’ll be able to see this booking activity week by week in your dashboard. Use this feature to plan coworking days with your team or to network with colleagues of other teams at your company.\n\nIf you wish to keep your booking information private, you can update your visibility by clicking on your profile icon at the top right of your dashboard.\n\nNote: Your booking activity is only visible to coworkers who have set their home base within 50 miles of your home base. Colleagues located outside of your area do not have visibility into your bookings.',
  },
];

const ONBOARDING_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=400&h=250&fit=crop',
];

// Extra stock images handed out by the mock "upload" action.
const UPLOAD_POOL = [
  ...ONBOARDING_IMAGES,
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=400&h=250&fit=crop',
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: {
    fontSize: 14, fontFamily: 'Inter, sans-serif', borderRadius: 8,
    border: '1px solid #D1D5DB', padding: '9px 12px', width: '100%',
    outline: 'none', color: '#374151', backgroundColor: '#fff',
  } as React.CSSProperties,
  label: {
    fontSize: 13, fontWeight: 600, color: '#374151',
    fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6,
  } as React.CSSProperties,
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
    borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff',
    fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
  } as React.CSSProperties,
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
    borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#fff',
    color: '#374151', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  } as React.CSSProperties,
  th: {
    fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' as const,
    letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', textAlign: 'left' as const,
    padding: '10px 16px', borderBottom: '1px solid #E5E7EB',
  } as React.CSSProperties,
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden" style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FAFBFC',
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        backgroundColor: checked ? '#005B94' : '#D1D5DB',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background-color 0.15s', display: 'inline-flex', alignItems: 'center',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2, width: 20, height: 20,
        borderRadius: 10, backgroundColor: '#fff', transition: 'left 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <Toggle checked={checked} onChange={onChange} />
      <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{label}</span>
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ marginTop: 16, padding: '9px 22px', borderRadius: 8, border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
    >
      Save
    </button>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'start', marginBottom: 14 }}>
      <span style={{ ...S.label, marginBottom: 0, paddingTop: 10 }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function TelTechLogo({ height = 30 }: { height?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <svg height={height} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="1" y="1" width="22" height="22" rx="6" fill="#1D4ED8" />
        <path d="M6 8.2h12M12 8.2v8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="18.4" cy="16.6" r="1.7" fill="#38BDF8" />
      </svg>
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: height * 0.62, color: '#1E3A8A', letterSpacing: '-0.02em' }}>
        Tel<span style={{ color: '#1D4ED8' }}>Tech</span>
      </span>
    </span>
  );
}

function UploadCard({ hint = 'JPG or PNG no larger than 5 MB' }: { hint?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-block', border: '1px solid #E5E7EB', borderRadius: 10, padding: '18px 34px', marginBottom: 12 }}>
        <TelTechLogo />
      </div>
      <div>
        <button style={S.btnPrimary} onClick={() => ref.current?.click()}>
          Upload
        </button>
        <input ref={ref} type="file" style={{ display: 'none' }} onChange={() => toast.success('Image uploaded.')} />
      </div>
      <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, sans-serif', fontStyle: 'italic', marginTop: 8 }}>{hint}</p>
    </div>
  );
}

// Static toolbar mimicking the production rich-text editor chrome.
function RichToolbar() {
  const icons = [Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, Eraser, Link2, Undo2, Redo2];
  return (
    <div style={{
      display: 'flex', gap: 2, padding: '5px 8px', border: '1px solid #D1D5DB',
      borderTop: 'none', borderRadius: '0 0 8px 8px', backgroundColor: '#FAFBFC', flexWrap: 'wrap',
    }}>
      {icons.map((I, i) => (
        <button key={i} style={{ border: 'none', background: 'none', padding: 5, borderRadius: 4, cursor: 'pointer', color: '#374151', display: 'inline-flex' }} className="hover:bg-gray-200">
          <I className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function RichTextArea({ value, onChange, minHeight = 90 }: { value: string; onChange: (v: string) => void; minHeight?: number }) {
  return (
    <div>
      <textarea
        style={{ ...S.input, minHeight, resize: 'vertical', borderRadius: '8px 8px 0 0', display: 'block' }}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <RichToolbar />
    </div>
  );
}

// ─── Tab: General ─────────────────────────────────────────────────────────────

function GeneralTab() {
  const [hqLabel, setHqLabel] = useState('Tel Tech Office');
  const [hqColor, setHqColor] = useState('#1D4ED8');
  const [hqColorHover, setHqColorHover] = useState('#1E3A8A');

  return (
    <>
      <Card title="Header Preview">
        <div style={{
          border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 22px',
          display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#fff',
        }}>
          <TelTechLogo height={26} />
          <span style={{ width: 1, height: 26, backgroundColor: '#E5E7EB' }} />
          <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Powered by <span style={{ fontWeight: 600, color: '#005B94' }}>LiquidSpace</span>
          </span>
        </div>
      </Card>

      <Card title="Header Image">
        <UploadCard />
      </Card>

      <Card title="Map Pin">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
            <iframe
              title="Map pin preview"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4494%2C37.7549%2C-122.3694%2C37.7949&layer=mapnik&marker=37.7719%2C-122.4094"
              style={{ width: '100%', height: 240, border: 'none', display: 'block' }}
            />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
              Preview of how your branded HQ pin appears on the member search map. The pin uses your HQ Pin label and colors below.
            </p>
          </div>
        </div>
      </Card>

      <Card title="HQ Pin">
        <div style={{ maxWidth: 640 }}>
          <FieldRow label="Label">
            <input style={S.input} value={hqLabel} onChange={e => setHqLabel(e.target.value)} />
          </FieldRow>
          <FieldRow label="Color">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={hqColor} onChange={e => setHqColor(e.target.value)} style={{ width: 42, height: 38, border: '1px solid #D1D5DB', borderRadius: 8, padding: 2, cursor: 'pointer', backgroundColor: '#fff' }} />
              <input style={{ ...S.input, maxWidth: 140 }} value={hqColor} onChange={e => setHqColor(e.target.value)} />
            </div>
          </FieldRow>
          <FieldRow label="Color hover">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={hqColorHover} onChange={e => setHqColorHover(e.target.value)} style={{ width: 42, height: 38, border: '1px solid #D1D5DB', borderRadius: 8, padding: 2, cursor: 'pointer', backgroundColor: '#fff' }} />
              <input style={{ ...S.input, maxWidth: 140 }} value={hqColorHover} onChange={e => setHqColorHover(e.target.value)} />
            </div>
          </FieldRow>
          <FieldRow label="Logo">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 14px' }}>
                <TelTechLogo height={20} />
              </div>
              <button style={S.btnOutline} onClick={() => toast.success('Logo uploaded.')}>
                <Upload className="h-3.5 w-3.5" /> Upload
              </button>
              <button style={{ ...S.btnOutline, color: '#DC2626' }} onClick={() => toast.info('Logo deleted.')}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </FieldRow>
          <SaveBtn onClick={() => toast.success('Branding saved.')} />
        </div>
      </Card>
    </>
  );
}

// ─── Tab: Onboarding ──────────────────────────────────────────────────────────

function OnboardingTab() {
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome to LiquidSpace for Tel Tech');
  const [welcomeTitle, setWelcomeTitle] = useState('Book coworking space near you');
  const [welcomeContent, setWelcomeContent] = useState(
    'You’ve been granted access to book space in coworking office spaces to support your productivity. Search desks and conference rooms near your home, book with a click, and get to work — Tel Tech pays centrally, so you’ll never be charged.'
  );
  const [videoUrl, setVideoUrl] = useState('https://vimeo.com/liquidspace/getstarted');
  const [images, setImages] = useState<string[]>(ONBOARDING_IMAGES);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    const next = UPLOAD_POOL.find(src => !images.includes(src));
    if (!next) { toast.info('Image gallery is full.'); return; }
    setImages(prev => [...prev, next]);
    toast.success('Image uploaded.');
  };

  return (
    <>
      <Card title="Onboarding Images">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {images.map((src, i) => (
            <div key={src} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB', aspectRatio: '16/10' }}>
              <img src={src} alt={`Onboarding ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={() => { setImages(prev => prev.filter(s => s !== src)); toast.info('Image removed.'); }}
                style={{
                  position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14,
                  border: 'none', backgroundColor: 'rgba(255,255,255,0.92)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => uploadRef.current?.click()}
            style={{
              border: '2px dashed #D1D5DB', borderRadius: 10, aspectRatio: '16/10',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: 'pointer', backgroundColor: '#FAFBFC', color: '#6B7280',
              fontSize: 13, fontFamily: 'Inter, sans-serif',
            }}
            className="hover:border-blue-300 transition-colors"
          >
            <Upload className="h-5 w-5" style={{ color: '#9CA3AF' }} />
            Upload image
          </button>
          <input ref={uploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleUploadImage(); e.target.value = ''; }} />
        </div>
      </Card>

      <Card title="Welcome">
        <div style={{ maxWidth: 720 }}>
          <FieldRow label="Welcome message">
            <input style={S.input} value={welcomeMsg} onChange={e => setWelcomeMsg(e.target.value)} />
          </FieldRow>
          <FieldRow label="Title">
            <input style={S.input} value={welcomeTitle} onChange={e => setWelcomeTitle(e.target.value)} />
          </FieldRow>
          <FieldRow label="Content">
            <textarea style={{ ...S.input, minHeight: 110, resize: 'vertical' }} value={welcomeContent} onChange={e => setWelcomeContent(e.target.value)} />
          </FieldRow>
          <FieldRow label="Get Started Video">
            <input style={S.input} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://" />
          </FieldRow>
          <SaveBtn onClick={() => toast.success('Onboarding settings saved.')} />
        </div>
      </Card>
    </>
  );
}

// ─── Tab: Portal ──────────────────────────────────────────────────────────────

function FaqRowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#9CA3AF', display: 'inline-flex' }}
        className="hover:bg-gray-100"
        onClick={() => setOpen(o => !o)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 30,
          backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 130, overflow: 'hidden', padding: 4,
        }}>
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, fontFamily: 'Inter, sans-serif', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, color: '#374151' }}
            className="hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, fontFamily: 'Inter, sans-serif', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, color: '#DC2626' }}
            className="hover:bg-gray-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function PortalTab() {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [portalUrl, setPortalUrl] = useState('https://www.liquidspace.com/teltech');
  const [portalType, setPortalType] = useState('Marketplace');
  const [faqs, setFaqs] = useState<FaqRow[]>(FAQ_ROWS);
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerTitle, setBannerTitle] = useState('Tel Tech + Liquidspace');
  const [bannerSubtitle, setBannerSubtitle] = useState(
    'You’ve been granted access to book space in coworking office spaces to support your productivity. Click to learn more about the rules and guidelines of this program.'
  );
  const [popupTitle, setPopupTitle] = useState('Tel Tech + Liquidspace');
  const [popupContent, setPopupContent] = useState(
    'Welcome to Liquidspace! We encourage you to use this platform to book desks and conference rooms in coworking spaces near your home to enable your day-to-day work.\n\nPlease note: bookings are not allowed and have been restricted within 50 miles of most existing Tel Tech offices (with the exception of NYC, Los Angeles, and Washington DC). If you are traveling to an area where we have a Tel Tech office, you can access our office by registering at tel.tech/register.\n\nBookings are paid for centrally by Tel Tech, and you/your team will not be charged. However, we ask that you please book responsibly and only use space that is the right size and for only the amount of time that you need it. All members are subject to a $150/day and $800/month booking limit.\n\nAdditional program information for our coworking support program can be found at tel.tech/coworkingspace'
  );
  const [forcePopup, setForcePopup] = useState(false);

  // FAQ add/edit modal
  const [faqModal, setFaqModal] = useState<'none' | 'add' | 'edit'>('none');
  const [faqForm, setFaqForm] = useState({ id: '', subject: '', content: '', visible: true });

  const toggleVisible = (id: string) =>
    setFaqs(rows => rows.map(r => r.id === id ? { ...r, visible: !r.visible } : r));

  const openAddFaq = () => {
    setFaqForm({ id: '', subject: '', content: '', visible: true });
    setFaqModal('add');
  };

  const openEditFaq = (row: FaqRow) => {
    setFaqForm({ id: row.id, subject: row.subject, content: row.content, visible: row.visible });
    setFaqModal('edit');
  };

  const handleSaveFaq = () => {
    const subject = faqForm.subject.trim();
    const content = faqForm.content.trim();
    if (!subject || !content) return;
    if (faqModal === 'add') {
      setFaqs(rows => [...rows, { id: String(Date.now()), type: 'QuestionAnswer', subject, content, visible: faqForm.visible }]);
      toast.success('Content added.');
    } else {
      setFaqs(rows => rows.map(r => r.id === faqForm.id ? { ...r, subject, content, visible: faqForm.visible } : r));
      toast.success('Content updated.');
    }
    setFaqModal('none');
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(rows => rows.filter(r => r.id !== id));
    toast.info('Content deleted.');
  };

  return (
    <>
      <Card title="Portal">
        <div style={{ maxWidth: 720 }}>
          <ToggleRow label="Enable Portal" checked={portalEnabled} onChange={setPortalEnabled} />
          <FieldRow label="URL">
            <input style={S.input} value={portalUrl} onChange={e => setPortalUrl(e.target.value)} />
          </FieldRow>
          <FieldRow label="Type">
            <select style={{ ...S.input, cursor: 'pointer' }} value={portalType} onChange={e => setPortalType(e.target.value)}>
              <option>Marketplace</option>
              <option>Curated</option>
              <option>Private</option>
            </select>
          </FieldRow>
          <SaveBtn onClick={() => toast.success('Portal settings saved.')} />
        </div>
      </Card>

      <Card
        title="FAQ Editor"
        action={
          <button style={S.btnPrimary} onClick={openAddFaq}>
            <Plus className="h-3.5 w-3.5" /> Add Content
          </button>
        }
      >
        <div style={{ margin: -20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: 130 }}>Type</th>
                <th style={{ ...S.th, width: 200 }}>Subject</th>
                <th style={{ ...S.th, width: 70 }}>Visible</th>
                <th style={S.th}>Content</th>
                <th style={{ ...S.th, width: 50 }} />
              </tr>
            </thead>
            <tbody>
              {faqs.map(row => (
                <tr key={row.id} style={{ verticalAlign: 'top' }}>
                  <td style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151', padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
                    {row.type}
                  </td>
                  <td style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151', padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
                    {row.subject}
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.visible}
                      onChange={() => toggleVisible(row.id)}
                      style={{ width: 17, height: 17, accentColor: '#005B94', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#4B5563', padding: '16px', borderBottom: '1px solid #F3F4F6', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {row.content}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', textAlign: 'right' }}>
                    <FaqRowMenu
                      onEdit={() => openEditFaq(row)}
                      onDelete={() => handleDeleteFaq(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Banner">
        <div style={{ maxWidth: 900 }}>
          <ToggleRow label="Enable Banner" checked={bannerEnabled} onChange={setBannerEnabled} />
          <FieldRow label="Banner Title">
            <input style={S.input} value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} />
          </FieldRow>
          <FieldRow label="Banner Subtitle">
            <RichTextArea value={bannerSubtitle} onChange={setBannerSubtitle} minHeight={80} />
          </FieldRow>
          <FieldRow label="Popup Title">
            <input style={S.input} value={popupTitle} onChange={e => setPopupTitle(e.target.value)} />
          </FieldRow>
          <FieldRow label="Popup Content">
            <RichTextArea value={popupContent} onChange={setPopupContent} minHeight={260} />
          </FieldRow>
          <ToggleRow label="Force Popup" checked={forcePopup} onChange={setForcePopup} />
          <SaveBtn onClick={() => toast.success('Banner saved.')} />
        </div>
      </Card>

      {/* ── Add / Edit Content modal ─────────────────────────────────────── */}
      <Dialog open={faqModal !== 'none'} onOpenChange={open => { if (!open) setFaqModal('none'); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: 12 }}>
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                {faqModal === 'add' ? 'Add Content' : 'Edit Content'}
              </DialogTitle>
              <DialogDescription style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                Question & answer shown on your member portal
              </DialogDescription>
            </DialogHeader>
          </div>
          <div style={{ padding: 20 }}>
            <label style={S.label}>Type</label>
            <input style={{ ...S.input, backgroundColor: '#F9FAFB', color: '#6B7280' }} value="QuestionAnswer" readOnly />
            <label style={{ ...S.label, marginTop: 14 }}>Subject</label>
            <input
              style={S.input}
              value={faqForm.subject}
              onChange={e => setFaqForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. How do I cancel a reservation?"
              autoFocus
            />
            <label style={{ ...S.label, marginTop: 14 }}>Content</label>
            <textarea
              style={{ ...S.input, minHeight: 140, resize: 'vertical' }}
              value={faqForm.content}
              onChange={e => setFaqForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Answer shown to members…"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <input
                type="checkbox"
                id="faq-visible"
                checked={faqForm.visible}
                onChange={e => setFaqForm(f => ({ ...f, visible: e.target.checked }))}
                style={{ width: 17, height: 17, accentColor: '#005B94', cursor: 'pointer' }}
              />
              <label htmlFor="faq-visible" style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#374151', cursor: 'pointer' }}>
                Visible on portal
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button style={S.btnOutline} onClick={() => setFaqModal('none')}>Cancel</button>
              <button
                style={{ ...S.btnPrimary, opacity: faqForm.subject.trim() && faqForm.content.trim() ? 1 : 0.5 }}
                disabled={!faqForm.subject.trim() || !faqForm.content.trim()}
                onClick={handleSaveFaq}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Tab: Email ───────────────────────────────────────────────────────────────

function EmailTab() {
  const [brandedEmail, setBrandedEmail] = useState(true);
  const [from, setFrom] = useState('Liquidspace');
  const [programName, setProgramName] = useState('Liquidspace for Tel Tech');
  const [inviteMsg, setInviteMsg] = useState(
    'Hi there,\n\nYou’ve been granted access to LiquidSpace and can now book desks and conference rooms in nearby coworking spaces.\n\nPlease note: Liquidspace is integrated with Tel Tech’s Okta platform, so it can take up to 48 hours for your access to be granted after you receive this email. If after 48 hours you get an "access denied" email when trying to log in, please contact us at coworkingspace@teltech.com.'
  );
  const [venueGroupId, setVenueGroupId] = useState('');
  const [customCss, setCustomCss] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
      <Card title="Header Image">
        <UploadCard />
      </Card>

      <Card title="Email">
        <ToggleRow label="Enable Branded Email" checked={brandedEmail} onChange={setBrandedEmail} />
        <FieldRow label="From">
          <input style={S.input} value={from} onChange={e => setFrom(e.target.value)} />
        </FieldRow>
        <FieldRow label="Program Name">
          <input style={S.input} value={programName} onChange={e => setProgramName(e.target.value)} />
        </FieldRow>
        <FieldRow label="Custom Invite Message">
          <textarea style={{ ...S.input, minHeight: 170, resize: 'vertical' }} value={inviteMsg} onChange={e => setInviteMsg(e.target.value)} />
        </FieldRow>
        <FieldRow label="Venue Group Id">
          <input style={S.input} value={venueGroupId} onChange={e => setVenueGroupId(e.target.value)} />
        </FieldRow>
        <FieldRow label="Custom CSS">
          <textarea style={{ ...S.input, minHeight: 160, resize: 'vertical', fontFamily: 'ui-monospace, monospace', fontSize: 13 }} value={customCss} onChange={e => setCustomCss(e.target.value)} />
        </FieldRow>
        <SaveBtn onClick={() => toast.success('Email settings saved.')} />
      </Card>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: 'general',    label: 'General' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'portal',     label: 'Portal' },
  { id: 'email',      label: 'Email' },
];

export function WorkplaceBranding({ onAIAssistantOpen, isAIDrawerOpen }: WorkplaceBrandingProps) {
  const [tab, setTab] = useState<TabId>('general');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-page, #F9FAFB)' }}>
      <PageHeader
        icon={<Palette className="h-6 w-6" />}
        title="Branding"
        subtitle="Customize your members’ branded experience across web, portal, and email."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
        hideAIButton
      />
      <div style={{ padding: 24, maxWidth: 1080, margin: '0 auto' }}>
        {/* Tab bar */}
        <div className="rounded-2xl border border-gray-200 bg-white" style={{ display: 'flex', gap: 4, padding: '6px 10px', marginBottom: 20 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 14, fontFamily: 'Inter, sans-serif',
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? '#005B94' : '#6B7280',
                borderBottom: tab === t.id ? '2px solid #005B94' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'general'    && <GeneralTab />}
        {tab === 'onboarding' && <OnboardingTab />}
        {tab === 'portal'     && <PortalTab />}
        {tab === 'email'      && <EmailTab />}
      </div>
    </div>
  );
}
