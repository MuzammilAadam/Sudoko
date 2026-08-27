import SudokuCell from './SudokuCell';

/**
 * SudokuBoard — renders the full 9×9 board.
 *
 * Props:
 *  puzzle        - number[][]  (0 = empty; used to determine given cells)
 *  currentBoard  - number[][]  (displayed values)
 *  selectedRow   - number | null
 *  selectedCol   - number | null
 *  cellAnims     - { [key: string]: 'animate-pop' | 'animate-shake' }
 *  cellErrors    - Set<string>  (e.g. '3-5')
 *  notes         - { [key: string]: Set<number> }
 *  disabled      - boolean (game over / paused / completed)
 *  onCellClick   - (row, col) => void
 */
export default function SudokuBoard({
  puzzle,
  currentBoard,
  selectedRow,
  selectedCol,
  cellAnims = {},
  cellErrors = new Set(),
  notes = {},
  disabled = false,
  onCellClick,
}) {
  if (!puzzle || !currentBoard) return null;

  const selectedValue = selectedRow !== null && selectedCol !== null
    ? currentBoard[selectedRow][selectedCol]
    : 0;

  return (
    <div
      style={{
        border: '4px solid #0A0A0A',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '8px 8px 0px #0A0A0A',
        background: 'white',
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gridTemplateRows: 'repeat(9, 1fr)',
        aspectRatio: '1',
        width: '100%',
        maxWidth: '520px',
      }}
    >
      {currentBoard.map((rowArr, row) =>
        rowArr.map((val, col) => {
          const isGiven = puzzle[row][col] !== 0;
          const isSelected = selectedRow === row && selectedCol === col;
          const isHighlighted =
            !isSelected &&
            !disabled &&
            selectedRow !== null &&
            (selectedRow === row ||
              selectedCol === col ||
              (Math.floor(selectedRow / 3) === Math.floor(row / 3) &&
                Math.floor(selectedCol / 3) === Math.floor(col / 3)));
          const isSameValue =
            !isSelected && val !== 0 && val === selectedValue && selectedValue !== 0;
          const key = `${row}-${col}`;
          const isError = cellErrors.has(key);

          return (
            <SudokuCell
              key={key}
              row={row}
              col={col}
              value={val}
              isGiven={isGiven}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isSameValue={isSameValue}
              isError={isError}
              notes={notes[key] || new Set()}
              animClass={cellAnims[key] || ''}
              onClick={() => !disabled && onCellClick(row, col)}
            />
          );
        })
      )}
    </div>
  );
}
