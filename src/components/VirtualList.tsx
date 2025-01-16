import { VariableSizeList as List } from 'react-window';
import { useVirtualList } from '../hooks/useVirtualList';
import React from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  width?: number | string;
  overscanCount?: number;
  children: (props: {
    index: number;
    style: React.CSSProperties;
    data: T;
    setSize: (index: number, size: number) => void;
  }) => React.ReactNode;
}

export function VirtualList<T>({
  items,
  height,
  width = '100%',
  overscanCount,
  children
}: VirtualListProps<T>) {
  const { listRef, getSize, setSize } = useVirtualList();

  return (
    <List
      ref={listRef}
      height={height}
      itemCount={items.length}
      itemSize={getSize}
      width={width}
      overscanCount={overscanCount}
      itemData={{
        items,
        setSize
      }}
    >
      {({ index, style, data }) =>
        children({
          index,
          style,
          data: data.items[index],
          setSize: data.setSize
        })
      }
    </List>
  );
}