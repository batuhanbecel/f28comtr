'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { F28LogoMark } from '@/components/F28LogoMark';
import {
  F28_LOGO_ANIM_PARTS,
  F28_LOGO_VIEWBOX,
  type F28LogoPart,
} from '@/lib/f28LogoPaths';

const BRAND_EASE = [0.76, 0, 0.24, 1] as const;
const MORPH_EASE = [0.32, 0.72, 0, 1] as const;

/** Diagonal slash stroke (leading beat before editorial wipe). */
const SLASH_STROKE_D = 'M207.98 641.85 L521.9 275.97';

const REVEAL_START = 0.62;

const slashStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0.6 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.58, ease: MORPH_EASE },
  },
};

const slashFill: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'polygon(18% 100%, 18% 100%, 18% 100%, 18% 100%)',
  },
  visible: {
    opacity: 1,
    clipPath: 'polygon(0% 100%, 100% 0%, 100% 0%, 0% 100%)',
    transition: { duration: 0.42, ease: BRAND_EASE, delay: 0.34 },
  },
};

function letterReveal(stagger: number): Variants {
  return {
    hidden: { opacity: 0, y: 14, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.82,
        ease: BRAND_EASE,
        delay: REVEAL_START + stagger,
      },
    },
  };
}

const eightReveal: Variants = {
  hidden: { opacity: 0, scale: 0.82, rotate: -6, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: MORPH_EASE, delay: REVEAL_START + 0.28 },
  },
};

const dotPop: Variants = {
  hidden: { opacity: 0, scale: 0, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 520,
      damping: 22,
      delay: REVEAL_START + 0.72,
    },
  },
};

function variantsForPart(part: F28LogoPart, staggerIndex: number): Variants {
  if (part.role === 'eight') return eightReveal;
  if (part.role === 'dot') return dotPop;
  return letterReveal(staggerIndex * 0.11);
}

function MarkShape({
  part,
  variants,
  initial,
  animate,
}: {
  part: F28LogoPart;
  variants: Variants;
  initial: 'hidden';
  animate: 'visible';
}) {
  const style =
    part.role === 'eight'
      ? { transformOrigin: '86% 74%', transformBox: 'fill-box' as const }
      : part.role === 'dot'
        ? { transformOrigin: '50% 50%', transformBox: 'fill-box' as const }
        : undefined;

  const paint = {
    fill: 'currentColor' as const,
    stroke: 'currentColor' as const,
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (part.kind === 'polygon') {
    return (
      <motion.polygon
        points={part.points}
        {...paint}
        style={style}
        variants={variants}
        initial={initial}
        animate={animate}
      />
    );
  }

  return (
    <motion.path
      d={part.d}
      {...paint}
      style={style}
      variants={variants}
      initial={initial}
      animate={animate}
    />
  );
}

function SlashMark() {
  const slash = F28_LOGO_ANIM_PARTS.find((p) => p.role === 'slash');
  if (!slash || slash.kind !== 'polygon') return null;

  return (
    <g aria-hidden>
      <motion.path
        d={SLASH_STROKE_D}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        initial="hidden"
        animate="visible"
        variants={slashStroke}
      />
      <motion.polygon
        points={slash.points}
        fill="currentColor"
        stroke="none"
        initial="hidden"
        animate="visible"
        variants={slashFill}
      />
    </g>
  );
}

interface F28LogoAnimatedProps {
  className?: string;
}

export function F28LogoAnimated({ className = '' }: F28LogoAnimatedProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <F28LogoMark className={className} aria-hidden />;
  }

  const markParts = F28_LOGO_ANIM_PARTS.filter((p) => p.role !== 'slash');
  let stagger = 0;

  return (
    <motion.svg
      viewBox={F28_LOGO_VIEWBOX}
      className={className}
      fill="none"
      aria-hidden
      initial={{ opacity: 0.85, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: BRAND_EASE }}
    >
      <SlashMark />

      <motion.g
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.92 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        transition={{
          clipPath: { delay: REVEAL_START, duration: 1.05, ease: BRAND_EASE },
          opacity: { delay: REVEAL_START, duration: 0.65, ease: BRAND_EASE },
        }}
      >
        {markParts.map((part, i) => {
          const v = variantsForPart(part, stagger);
          if (part.role === 'letter') stagger += 1;
          return (
            <MarkShape
              key={`${part.role}-${i}`}
              part={part}
              variants={v}
              initial="hidden"
              animate="visible"
            />
          );
        })}
      </motion.g>
    </motion.svg>
  );
}
