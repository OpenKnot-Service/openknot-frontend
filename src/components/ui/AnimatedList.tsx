import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface AnimatedListProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}

export const AnimatedList = ({ className, children, delay = 1000 }: AnimatedListProps) => {
  const [index, setIndex] = useState(0);
  const childrenArray = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);

  useEffect(() => {
    if (index >= childrenArray.length - 1) return;

    const timeout = setTimeout(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, childrenArray.length, delay]);

  const itemsToShow = useMemo(() => {
    return childrenArray.slice(0, index + 1);
  }, [index, childrenArray]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <AnimatePresence mode="sync">
        {itemsToShow.map((item) => (
          <AnimatedListItem key={(item as ReactElement).key}>{item}</AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
};

export function AnimatedListItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: 0 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{
        x: 450,
        opacity: 0,
        scale: 0.9,
        transition: {
          x: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 }
        }
      }}
      transition={{
        scale: { type: 'spring', stiffness: 350, damping: 40 },
        opacity: { duration: 0.2 },
        layout: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      }}
      layout
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}
