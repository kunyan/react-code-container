import styles from './styles.module.css';

interface Props {
  lineNumber: number;
  onClick: (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => void;
}

export const NumberCell = ({ lineNumber, onClick }: Props) => {
  return (
    <div
      id={`L${lineNumber}`}
      key={`col-line-number-${lineNumber}`}
      data-line-number={lineNumber}
      className={styles.num}
      onClick={onClick}
      aria-hidden="true"
    />
  );
};
// export default memo(NumberCell);
