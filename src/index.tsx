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
    const [rows, setRows] = React.useState<Row[]>([])
    const lines = rows.length

    const handleUnSelect = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          const newRows: Row[] = codeToRows(code, language)
          setRows(newRows)
          onUnSelect && onUnSelect()
        }
      },
      [code, language]
    )

    document.body.addEventListener('keydown', handleUnSelect)

    React.useEffect(() => {
      const newRows = codeToRows(code, language, selectedLines)
      setRows(newRows)
    }, [language, code])

    const getSloc = React.useCallback(() => {
      return code.split('\n').filter((line) => line.trim().length > 0).length
    }, [code])

    const getSize = React.useCallback(() => {
      return prettyBytes(new Blob([code]).size)
    }, [code])

    const onClickNum = (
      lineNumber: number,
      event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
    ) => {
      let newRows = []
      const index = lineNumber - 1
      const highlightedLines = rows.filter((row) => row.isHighlight)
      if (event.shiftKey) {
        const firstSelectedLine = highlightedLines[0]
        const range = firstSelectedLine.lineNumber - lineNumber
        const selectedLines = [lineNumber]
        let n = 0
        while (n <= Math.abs(range)) {
          const index = range > 0 ? lineNumber + n : lineNumber - n
          selectedLines.push(rows[index - 1].lineNumber)
          n++
        }

        newRows = rows.map((row) => ({
          ...row,
          isHighlight: !!selectedLines.find((num) => num === row.lineNumber)
        }))

        setRows(newRows)
      } else {
        newRows = rows.map((row) => ({
          ...row,
          isHighlight: false
        }))
        newRows[index].isHighlight = true
        setRows(newRows)
      }

      const selectedLines = newRows
        .filter((row) => !!row.isHighlight)
        .map((row) => row.lineNumber)
      onLineNumberClick && onLineNumberClick(lineNumber, selectedLines)
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
            {lines} lines ({getSloc()} sloc) | {getSize()}
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
