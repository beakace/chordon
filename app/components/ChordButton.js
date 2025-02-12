export default function ChordButton({ chord, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-white rounded ${className}`}
    >
      {chord.display}
    </button>
  );
}
