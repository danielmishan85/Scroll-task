type SearchInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function SearchInput({
  placeholder,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        fontSize: "16px",
        boxSizing: "border-box",
        width: "50%",
        padding: "12px",
      }}
    />
  );
}
