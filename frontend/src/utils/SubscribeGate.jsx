import { motion } from 'framer-motion'

export default function SubscribeGate({ onContinue }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-black border border-[#ffffff] rounded-xl p-8 w-[90%] max-w-md text-center shadow-[0_0_30px_rgba(156,168,2,0.4)]"
            >
                <h2 className="heading text-3xl mb-4 text-[#ffffff]">
                    VIHAAN 9.0 Updates
                </h2>

                <p className="text-gray-300 mb-6">
                    Subscribe to get notified about schedules, prizes & announcements.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        className="bg-[#ffffff] text-black py-2 rounded-md font-bold hover:scale-105 transition"
                        onClick={onContinue}
                    >
                        Notify Me
                    </button>

                    <button
                        className="text-gray-400 text-sm hover:text-white transition"
                        onClick={onContinue}
                    >
                        Continue without subscribing
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
