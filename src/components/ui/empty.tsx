import * as React from "react"
import { cn } from "@/lib/utils"

function Empty({ className, children, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty"
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center",
                className
            )}
            {...props}
        >
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                {children}
            </div>
        </div>
    )
}

export { Empty }
