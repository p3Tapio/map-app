import { useState, useEffect } from 'react';

const useContainerWidth = (): { width: number } | null => {
  const [containerWidth, setContainerWidth] = useState<undefined | { width: number }>(undefined);

  useEffect(() => {
    const container = document.getElementById('mainContainer');
    if (!containerWidth && container) setContainerWidth({ width: container.clientWidth });
    const handleResize = (): void => {
      if (container) setContainerWidth({ width: container.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, [containerWidth]);

  if (containerWidth) return containerWidth;
  return null;
};
export default useContainerWidth;
