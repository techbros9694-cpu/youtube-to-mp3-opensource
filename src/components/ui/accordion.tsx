import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openValue: string | null;
  toggleValue: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType>({
  openValue: null,
  toggleValue: () => {},
});

export function Accordion({
  children,
  className,
}: {
  type?: string;
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [openValue, setOpenValue] = React.useState<string | null>(null);

  const toggleValue = React.useCallback((value: string) => {
    setOpenValue((prev) => (prev === value ? null : value));
  }, []);

  return (
    <AccordionContext.Provider value={{ openValue, toggleValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: React.ReactNode;
};

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <div className={cn("border-b", className)} data-value={value} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value } as Record<string, unknown>);
        }
        return child;
      })}
    </div>
  );
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
  children?: React.ReactNode;
};

export function AccordionTrigger({
  className,
  children,
  value,
  ...props
}: AccordionTriggerProps) {
  const { openValue, toggleValue } = React.useContext(AccordionContext);
  const isOpen = value ? openValue === value : false;

  return (
    <button
      type="button"
      onClick={() => value && toggleValue(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline cursor-pointer [&[data-state=open]>svg]:rotate-180",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </button>
  );
}

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  children?: React.ReactNode;
};

export function AccordionContent({
  className,
  children,
  value,
  ...props
}: AccordionContentProps) {
  const { openValue } = React.useContext(AccordionContext);
  const isOpen = value ? openValue === value : false;

  if (!isOpen) return null;

  return (
    <div
      className={cn("overflow-hidden text-sm transition-all pb-4", className)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
    </div>
  );
}
