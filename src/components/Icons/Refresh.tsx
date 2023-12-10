import { motion } from "framer-motion"

const variants = {
    hover: {
        rotate: 180
    }
}
export const Refresh = () => <motion.svg variants={variants} whileHover={'hover'} data-testid="geist-icon" fill="none" height="32" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="32" style={{width:"32px",height:"32px"}}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></motion.svg>
