import { motion } from "motion/react";

export default function AnimatedCard({ children, delay, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.4, delay: delay }} 
            className={`card h-full ${className}`} 
        >
            {children}
        </motion.div>
    );
};