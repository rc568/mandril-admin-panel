import { useEffect, useRef, useState } from 'react';

export const useHandleTooltip = (delay = 3000) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => setOpen(false), delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    open,
    show
  };
};
