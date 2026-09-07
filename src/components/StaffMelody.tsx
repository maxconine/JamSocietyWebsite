import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/**
 * Staff geometry — keep in lockstep with `.jam-staff` in index.css.
 * Five 1px lines, 21px apart, repeating every 110px.
 */
const STAFF_PERIOD = 110;
const LINE_0 = 21.5;
const HALF_STEP = 11;

function staffY(staff: number, pitch: number) {
  return staff * STAFF_PERIOD + LINE_0 + pitch * HALF_STEP;
}

function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number) {
  const c1 = 1.35;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function noteWindow(index: number, total: number): [number, number] {
  return [(index / total) * 0.5, 0.36 + (index / total) * 0.52];
}

type Stem = 'up' | 'down';
type Kind = 'quarter' | 'eighth' | 'half';

interface MelodyNote {
  pitch: number;
  staff: 0 | 1;
  kind: Kind;
  beamId?: string;
}

// A short original phrase: rises like a pickup, then settles home.
const MELODY: MelodyNote[] = [
  { pitch: 8, staff: 0, kind: 'quarter' },
  { pitch: 6, staff: 0, kind: 'eighth', beamId: 'a' },
  { pitch: 5, staff: 0, kind: 'eighth', beamId: 'a' },
  { pitch: 4, staff: 0, kind: 'quarter' },
  { pitch: 2, staff: 0, kind: 'eighth', beamId: 'b' },
  { pitch: 1, staff: 0, kind: 'eighth', beamId: 'b' },
  { pitch: 2, staff: 1, kind: 'quarter' },
  { pitch: 3, staff: 1, kind: 'eighth', beamId: 'c' },
  { pitch: 4, staff: 1, kind: 'eighth', beamId: 'c' },
  { pitch: 5, staff: 1, kind: 'quarter' },
  { pitch: 6, staff: 1, kind: 'eighth', beamId: 'd' },
  { pitch: 5, staff: 1, kind: 'eighth', beamId: 'd' },
  { pitch: 6, staff: 1, kind: 'half' },
];

interface FlurryMote {
  phase: number;
  radius: number;
  oval: number;
  size: number;
  spin: number;
  delay: number;
  flagged: boolean;
}

const FLURRY: FlurryMote[] = [
  { phase: 0.2, radius: 92, oval: 0.52, size: 9, spin: 80, delay: 0, flagged: true },
  { phase: 1.4, radius: 118, oval: 0.46, size: 7, spin: -110, delay: 0.04, flagged: false },
  { phase: 2.6, radius: 74, oval: 0.62, size: 11, spin: 50, delay: 0.08, flagged: true },
  { phase: 3.5, radius: 140, oval: 0.4, size: 6, spin: -70, delay: 0.02, flagged: false },
  { phase: 4.8, radius: 88, oval: 0.7, size: 8, spin: 140, delay: 0.12, flagged: true },
  { phase: 5.7, radius: 126, oval: 0.5, size: 10, spin: -40, delay: 0.06, flagged: false },
  { phase: 0.9, radius: 64, oval: 0.58, size: 7, spin: 95, delay: 0.15, flagged: false },
  { phase: 2.1, radius: 108, oval: 0.44, size: 8, spin: -125, delay: 0.1, flagged: true },
  { phase: 3.9, radius: 80, oval: 0.66, size: 6, spin: 60, delay: 0.18, flagged: false },
];

function stemDir(pitch: number): Stem {
  return pitch <= 4 ? 'down' : 'up';
}

function noteScale(width: number) {
  if (width < 520) return 0.72;
  if (width < 800) return 0.86;
  return 1;
}

function landingLayout(width: number) {
  const compact = width < 640;
  const scale = noteScale(width);
  const staffShift = compact ? 1 : 0;
  const left = compact ? width * 0.08 : width * 0.55;
  const right = width * 0.965;
  const count = MELODY.length;
  const span = Math.max(right - left, 80);
  const xs = MELODY.map((_, i) => left + (span * i) / (count - 1));
  return { compact, scale, staffShift, left, right, xs };
}

function stemAttach(scale: number, stem: Stem) {
  const hx = 6.9 * scale;
  const stemLen = 54 * scale;
  return {
    x: stem === 'up' ? hx * 0.78 : -hx * 0.78,
    end: stem === 'up' ? -stemLen : stemLen,
    stroke: Math.max(1.25, 1.55 * scale),
    hx,
  };
}

function NoteHead({ kind, scale }: { kind: Kind; scale: number }) {
  const hx = 6.9 * scale;
  const hy = 5.15 * scale;
  const isHalf = kind === 'half';
  return (
    <ellipse
      cx={0}
      cy={0}
      rx={hx}
      ry={hy}
      transform="rotate(-22)"
      fill={isHalf ? '#fff' : '#000'}
      stroke="#000"
      strokeWidth={isHalf ? Math.max(1.25, 1.55 * scale) : 0.4}
    />
  );
}

function StemLine({ stem, scale }: { stem: Stem; scale: number }) {
  const { x, end, stroke } = stemAttach(scale, stem);
  return (
    <line
      x1={x}
      y1={stem === 'up' ? -0.6 : 0.6}
      x2={x}
      y2={end}
      stroke="#000"
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  );
}

function EighthFlag({ stem, scale }: { stem: Stem; scale: number }) {
  const { x, end } = stemAttach(scale, stem);
  const d =
    stem === 'up'
      ? `M ${x} ${end}
         c ${12 * scale} ${1.5 * scale} ${16 * scale} ${11 * scale} ${12.5 * scale} ${23 * scale}
         c ${-4.5 * scale} ${-7 * scale} ${-8 * scale} ${-14 * scale} ${-12.5 * scale} ${-16.5 * scale} z`
      : `M ${x} ${end}
         c ${12 * scale} ${-1.5 * scale} ${16 * scale} ${-11 * scale} ${12.5 * scale} ${-23 * scale}
         c ${-4.5 * scale} ${7 * scale} ${-8 * scale} ${14 * scale} ${-12.5 * scale} ${16.5 * scale} z`;
  return <path fill="#000" d={d} />;
}

function FlyingMelodyNote({
  note,
  index,
  total,
  width,
  layout,
  progress,
  reduced,
}: {
  note: MelodyNote;
  index: number;
  total: number;
  width: number;
  layout: ReturnType<typeof landingLayout>;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const [start, end] = noteWindow(index, total);
  const t = useTransform(progress, [start, end], [0, 1], { clamp: true });

  const endX = layout.xs[index];
  const endY = staffY(note.staff + layout.staffShift, note.pitch);
  const stem = stemDir(note.pitch);
  const scale = layout.scale;

  const startX = -24 + (index % 5) * 22;
  const startY = 28 + ((index * 37) % 110);
  const swirl = (index % 2 === 0 ? -1 : 1) * (56 + (index % 4) * 18);
  const c1x = width * (0.14 + (index % 3) * 0.06);
  const c1y = 48 + swirl;
  const c2x = (endX + width * 0.3) / 2;
  const c2y = (startY + endY) / 2 - swirl * 0.5;
  const phase = index * 1.17;

  const x = useTransform(t, (v) => {
    if (reduced) return endX;
    const e = easeOutBack(clamp(v));
    const wobble = Math.sin(v * Math.PI * 2.4 + phase) * 26 * Math.sin(v * Math.PI);
    return bezier(e, startX, c1x, c2x, endX) + wobble;
  });
  const y = useTransform(t, (v) => {
    if (reduced) return endY;
    const e = easeOutBack(clamp(v));
    const wobble = Math.cos(v * Math.PI * 2.1 + phase) * 22 * Math.sin(v * Math.PI);
    return bezier(e, startY, c1y, c2y, endY) + wobble;
  });
  const rotate = useTransform(t, (v) => {
    if (reduced) return 0;
    return (1 - easeOutCubic(v)) * (index % 2 === 0 ? 40 : -46) * Math.sin(v * Math.PI * 1.55 + 0.35);
  });
  const opacity = useTransform(t, (v) => (reduced ? 1 : clamp(v * 5)));
  const glyphScale = useTransform(t, (v) => {
    if (reduced) return scale;
    const e = easeOutCubic(v);
    return scale * (0.72 + 0.38 * Math.sin(e * Math.PI) + 0.28 * e);
  });
  const flagOpacity = useTransform(t, (v) => {
    if (note.kind !== 'eighth') return 0;
    if (!note.beamId) return 1;
    if (reduced) return 0;
    return v < 0.88 ? 1 : clamp(1 - (v - 0.88) / 0.12);
  });

  return (
    <motion.g style={{ x, y, rotate, opacity, scale: glyphScale, originX: 0, originY: 0 }}>
      <NoteHead kind={note.kind === 'eighth' ? 'quarter' : note.kind} scale={1} />
      <StemLine stem={stem} scale={1} />
      {note.kind === 'eighth' && (
        <motion.g style={{ opacity: flagOpacity }}>
          <EighthFlag stem={stem} scale={1} />
        </motion.g>
      )}
    </motion.g>
  );
}

function BeamPair({
  a,
  b,
  ia,
  ib,
  layout,
  progress,
  reduced,
}: {
  a: MelodyNote;
  b: MelodyNote;
  ia: number;
  ib: number;
  layout: ReturnType<typeof landingLayout>;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const total = MELODY.length;
  const [a0, a1] = noteWindow(ia, total);
  const [b0, b1] = noteWindow(ib, total);
  const tA = useTransform(progress, [a0, a1], [0, 1], { clamp: true });
  const tB = useTransform(progress, [b0, b1], [0, 1], { clamp: true });
  const opacity = useTransform([tA, tB], ([va, vb]: number[]) => {
    if (reduced) return 1;
    const landed = Math.min(va, vb);
    return clamp((landed - 0.86) / 0.14);
  });

  const scale = layout.scale;
  const stem1 = stemDir(a.pitch);
  const stem2 = stemDir(b.pitch);
  const att1 = stemAttach(scale, stem1);
  const att2 = stemAttach(scale, stem2);
  const x1 = layout.xs[ia] + att1.x;
  const x2 = layout.xs[ib] + att2.x;
  const y1 = staffY(a.staff + layout.staffShift, a.pitch) + att1.end;
  const y2 = staffY(b.staff + layout.staffShift, b.pitch) + att2.end;
  const thick = 4.2 * scale;
  const tilt = stem1 === 'up' ? thick : -thick;

  return (
    <motion.path
      style={{ opacity }}
      fill="#000"
      d={`M ${x1} ${y1} L ${x2} ${y2} L ${x2} ${y2 + tilt} L ${x1} ${y1 + tilt} Z`}
    />
  );
}

function FlurryNote({
  mote,
  width,
  progress,
  reduced,
}: {
  mote: FlurryMote;
  width: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const t = useTransform(progress, [mote.delay, 0.58 + mote.delay], [0, 1], { clamp: true });
  const cx = Math.min(width * 0.28, 260);
  const cy = 72;

  const x = useTransform(t, (v) => {
    const angle = mote.phase + v * Math.PI * 2.35;
    const r = mote.radius * (1 - 0.18 * v) * (0.85 + 0.15 * Math.sin(v * Math.PI * 3));
    return cx + Math.cos(angle) * r;
  });
  const y = useTransform(t, (v) => {
    const angle = mote.phase + v * Math.PI * 2.35;
    const r = mote.radius * (1 - 0.18 * v) * (0.85 + 0.15 * Math.sin(v * Math.PI * 3));
    return cy + Math.sin(angle) * r * mote.oval;
  });
  const opacity = useTransform(t, (v) => (reduced ? 0 : 0.5 * Math.sin(v * Math.PI)));
  const rotate = useTransform(t, (v) => mote.spin * v);
  const s = mote.size / 8;

  if (reduced) return null;

  return (
    <motion.g style={{ x, y, rotate, opacity, originX: 0, originY: 0 }}>
      <ellipse cx={0} cy={0} rx={6.2 * s} ry={4.6 * s} transform="rotate(-22)" fill="#000" />
      {mote.flagged && (
        <>
          <line
            x1={5 * s}
            y1={-0.4}
            x2={5 * s}
            y2={-22 * s}
            stroke="#000"
            strokeWidth={1.3}
            strokeLinecap="round"
          />
          <path
            fill="#000"
            d={`M ${5 * s} ${-22 * s} c ${8 * s} ${1 * s} ${11 * s} ${7 * s} ${9 * s} ${15 * s} c ${-3 * s} ${-5 * s} ${-6 * s} ${-9 * s} ${-9 * s} ${-11 * s} z`}
          />
        </>
      )}
    </motion.g>
  );
}

function MelodyLayer({
  width,
  height,
  layout,
  progress,
  reduced,
}: {
  width: number;
  height: number;
  layout: ReturnType<typeof landingLayout>;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const beamIds = [...new Set(MELODY.map((n) => n.beamId).filter(Boolean))] as string[];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible text-black"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="staff-note-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0.6" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#staff-note-soft)">
        {MELODY.map((note, i) => (
          <FlyingMelodyNote
            key={`note-${i}`}
            note={note}
            index={i}
            total={MELODY.length}
            width={width}
            layout={layout}
            progress={progress}
            reduced={reduced}
          />
        ))}

        {beamIds.map((id) => {
          const ia = MELODY.findIndex((n) => n.beamId === id);
          const ib = MELODY.findIndex((n, i) => n.beamId === id && i !== ia);
          if (ia < 0 || ib < 0) return null;
          return (
            <BeamPair
              key={`beam-${id}`}
              a={MELODY[ia]}
              b={MELODY[ib]}
              ia={ia}
              ib={ib}
              layout={layout}
              progress={progress}
              reduced={reduced}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function StaffMelody({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : true
  );
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.45', 'start 0.05'],
  });

  useLayoutEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    media.addEventListener('change', updateMobile);

    const el = ref.current;
    if (!el) {
      return () => media.removeEventListener('change', updateMobile);
    }
    const updateSize = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => {
      media.removeEventListener('change', updateMobile);
      ro.disconnect();
    };
  }, []);

  const layout = landingLayout(size.w || 800);
  const showNotes = size.w > 0 && !isMobile;

  return (
    <div ref={ref} className="jam-staff relative pt-4 pb-10 mb-16 md:mb-24 overflow-visible">
      {showNotes && (
        <svg
          className="jam-staff-flurry absolute inset-0 z-0 w-full h-full pointer-events-none overflow-visible text-black"
          viewBox={`0 0 ${size.w} ${size.h}`}
          aria-hidden="true"
        >
          {FLURRY.map((mote, i) => (
            <FlurryNote
              key={`flurry-${i}`}
              mote={mote}
              width={size.w}
              progress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </svg>
      )}

      <div className="relative z-10">{children}</div>

      {showNotes && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <MelodyLayer
            width={size.w}
            height={size.h}
            layout={layout}
            progress={scrollYProgress}
            reduced={reduced}
          />
        </div>
      )}
    </div>
  );
}
