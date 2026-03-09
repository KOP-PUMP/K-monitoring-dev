import { ReactNode } from "react";

interface DetailProps {
  field: string;
  children: ReactNode;
  description?: string;
}

export function FormBox({ field, children, description }: DetailProps) {
  return (
    <div className="rounded-xl border-0 bg-card text-card-foreground">
      <fieldset className="grid gap-4 rounded-lg p-4 bg-card dark:bg-card flex-grow">
        {/* <legend className="px-2 py-0.5 text-base font-bold text-primary-foreground bg-primary rounded-md shadow-lg border-[1px] border-neutral-600 dark:border-neutral-300"> */}
        <div className="flex flex-col space-y-1">
          <h3 className="font-semibold tracking-tight text-xl">{field}</h3>
          {description && (<p className="text-sm text-muted-foreground">{description}</p>)}
        </div>
        {children}
      </fieldset>
    </div>
  );
}
