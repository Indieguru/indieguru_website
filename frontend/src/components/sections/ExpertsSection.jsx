import { Card } from "../ui/card"
import { Button } from "../ui/button"
import placeholderImage from "../../assets/placeholder.svg"

function ExpertsSection() {
  return (
    <section className="mb-12 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-1">
        <span className="mr-2 text-[#003265]">
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 15V23" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 20H17" stroke="currentColor" strokeWidth="2"/>
          </svg> */}
        </span>
        <h2 className="text-2xl font-semibold text-gray-800">Choose Your Own Expert</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6 ml-2">
        Learn currently trending topics like data science, artificial intelligence and many more from the experts across
        the Globe.
      </p>

      <div className="overflow-x-auto whitespace-nowrap pb-4">
        <div className="inline-flex gap-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="border border-gray-200 rounded-lg overflow-hidden w-64 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
              <div className="aspect-square relative overflow-hidden">
                <img src={"/imagecopy.png"} alt="Expert" className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-500" />
                {/* <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold">
                  TOP RATED
                </div> */}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">Jane Doe</h3>
                    <p className="text-xs text-[#003265] font-medium">Senior Designer</p>
                  </div>
                  <div className="flex bg-gray-50 px-2 py-1 rounded-lg">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-yellow-500">
                        {star}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  3+ years of experience in paid search marketing, social media marketing, management and performance
                  analysis
                </p>
                <div className="flex gap-2">
                  <Button className="bg-blue-800 hover:bg-indigo-700 text-white text-xs py-1 px-3 h-7 rounded-full shadow-sm transition-colors duration-300">
                    {index === 1
                      ? "UI/UX Design"
                      : index === 2
                      ? "Product Design"
                      : index === 3
                      ? "Visual Design"
                      : "UI/UX Design"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-indigo-200 text-[#003265] hover:bg-indigo-50 text-xs py-1 px-3 h-7 rounded-full transition-colors duration-300"
                  >
                    Graphic Design
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExpertsSection