import { Button } from "../ui/button"

function ReferSection() {
  return (
    <section className="bg-[#0a2351] rounded-none p-6 mb-12 flex flex-col md:flex-row justify-between items-center">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-white mb-2 leading-tight">
          Refer IndieGuru to your peer
          <br />& win amazing goodies
        </h2>
      </div>
      <div className="md:w-1/2 flex md:justify-end gap-12 items-center">
        <Button className="bg-[#ffd966] hover:bg-[#ffecb3] text-[#0a2351] font-semibold px-8 py-3 mr-24 text-lg rounded-sm">
          Refer Now
        </Button>
        <div className="hidden md:block">
          <img src="/referillus.png" alt="Refer a friend illustration" className="w-40 h-40" />
        </div>
      </div>
    </section>
  )
}

export default ReferSection

