import * as React from 'react'
import styles from './styles.module.css'

interface Props {
  lineNumber: number
  onClick: (
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => void
}

export default ({ lineNumber, onClick }: Props) => {
  return (
    <td
      id={`L${lineNumber}`}
      key={`col-line-number-${lineNumber}`}
      data-line-number={lineNumber}
      className={styles.num}
      onClick={onClick}
    />
  )
}
