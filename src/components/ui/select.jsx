import * as React from "react";
import { cn } from "../../lib/utils";
// A simple Select component using native HTML select element
const Select = ({ className, children, value, onValueChange, ...props }) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950",
        className
      )}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  );
};
// Select.displayName = "Select";
const SelectTrigger = ({ className, children }) => (
  <div className={cn("flex items-center", className)}>{children}</div>
);

const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };