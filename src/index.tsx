import React, { useCallback, useEffect, useRef, useState } from 'react';

import { VirtualItem, useVirtualizer } from '@tanstack/react-virtual';
import hljs from 'highlight.js';
import prettyBytes from 'pretty-bytes';

import { Row } from './Row';
import styles from './styles.module.css';

interface IProps {
  code: string;
  language?: string;
  showLineNumber?: boolean;
  selectedLines?: number[];
  onLineNumberClick?: (lineNumber: number, selectedLines: number[]) => void;
  onUnSelect?: () => void;
}

interface Row {
  lineNumber: number;
  content: string;
  isHighlight?: boolean;
}

export const ReactCodeContainer = ({
  code,
  language,
  showLineNumber = true,
  selectedLines = [],
  onLineNumberClick,
  onUnSelect,
}: IProps) => {
  const [lines, setLines] = useState<number[]>(selectedLines);
  const [codes, setCodes] = useState<string[]>([]);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const linesRef = useRef(lines);

  useEffect(() => {
    if (!!language && hljs.getLanguage(language || '')) {
      setCodes(hljs.highlight(code, { language }).value.split('\n'));
    } else {
      setCodes(hljs.highlightAuto(code).value.split('\n'));
    }
  }, [code, language]);

  const handleUnSelect = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLines([]);
        linesRef.current = [];
        onUnSelect && onUnSelect();
      }
    },
    [onUnSelect],
  );

  useEffect(() => {
    document.body.addEventListener('keydown', handleUnSelect);
    return () => {
      document.body.removeEventListener('keydown', handleUnSelect);
    };
  }, [handleUnSelect]);

  const virtualizer = useVirtualizer({
    count: codes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
    overscan: 20,
  });

  const getSloc = useCallback(() => {
    return code.split('\n').filter((line) => line.trim().length > 0).length;
  }, [code]);

  const getSize = useCallback(() => {
    return prettyBytes(new Blob([code]).size);
  }, [code]);

  const onClickLine = (
    lineNumber: number,
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
  ) => {
    const tmpLines = [lineNumber];
    if (event.shiftKey) {
      const firstSelectedLine = linesRef.current[0];
      const range = firstSelectedLine - lineNumber;
      let n = 1;
      while (n <= Math.abs(range)) {
        const index = range > 0 ? lineNumber + n : lineNumber - n;
        tmpLines.push(index);
        n++;
      }
    }
    const sortLines = tmpLines.sort((a, b) => a - b);
    setLines(sortLines);
    linesRef.current = sortLines;
    onLineNumberClick && onLineNumberClick(lineNumber, sortLines);
  };

  const rowRenderer = ({ index, key }: VirtualItem) => {
    const isHighlight = !!lines.find((lineNumber) => lineNumber === index + 1);
    const row = {
      lineNumber: index + 1,
      content: codes[index],
      isHighlight,
    };

    return (
      <Row
        key={key}
        row={row}
        showLineNumber={showLineNumber}
        onClick={onClickLine}
      />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          {codes.length} lines ({getSloc()} sloc) | {getSize()}
        </div>
      </div>
      <div ref={parentRef} className={`${styles.body} hljs`}>
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer
            .getVirtualItems()
            .map((virtualItem) => rowRenderer(virtualItem))}
        </div>
      </div>
    </div>
  );
};

export default ReactCodeContainer;
