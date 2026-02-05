import * as React from "react"
import { cn } from "@/lib/utils"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-group"
            className={cn("relative flex w-full items-center", className)}
            {...props}
        />
    )
}

export { InputGroup }
