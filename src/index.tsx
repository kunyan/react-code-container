import * as React from 'react'
import hljs from 'highlight.js'
import prettyBytes from 'pretty-bytes'
import 'react-virtualized/styles.css'
import styles from './styles.module.css'
import Row from './Row'
import {
  AutoSizer,
  WindowScroller,
  Table,
  TableRowProps
} from 'react-virtualized'

interface Props {
  code: string
  language?: string
  showLineNumber?: boolean
  selectedLines?: number[]
  onLineNumberClick?: (lineNumber: number, selectedLines: number[]) => void
  onUnSelect?: () => void
}

interface Row {
  lineNumber: number
  content: string
  isHighlight?: boolean
}

export const CodeContainer = ({
  code,
  language,
  showLineNumber = true,
  selectedLines = [],
  onLineNumberClick,
  onUnSelect
}: Props) => {
  const [lines, setLines] = React.useState<number[]>(selectedLines)
  const [codes, setCodes] = React.useState<string[]>([])
  const linesRef = React.useRef(lines)

  React.useEffect(() => {
    if (!!language && hljs.getLanguage(language || '')) {
      setCodes(hljs.highlight(language, code).value.split('\n'))
    } else {
      setCodes(hljs.highlightAuto(code).value.split('\n'))
    }
  }, [code, language])

  const handleUnSelect = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setLines([])
      linesRef.current = []
      onUnSelect && onUnSelect()
    }
  }, [])

  React.useEffect(() => {
    document.body.addEventListener('keydown', handleUnSelect)
    return () => {
      document.body.removeEventListener('keydown', handleUnSelect)
    }
  }, [])

  const getSloc = React.useCallback(() => {
    return code.split('\n').filter((line) => line.trim().length > 0).length
  }, [code])

  const getSize = React.useCallback(() => {
    return prettyBytes(new Blob([code]).size)
  }, [code])

  const onClickLine = (
    lineNumber: number,
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => {
    const tmpLines = [lineNumber]
    if (event.shiftKey) {
      const firstSelectedLine = linesRef.current[0]
      const range = firstSelectedLine - lineNumber
      let n = 1
      while (n <= Math.abs(range)) {
        const index = range > 0 ? lineNumber + n : lineNumber - n
        tmpLines.push(index)
        n++
      }
    }
    const sortLines = tmpLines.sort((a, b) => a - b)
    setLines(sortLines)
    linesRef.current = sortLines
    onLineNumberClick && onLineNumberClick(lineNumber, sortLines)
  }

  const rowRenderer = ({ index, key, style }: TableRowProps) => {
    const isHighlight = !!lines.find((lineNumber) => lineNumber === index + 1)
    const row = {
      lineNumber: index + 1,
      content: codes[index],
      isHighlight
    }

    return (
      <Row
        key={key}
        row={row}
        style={style}
        showLineNumber={showLineNumber}
        onClick={onClickLine}
      />
    )
  }

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              {codes.length} lines ({getSloc()} sloc) | {getSize()}
            </div>
          </div>
          <div className={`${styles.body} hljs`}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
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
                  rowGetter={({ index }) => codes[index]}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      )}
    </WindowScroller>
  )
}

export default CodeContainer
