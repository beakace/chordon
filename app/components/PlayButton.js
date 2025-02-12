import { motion } from "framer-motion";

export default function PlayButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="px-8 py-4 bg-coral text-cream rounded-lg text-xl font-bold shadow-lg hover:bg-coral-dark transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      Initialize Audio
    </motion.button>
  );
}
