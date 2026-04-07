import { motion } from 'framer-motion';

export default function Sponsor() {
    const sponsors = [
        { name: 'DEVFOLIO LOGO', logo: '/devfolio.png' },
        { name: 'ETHINDIA LOGO', logo: '/ethindia.png' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        
        <div className="flex flex-col items-center justify-center py-12">
            <h1 className="heading text-4xl font-bold mb-12" 
                        style={{ filter: 'drop-shadow(3px 3px 0px white)' }}>Our Sponsors</h1>
            <motion.div
                className="flex gap-8 justify-center flex-wrap"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {sponsors.map((sponsor) => (
                    <motion.div
                        key={sponsor.name}
                        variants={itemVariants}
                        className="p-6"
                    >
                        <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="h-24 object-contain"
                        />
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <p className="text-lg text-gray-400">More coming soon....</p>
            </motion.div>
        </div>
    );
}
