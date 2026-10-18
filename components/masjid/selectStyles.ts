import type { StylesConfig } from "react-select";

export interface Location {
  value: string;
  label: string;
}

// Gaya react-select yang sama persis dengan di hero.
export const selectStyles: StylesConfig<Location, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    borderColor: state.isFocused
      ? "rgba(170,213,118,0.6)"
      : "rgba(255,255,255,0.12)",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(170,213,118,0.15)" : "none",
    opacity: state.isDisabled ? 0.6 : 1,
    cursor: "text",
    ":hover": { borderColor: "rgba(170,213,118,0.4)" },
  }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
  input: (base) => ({ ...base, color: "#fff" }),
  placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.55)" }),
  indicatorSeparator: (base) => ({
    ...base,
    background: "rgba(255,255,255,0.12)",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "rgba(255,255,255,0.5)",
    ":hover": { color: "#fff" },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "rgba(255,255,255,0.5)",
    ":hover": { color: "#fff" },
  }),
  menu: (base) => ({
    ...base,
    background: "#0d1811",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  }),
  option: (base, state) => ({
    ...base,
    color: "#fff",
    cursor: "pointer",
    background: state.isSelected
      ? "#3a5a25"
      : state.isFocused
        ? "rgba(170,213,118,0.12)"
        : "transparent",
    ":active": { background: "rgba(170,213,118,0.2)" },
  }),
  noOptionsMessage: (base) => ({ ...base, color: "rgba(255,255,255,0.6)" }),
};
