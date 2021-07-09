import * as React from 'react'
import NumberCell from './NumberCell'
import CodeCell from './CodeCell'

interface Props {
  row: any
  style: React.CSSProperties
  showLineNumber?: boolean
  onClick?: (
    lineNumber: number,
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => void
}

const Row = ({ style, row, showLineNumber, onClick }: Props) => {
  const lineNumber = row.lineNumber

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
      onClick && onClick(lineNumber, event)
    },
    []
  )
  return (
    <tr style={{...style, width: "100%", overflow: "initial"}}>
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

export default React.memo(Row)
