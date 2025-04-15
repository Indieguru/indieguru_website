import { Card } from "../ui/card";
import { Button } from "../ui/button";

function ExpertsSection({ experts }) {
  return (
    <section className="mb-12 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-1">
        <h2 className="text-2xl font-semibold text-gray-800">Choose Your Own Expert</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6 ml-2">
        Learn currently trending topics like data science, artificial intelligence, and many more from the experts across
        the Globe.
      </p>

      <div className="overflow-x-auto whitespace-nowrap pb-4">
        {experts.length > 0 ? (
          <div className="inline-flex gap-4">
            {experts.map((expert) => (
              <Card key={expert._id} className="border border-gray-200 rounded-lg overflow-hidden w-64 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={expert.image || "/imagecopy.png"}
                    alt={expert.name}
                    className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{expert.name}</h3>
                      <p className="text-xs text-[#003265] font-medium">{expert.domain}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{expert.description}</p>
                  <div className="flex gap-2">
                    <Button className="bg-blue-800 hover:bg-indigo-700 text-white text-xs py-1 px-3 h-7 rounded-full shadow-sm transition-colors duration-300">
                      {expert.specialization || "Specialization"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No experts available at the moment. Please try again later.</p>
        )}
      </div>
    </section>
  );
}

export default ExpertsSection;