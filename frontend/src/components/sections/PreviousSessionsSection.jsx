import { Card } from "../ui/card"
import { Button } from "../ui/button"

function PreviousSessionsSection() {
  const courses = [
    {
      title: "Product Management Basic - Course",
      color: "#00BCD4",
      students: 40,
      icon: "📊",
    },
    {
      title: "BI Data Science Professional Certificate",
      color: "#FFC107",
      students: 11,
      icon: "📈",
    },
    {
      title: "The Science of Well-Being",
      color: "#2196F3",
      students: 234,
      icon: "😊",
    },
    {
      title: "Python for Everybody Specialization",
      color: "#009688",
      students: 342,
      icon: "🐍",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-[#232636] mb-1">Previous Sessions</h2>
      <p className="text-sm text-[#6d6e76] mb-6">
        Lorem ipsum Dolor sit amet,consectetur ipsum adipiscing elit, sed do eiusmod tempor Lorem ipsum
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-32" style={{ backgroundColor: course.color }}>
              <div className="h-full flex items-center justify-center text-4xl">{course.icon}</div>
            </div>
            <div className="p-4">
              <div className="flex mb-2">
                {["🔴", "🟢", "🔵"].map((dot, i) => (
                  <span key={i} className="mr-1">
                    {dot}
                  </span>
                ))}
                <span className="text-xs text-[#6d6e76] ml-1">{course.students} students</span>
              </div>
              <h3 className="font-semibold text-[#232636] text-sm mb-2">{course.title}</h3>
              <p className="text-xs text-[#6d6e76] mb-4">
                Product Management Masterclass, you will learn with Google's former Head of Product & Customer Platform,
                Duke Chung.
              </p>
              <div className="flex justify-between">
                <Button className="bg-[#003265] hover:bg-[#143d65] text-white text-xs py-1 px-3 h-8 rounded">
                  Book Again
                </Button>
                <Button variant="outline" className="border-[#d1dffc] text-[#003265] text-xs py-1 px-3 h-8 rounded">
                  Summary
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default PreviousSessionsSection

