export default function KeySelector({ selectedKey, onKeyChange }) {
  const keys = [
    { value: "C", label: "C" },
    { value: "Db", label: "D♭" },
    { value: "D", label: "D" },
    { value: "Eb", label: "E♭" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "Gb", label: "G♭" },
    { value: "G", label: "G" },
    { value: "Ab", label: "A♭" },
    { value: "A", label: "A" },
    { value: "Bb", label: "B♭" },
    { value: "B", label: "B" },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray">Key:</label>
      <select
        value={selectedKey}
        onChange={(e) => onKeyChange(e.target.value)}
        className="bg-primary/50 text-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {keys.map((key) => (
          <option key={key.value} value={key.value}>
            {key.label}
          </option>
        ))}
      </select>
    </div>
  );
}
