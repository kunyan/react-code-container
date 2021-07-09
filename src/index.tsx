import * as React from 'react'
import hljs from 'highlight.js'
import prettyBytes from 'pretty-bytes'
import styles from './styles.module.css'
import Row from './Row'

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

export const CodeContainer = React.memo(
  ({
    code,
    language,
    showLineNumber = true,
    selectedLines = [],
    onLineNumberClick,
    onUnSelect
  }: Props) => {
    const [lines, setLines] = React.useState<number[]>(selectedLines || [])

    const handleUnSelect = React.useCallback((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLines([])
        onUnSelect && onUnSelect()
      }
    }, [])

    React.useEffect(() => {
      document.body.addEventListener('keydown', handleUnSelect)
    }, [])

    const getSloc = React.useCallback(() => {
      return code.split('\n').filter((line) => line.trim().length > 0).length
    }, [code])

    const getSize = React.useCallback(() => {
      return prettyBytes(new Blob([code]).size)
    }, [code])

    const rows = codeToRows(code, language, lines)

    const onClickNum = (
      lineNumber: number,
      event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
    ) => {
      const highlightedLines = rows.filter((row) => row.isHighlight)
      const tmpLines = []
      if (event.shiftKey) {
        const firstSelectedLine = highlightedLines[0]
        const range = firstSelectedLine.lineNumber - lineNumber
        tmpLines.push(lineNumber)
        let n = 0
        while (n <= Math.abs(range)) {
          const index = range > 0 ? lineNumber + n : lineNumber - n
          tmpLines.push(rows[index - 1].lineNumber)
          n++
        }
      } else {
        tmpLines.push(lineNumber)
      }

      setLines(tmpLines)
      onLineNumberClick && onLineNumberClick(lineNumber, tmpLines)
    }

    const renderRows = () =>
      rows.map((row, index) => (
        <Row
          key={`code-container-row-${index}`}
          row={row}
          showLineNumber={showLineNumber}
          onLineNumberClick={onClickNum}
        />
      ))
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            {rows.length} lines ({getSloc()} sloc) | {getSize()}
          </div>
        </div>
        <div className={`${styles.body} hljs`}>
          <table>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </div>
    )
  }
)

const codeToRows = (
  code: string,
  language?: string,
  selectedLines?: number[]
) => {
  const highlightedCodes =
    !!language && hljs.getLanguage(language || '')
      ? hljs.highlight(language, code).value
      : hljs.highlightAuto(code).value

  return highlightedCodes.split('\n').map((content, index) => ({
    lineNumber: index + 1,
    content,
    isHighlight: selectedLines
      ? !!selectedLines.find((lineNumber) => lineNumber === index + 1)
      : false
  }))
}

export default CodeContainer
