import hljs from 'highlight.js';
import prettyBytes from 'pretty-bytes';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  AutoSizer as _AutoSizer,
  AutoSizerProps,
  List as _List,
  ListProps,
  ListRowProps,
  WindowScroller as _WindowScroller,
  WindowScrollerProps,
} from 'react-virtualized';

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

const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>;
const WindowScroller = _WindowScroller as unknown as FC<WindowScrollerProps>;
const List = _List as unknown as FC<ListProps>;

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
    [onUnSelect]
  );

  useEffect(() => {
    document.body.addEventListener('keydown', handleUnSelect);
    return () => {
      document.body.removeEventListener('keydown', handleUnSelect);
    };
  }, [handleUnSelect]);

  const getSloc = useCallback(() => {
    return code.split('\n').filter((line) => line.trim().length > 0).length;
  }, [code]);

  const getSize = useCallback(() => {
    return prettyBytes(new Blob([code]).size);
  }, [code]);

  const onClickLine = (
    lineNumber: number,
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>
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

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
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
        style={style}
        showLineNumber={showLineNumber}
        onClick={onClickLine}
      />
    );
  };

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, registerChild, scrollTop }) => (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              {codes.length} lines ({getSloc()} sloc) | {getSize()}
            </div>
          </div>
          <div
            className={`${styles.body} hljs`}
            ref={registerChild as React.LegacyRef<HTMLDivElement>}
          >
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  width={width}
                  height={height}
                  gridClassName={styles.codeTable}
                  autoHeight
                  headerHeight={0}
                  rowHeight={20}
                  rowCount={codes.length}
                  rowRenderer={rowRenderer}
                  overscanRowCount={20}
                  scrollTop={scrollTop}
                  onScroll={onChildScroll}
                  isScrolling={isScrolling}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      )}
    </WindowScroller>
  );
};

export default ReactCodeContainer;
