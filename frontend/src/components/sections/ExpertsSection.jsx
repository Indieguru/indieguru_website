import { Card } from "../ui/card"
import { Button } from "../ui/button"
import placeholderImage from "../../assets/placeholder.svg"

function ExpertsSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-[#232636] mb-1">Choose Your Own Expert</h2>
      <p className="text-sm text-[#6d6e76] mb-6">
        Learn currently trending topics like data science, artificial intelligence and many more from the experts across
        the Globe.
      </p>

      <div className="overflow-x-auto whitespace-nowrap">
        <div className="inline-flex gap-4">
          {[1, 2, 3, 4,5,6].map((index) => (
            <Card key={index} className="border border-[#fae596] rounded-lg overflow-hidden w-64">
              <div className="aspect-square bg-gray-200">
                <img src={ "/imagecopy.png"} alt="Expert" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-[#232636]">Jane Doe</h3>
                    <p className="text-xs text-[#6d6e76]">Designer</p>
                  </div>
                  <div className="flex">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i} className="text-[#fbb236]">
                        {star}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#6d6e76] mb-3">
                  3+ years of experience in paid search marketing, social media marketing, management and performance
                  analysis
                </p>
                <div className="flex gap-2">
                  <Button className="bg-[#003265] hover:bg-[#143d65] text-white text-xs py-1 px-3 h-7 rounded-full">
                    {index === 1
                      ? "UI/UX Design"
                      : index === 2
                      ? "UI/UX Design"
                      : index === 3
                      ? "UI/UX Design"
                      : "UI/UX Design"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#003265] text-[#003265] text-xs py-1 px-3 h-7 rounded-full"
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

