"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar w-full rounded-none border border-zinc-200 bg-white p-3 text-zinc-900 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100",
        "[--cell-radius:0] [--cell-size:2rem]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 rounded-none border border-zinc-200 bg-transparent p-0 text-zinc-600 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600 aria-disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 rounded-none border border-zinc-200 bg-transparent p-0 text-zinc-600 transition-colors hover:border-red-600 hover:bg-red-50 hover:text-red-600 aria-disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-8 text-sm font-bold text-zinc-900 dark:text-zinc-100",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-8 w-full items-center justify-center gap-1.5 text-sm font-semibold",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-none",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-bold select-none",
          captionLayout === "label"
            ? "text-sm text-zinc-900 dark:text-zinc-100"
            : "flex items-center gap-1 rounded-none text-sm text-zinc-900 [&>svg]:size-3.5 [&>svg]:text-zinc-500 dark:text-zinc-100 dark:[&>svg]:text-zinc-400",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-none text-[0.75rem] font-semibold uppercase tracking-wider text-zinc-500 select-none dark:text-zinc-400",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-8 select-none text-[0.75rem] font-semibold text-zinc-400",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.75rem] text-zinc-400 select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-none p-0 text-center select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          "relative isolate z-0 rounded-none bg-red-50 text-red-950 after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-red-50 dark:bg-red-950/30 dark:text-red-200 dark:after:bg-red-950/30",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          "rounded-none bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-200",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          "relative isolate z-0 rounded-none bg-red-50 text-red-950 after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-red-50 dark:bg-red-950/30 dark:text-red-200 dark:after:bg-red-950/30",
          defaultClassNames.range_end,
        ),
        today: cn(
          "rounded-none border border-red-500 font-bold text-red-600 data-[selected=true]:border-transparent dark:border-red-500 dark:text-red-400",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-zinc-400 opacity-50 aria-selected:text-zinc-400 dark:text-zinc-600",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-zinc-300 opacity-40 dark:text-zinc-700",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-8 items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // Base Sizing & Sharp Edges
        "relative isolate z-10 flex aspect-square h-8 w-8 min-w-8 flex-col gap-1 rounded-none border-0 p-0 text-sm font-normal leading-none transition-colors",
        // Unselected Hover (Subtle Red Tint)
        "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400",
        // Focus State
        "group-data-[focused=true]/day:border-red-500 group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-red-500/20",
        // Selected Single Day (Solid Red)
        "data-[selected-single=true]:bg-red-600 data-[selected-single=true]:font-semibold data-[selected-single=true]:text-white hover:data-[selected-single=true]:bg-red-700 hover:data-[selected-single=true]:text-white dark:data-[selected-single=true]:bg-red-600 dark:data-[selected-single=true]:text-white dark:hover:data-[selected-single=true]:bg-red-700",
        // Range Start & End (Solid Red)
        "data-[range-start=true]:rounded-none data-[range-start=true]:bg-red-600 data-[range-start=true]:font-semibold data-[range-start=true]:text-white hover:data-[range-start=true]:bg-red-700 hover:data-[range-start=true]:text-white dark:data-[range-start=true]:bg-red-600 dark:data-[range-start=true]:text-white dark:hover:data-[range-start=true]:bg-red-700",
        "data-[range-end=true]:rounded-none data-[range-end=true]:bg-red-600 data-[range-end=true]:font-semibold data-[range-end=true]:text-white hover:data-[range-end=true]:bg-red-700 hover:data-[range-end=true]:text-white dark:data-[range-end=true]:bg-red-600 dark:data-[range-end=true]:text-white dark:hover:data-[range-end=true]:bg-red-700",
        // Range Middle (Light Red Strip)
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-red-50 data-[range-middle=true]:text-red-950 hover:data-[range-middle=true]:bg-red-100 hover:data-[range-middle=true]:text-red-950 dark:data-[range-middle=true]:bg-red-950/40 dark:data-[range-middle=true]:text-red-200 dark:hover:data-[range-middle=true]:bg-red-950/60",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };