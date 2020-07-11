import * as React from 'react'
import NumberCell from './NumberCell'
import CodeCell from './CodeCell'

interface Props {
  row: any
  showLineNumber?: boolean
  onLineNumberClick?: (
    lineNumber: number,
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => void
}

export default ({ row, showLineNumber, onLineNumberClick }: Props) => {
  const lineNumber = row.lineNumber

  const handleClick = (
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => {
    onLineNumberClick && onLineNumberClick(lineNumber, event)
  }
  return (
    <tr>
      {showLineNumber && (
        <NumberCell lineNumber={lineNumber} onClick={handleClick} />
      )}

      <CodeCell
        lineNumber={lineNumber}
        code={row.content}
        isHighlight={row.isHighlight}
      />
    </tr>
  )
}
