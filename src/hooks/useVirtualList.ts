import { useRef, useCallback, useEffect } from 'react';

export function useVirtualList(defaultSize = 70) {
  const listRef = useRef<any>(null);
  const sizeMap = useRef<{ [key: number]: number }>({});

  const getSize = useCallback((index: number) => {
    return sizeMap.current[index] || defaultSize;
  }, [defaultSize]);

  const setSize = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current[index] = size;
      listRef.current?.resetAfterIndex(index);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      listRef.current?.resetAfterIndex(0);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    listRef,
    getSize,
    setSize,
    sizeMap
  };
}