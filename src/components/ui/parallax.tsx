"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxProps {
    children: React.ReactNode;
    offset?: number;
    className?: string;
}

const Parallax = ({ children, offset = 50, className = "" }: ParallaxProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 0 };
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
    const springY = useSpring(y, springConfig);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ y: springY }} className="w-full h-full">
                {children}
            </motion.div>
        </div>
    );
};

export default Parallax;
