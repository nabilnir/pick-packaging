"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right" | "none";
}

const FadeIn = ({
    children,
    delay = 0,
    duration = 0.5,
    className = "",
    direction = "up"
}: FadeInProps) => {

    const getInitial = () => {
        switch (direction) {
            case "up": return { opacity: 1, y: 40 };
            case "down": return { opacity: 1, y: -40 };
            case "left": return { opacity: 1, x: 40 };
            case "right": return { opacity: 1, x: -40 };
            default: return { opacity: 1 };
        }
    };

    return (
        <motion.div
            initial={getInitial()}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
