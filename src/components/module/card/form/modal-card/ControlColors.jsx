export default function ControlColors({ label, name, value, onChange }) {
  return (
    <label className="w-1/2 flex flex-row justify-start items-center text-sm font-bold gap-1 bg-blue-50 dark:bg-gray-100 rounded-md p-2">
      {label}
      <input
        type="color"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
