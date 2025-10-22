import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-800 bg-white px-3 py-2 text-base text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-black md:text-sm dark:bg-black dark:text-white dark:border-gray-700 dark:placeholder:text-gray-400 dark:file:text-white",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
