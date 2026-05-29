import { useState, useRef, useCallback, useEffect } from 'react';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface UseWindowResizeOptions {
  minWidth?: number;
  minHeight?: number;
  taskbarHeight?: number;
  initialSize: { width: number; height: number };
  initialPosition: { x: number; y: number };
  id: string;
  onResize?: (id: string, size: { width: number; height: number }, position?: { x: number; y: number }) => void;
  onMove?: (id: string, position: { x: number; y: number }) => void;
}

interface UseWindowResizeReturn {
  size: { width: number; height: number };
  position: { x: number; y: number };
  activeDirection: ResizeDirection | null;
  isResizing: boolean;
  onResizeStart: (direction: ResizeDirection, e: React.MouseEvent | MouseEvent) => void;
  setSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

interface ResizeStartSnapshot {
  mouseX: number;
  mouseY: number;
  startWidth: number;
  startHeight: number;
  startX: number;
  startY: number;
}

export function useWindowResize({
  minWidth = 200,
  minHeight = 150,
  taskbarHeight = 30,
  initialSize,
  initialPosition,
  id,
  onResize,
}: UseWindowResizeOptions): UseWindowResizeReturn {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [activeDirection, setActiveDirection] = useState<ResizeDirection | null>(null);
  const snapshotRef = useRef<ResizeStartSnapshot | null>(null);
  const sizeRef = useRef(size);
  const positionRef = useRef(position);
  const handlersRef = useRef<{
    mousemove: ((e: MouseEvent) => void) | null;
    mouseup: (() => void) | null;
  }>({
    mousemove: null,
    mouseup: null,
  });

  // Keep refs in sync with latest state
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Cleanup document listeners if component unmounts mid-resize
  useEffect(() => {
    return () => {
      if (handlersRef.current.mousemove) {
        document.removeEventListener('mousemove', handlersRef.current.mousemove);
      }
      if (handlersRef.current.mouseup) {
        document.removeEventListener('mouseup', handlersRef.current.mouseup);
      }
    };
  }, []);

  const onResizeStart = useCallback(
    (direction: ResizeDirection, e: React.MouseEvent | MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      // Remove any lingering listeners from a previous incomplete resize
      if (handlersRef.current.mousemove) {
        document.removeEventListener('mousemove', handlersRef.current.mousemove);
      }
      if (handlersRef.current.mouseup) {
        document.removeEventListener('mouseup', handlersRef.current.mouseup);
      }

      const snapshot: ResizeStartSnapshot = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startWidth: sizeRef.current.width,
        startHeight: sizeRef.current.height,
        startX: positionRef.current.x,
        startY: positionRef.current.y,
      };
      snapshotRef.current = snapshot;
      setActiveDirection(direction);

      const handleMouseMove = (e: MouseEvent) => {
        const snap = snapshotRef.current;
        if (!snap) return;

        const dx = e.clientX - snap.mouseX;
        const dy = e.clientY - snap.mouseY;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let width = snap.startWidth;
        let height = snap.startHeight;
        let x = snap.startX;
        let y = snap.startY;

        switch (direction) {
          case 'e': {
            width = Math.max(minWidth, snap.startWidth + dx);
            width = Math.min(width, vw - snap.startX);
            break;
          }
          case 'w': {
            width = Math.max(minWidth, snap.startWidth - dx);
            const rightEdgeW = snap.startX + snap.startWidth;
            x = Math.max(0, rightEdgeW - width);
            width = Math.max(minWidth, rightEdgeW - x);
            break;
          }
          case 's': {
            height = Math.max(minHeight, snap.startHeight + dy);
            height = Math.min(height, vh - taskbarHeight - snap.startY);
            break;
          }
          case 'n': {
            height = Math.max(minHeight, snap.startHeight - dy);
            const bottomEdgeN = snap.startY + snap.startHeight;
            y = Math.max(taskbarHeight, bottomEdgeN - height);
            height = Math.max(minHeight, bottomEdgeN - y);
            break;
          }
          case 'ne': {
            width = Math.max(minWidth, snap.startWidth + dx);
            width = Math.min(width, vw - snap.startX);
            height = Math.max(minHeight, snap.startHeight - dy);
            const bottomEdgeNE = snap.startY + snap.startHeight;
            y = Math.max(taskbarHeight, bottomEdgeNE - height);
            height = Math.max(minHeight, bottomEdgeNE - y);
            break;
          }
          case 'nw': {
            width = Math.max(minWidth, snap.startWidth - dx);
            const rightEdgeNW = snap.startX + snap.startWidth;
            x = Math.max(0, rightEdgeNW - width);
            width = Math.max(minWidth, rightEdgeNW - x);

            height = Math.max(minHeight, snap.startHeight - dy);
            const bottomEdgeNW = snap.startY + snap.startHeight;
            y = Math.max(taskbarHeight, bottomEdgeNW - height);
            height = Math.max(minHeight, bottomEdgeNW - y);
            break;
          }
          case 'se': {
            width = Math.max(minWidth, snap.startWidth + dx);
            width = Math.min(width, vw - snap.startX);
            height = Math.max(minHeight, snap.startHeight + dy);
            height = Math.min(height, vh - taskbarHeight - snap.startY);
            break;
          }
          case 'sw': {
            width = Math.max(minWidth, snap.startWidth - dx);
            const rightEdgeSW = snap.startX + snap.startWidth;
            x = Math.max(0, rightEdgeSW - width);
            width = Math.max(minWidth, rightEdgeSW - x);

            height = Math.max(minHeight, snap.startHeight + dy);
            height = Math.min(height, vh - taskbarHeight - snap.startY);
            break;
          }
        }

        setSize({ width, height });
        setPosition({ x, y });
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        handlersRef.current = { mousemove: null, mouseup: null };

        setActiveDirection(null);
        snapshotRef.current = null;

        // Notify parent of final size and position
        onResize?.(id, sizeRef.current, positionRef.current);
      };

      handlersRef.current = { mousemove: handleMouseMove, mouseup: handleMouseUp };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, minWidth, minHeight, taskbarHeight, onResize],
  );

  return {
    size,
    position,
    activeDirection,
    isResizing: activeDirection !== null,
    onResizeStart,
    setSize,
    setPosition,
  };
}
