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
import { AutoAwareInput } from "@/components/common/MeasurementField";

interface CheckFieldProps {
  control: Control<any>;
  name: string;
  remarkName: string;
  label: string;
  statusItems?: ComboboxItemProps[] | null;
  // Shows an "Optional" badge on the label instead of the required
  // asterisk — the status dropdown and remark stay fully editable.
  optional?: boolean;
  className?: string;
}

// A single visual-check row: label (required, unless optional), a
// pass/fail-style status dropdown, and a remark input. Pulls the repeated
// combobox+remark FormField pattern used throughout the Visual Check group
// into one place.
export function CheckField({
  control,
  name,
  remarkName,
  label,
  statusItems,
  optional = false,
  className,
}: CheckFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="w-full flex items-center">
            <FormLabel className="w-32 lg:w-44 flex items-center gap-1.5 shrink-0">
              <span>{label}</span>
              {optional ? (
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-normal leading-4">
                  Optional
                </Badge>
              ) : (
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              )}
            </FormLabel>
            <div className="w-full flex gap-2">
              <FormControl className="md:max-w-[500px]">
                <Combobox
                  className="min-w-[86px]"
                  items={statusItems ?? []}
                  label={field.value ?? "Select"}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormField
                control={control}
                name={remarkName}
                render={({ field: remarkField }) => (
                  <FormControl className="w-full">
                    <Input
                      placeholder="Remark"
                      {...remarkField}
                      value={remarkField.value ?? ""}
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface StackedField {
  name: string;
  placeholder: string;
  // Marks this specific sub-field (e.g. the "suggest" or "result" value) as
  // backed by a system-computed value rather than manual entry — shown with
  // an inline "Auto" badge and made read-only. Sibling fields such as
  // "remark" are unaffected and stay freely editable.
  auto?: boolean;
  // Same inline badge treatment as "auto" ("Optional" instead of "Auto"),
  // but the field stays fully editable.
  optional?: boolean;
}

interface StackedTextFieldProps {
  control: Control<any>;
  label: string;
  fields: [StackedField, ...StackedField[]];
  className?: string;
}

const stackedBadge = (f: StackedField) => (f.auto ? "Auto" : f.optional ? "Optional" : undefined);

// A label with 2-3 related text inputs stacked underneath it (e.g.
// Result / Suggest / Remark) — used in the Result group where a single
// check item needs more than one free-text value.
export function StackedTextField({
  control,
  label,
  fields,
  className,
}: StackedTextFieldProps) {
  const [primary, ...rest] = fields;
  return (
    <FormField
      control={control}
      name={primary.name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="w-full flex items-start">
            <FormLabel className="w-32 lg:w-44 pt-2 flex items-center gap-1.5 shrink-0">
              <span>{label}</span>
              {!primary.auto && !primary.optional && (
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              )}
            </FormLabel>
            <div className="w-full flex flex-col gap-2">
              <FormControl className="w-full">
                <AutoAwareInput
                  badge={stackedBadge(primary)}
                  readOnly={!!primary.auto}
                  placeholder={primary.placeholder}
                  type="text"
                  field={field}
                />
              </FormControl>
              {rest.map((f) => (
                <FormField
                  key={f.name}
                  control={control}
                  name={f.name}
                  render={({ field: subField }) => {
                    const badge = stackedBadge(f);
                    return badge ? (
                      <FormControl className="w-full">
                        <AutoAwareInput
                          badge={badge}
                          readOnly={!!f.auto}
                          placeholder={f.placeholder}
                          type="text"
                          field={subField}
                        />
                      </FormControl>
                    ) : (
                      <FormControl className="w-full">
                        <Input
                          placeholder={f.placeholder}
                          {...subField}
                          value={subField.value ?? ""}
                        />
                      </FormControl>
                    );
                  }}
                />
              ))}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
