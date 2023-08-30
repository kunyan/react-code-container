import { useCallback } from 'react';

import { CodeCell } from './CodeCell';
import { NumberCell } from './NumberCell';

export interface IRow {
  lineNumber: number;
  content: string;
  isHighlight?: boolean;
}

interface Props {
  row: IRow;
  style?: React.CSSProperties;
  showLineNumber?: boolean;
  onClick?: (
    lineNumber: number,
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
  ) => void;
}

export const Row = ({ style, row, showLineNumber, onClick }: Props) => {
  const lineNumber = row.lineNumber;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
      onClick && onClick(lineNumber, event);
    },
    [lineNumber, onClick],
  );
  return (
    <div
      style={{ ...style, width: '100%', display: 'flex', overflow: 'initial' }}
    >
      {showLineNumber && (
        <NumberCell lineNumber={lineNumber} onClick={handleClick} />
      )}

      <CodeCell
        lineNumber={lineNumber}
        content={row.content}
        isHighlight={row.isHighlight}
      />
    </div>
  );
};

// export default memo(Row);
