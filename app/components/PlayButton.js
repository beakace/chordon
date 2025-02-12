import { motion } from "framer-motion";

export default function PlayButton({ onClick }) {
  return (
    <motion.div
      key="play-button"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      exit={{ y: -20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        className="relative w-24 h-24 group"
        whileHover={{
          scale: 1, // This ensures hover is detected but no scaling happens
        }}
      >
        <motion.div
          className="absolute transition-opacity duration-300 inset-0 rounded-full bg-gradient-conic opacity-0 group-hover:opacity-100 -z-10"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <button
          onClick={onClick}
          className="absolute inset-[1px] rounded-full bg-gray-100 text-accent-1 shadow-lg flex items-center justify-center z-10"
          style={{
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 512 512" fill="currentColor">
            <path
              d="M500.203,236.907L30.869,2.24c-6.613-3.285-14.443-2.944-20.736,0.939C3.84,7.083,0,13.931,0,21.333v469.333
              c0,7.403,3.84,14.251,10.133,18.155c3.413,2.112,7.296,3.179,11.2,3.179c3.264,0,6.528-0.747,9.536-2.24l469.333-234.667
              C507.435,271.467,512,264.085,512,256S507.435,240.533,500.203,236.907z"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
