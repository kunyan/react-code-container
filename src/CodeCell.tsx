import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

import { IRow } from './Row';
import styles from './styles.module.css';

export const CodeCell = ({ lineNumber, content, isHighlight }: IRow) => {
  const [className, setClassName] = useState(`${styles.code} ${styles.inner}`);
  useEffect(() => {
    setClassName(
      clsx(styles.code, styles.inner, {
        [styles.highlighted]: isHighlight,
      })
    );
  }, [isHighlight]);

  return (
    <div
      id={`LC${lineNumber}`}
      key={`col-code-${lineNumber}`}
      aria-label={`line: ${lineNumber}`}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

// export default memo(CodeCell)
