import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

function ExpertsSection({ experts }) {
  return (
    <section className="mb-12 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-1"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Choose Your Own Expert</h2>
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-gray-600 mb-6 ml-2"
      >
        Learn currently trending topics like data science, artificial intelligence, and many more from the experts across
        the Globe.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent"
      >
        {experts.length > 0 ? (
          <div className="inline-flex gap-4">
            {experts.map((expert, index) => (
              <motion.div
                key={expert._id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border border-gray-200 rounded-lg overflow-hidden w-64 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <motion.div 
                    className="aspect-square relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                      src={expert.image || "/imagecopy.png"}
                      alt={expert.name}
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-500"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                    >
                      <p className="text-sm font-medium">View Profile</p>
                    </motion.div>
                  </motion.div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300">{expert.name}</h3>
                        <p className="text-xs text-[#003265] font-medium">{expert.domain}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{expert.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-blue-800 hover:bg-indigo-700 text-white text-xs py-1 px-3 h-7 rounded-full shadow-sm transition-colors duration-300 transform hover:scale-105">
                        {expert.specialization || "Specialization"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 text-sm text-center py-8"
          >
            No experts available at the moment. Please try again later.
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

export default ExpertsSection;