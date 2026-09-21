import { ReactNode } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Combobox, ComboboxItemProps } from "@/components/common/ComboBox";
import { cn } from "@/lib/utils";

interface MeasurementFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  unitName?: string;
  unitItems?: ComboboxItemProps[] | null;
  placeholder?: string;
  type?: string;
  // Marks a value that's pre-filled from the backend's calculated result
  // (calc_*) rather than typed in by the engineer. Shown as an inline
  // "Auto" badge inside the input, which is made read-only.
  auto?: boolean;
  // Marks a value the engineer may leave blank — shown the same way as
  // "auto" (inline badge inside the input) but stays fully editable.
  optional?: boolean;
  className?: string;
}

// Renders an inline status badge (e.g. "Auto" or "Optional") inside the
// input itself rather than next to the label, used whenever a field isn't
// plain required manual entry. readOnly is only set for computed values.
export function AutoAwareInput({
  badge,
  readOnly = false,
  placeholder,
  type,
  field,
}: {
  badge?: string;
  readOnly?: boolean;
  placeholder: string;
  type: string;
  field: { value: any; onChange: (...args: any[]) => void; onBlur: () => void; name: string; ref: any };
}) {
  if (!badge) {
    return (
      <Input
        placeholder={placeholder}
        type={type}
        {...field}
        value={field.value ?? ""}
      />
    );
  }
  const badgePadding = badge == "Auto" ? "pl-14" : "pl-[70px]";

  return (
    <div className="relative w-full">
      <Badge
        variant="secondary"
        className="absolute left-1.5 top-2 px-1.5 py-0 text-[10px] font-normal leading-4 pointer-events-none"
      >
        {badge}
      </Badge>
      {readOnly ? (
        // A single-line <input readOnly> clips long computed values with no
        // way to read the rest short of hovering for the title tooltip.
        // Render the value as wrapping text instead, so the field grows
        // tall enough to show it in full.
        <div
          className={cn(
            "flex min-h-8 w-full items-center rounded-md bg-muted/50 px-3 py-1 text-sm shadow-sm whitespace-pre-wrap break-words cursor-default select-text",
            badgePadding,
          )}
        >
          {field.value || placeholder}
        </div>
      ) : (
        <Input
          placeholder={placeholder}
          type={type}
          {...field}
          value={field.value ?? ""}
          className={badgePadding}
        />
      )}
    </div>
  );
}

// A single measurement row: label (+ required indicator, unless the value
// is auto-filled), a number input, and an optional unit dropdown. Pulls the
// repeated value+unit FormField pattern used throughout the Pump Operating
// Condition group into one place so the layout stays consistent.
export function MeasurementField({
  control,
  name,
  label,
  unitName,
  unitItems,
  placeholder,
  type = "number",
  auto = false,
  optional = false,
  className,
}: MeasurementFieldProps) {
  const badge = auto ? "Auto" : optional ? "Optional" : undefined;

  const labelNode = (
    <FormLabel className="w-32 lg:w-44 flex items-center gap-1.5 shrink-0">
      <span>{label}</span>
      {!auto && !optional && (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </FormLabel>
  );

  if (!unitName) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <div className="w-full flex sm:flex-row flex-col gap-1 sm:gap-2 sm:items-center">
              {labelNode}
              <FormControl className="w-full">
                <AutoAwareInput
                  badge={badge}
                  readOnly={auto}
                  placeholder={placeholder ?? label}
                  type={type}
                  field={field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={unitName}
      render={({ field: unitField }) => (
        <FormItem className={className}>
          <div className="w-full flex items-center">
            {labelNode}
            <div className="w-full flex gap-2">
              <FormField
                control={control}
                name={name}
                render={({ field }) => (
                  <FormControl className="w-full">
                    <AutoAwareInput
                      badge={badge}
                      readOnly={auto}
                      placeholder={placeholder ?? label}
                      type={type}
                      field={field}
                    />
                  </FormControl>
                )}
              />
              <FormControl className="md:max-w-[500px]">
                <Combobox
                  className="min-w-[86px]"
                  items={unitItems ?? []}
                  label={unitField.value ?? "Select"}
                  onChange={(value) => unitField.onChange(value)}
                />
              </FormControl>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Two-per-row on large screens, stacked on everything smaller — used to
// group related measurement fields onto the same line without breaking on
// mobile/tablet widths.
export function MeasurementGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3", className)}>
      {children}
    </div>
  );
}
