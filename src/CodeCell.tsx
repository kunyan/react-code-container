import * as React from 'react'
import classNames from 'classnames'
import styles from './styles.module.css'

interface Props {
  lineNumber: number
  code: string
  isHighlight?: boolean
}

const CodeCell = ({ lineNumber, code, isHighlight }: Props) => {
  const [className, setClassName] = React.useState(
    `${styles.code} ${styles.codeInner}`
  )
  React.useEffect(() => {
    setClassName(
      classNames(styles.code, styles.codeInner, {
        [styles.highlighted]: isHighlight
      })
    )
  }, [isHighlight])

  return (
    <td
      id={`LC${lineNumber}`}
      key={`col-code-${lineNumber}`}
      className={className}
      dangerouslySetInnerHTML={{ __html: code }}
    />
  )
}

export default React.memo(CodeCell)
