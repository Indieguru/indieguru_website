import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

function ReferSection() {
  const navigate = useNavigate();

  const handleReferClick = () => {
    navigate('/refer');
  };

  return (
    <section className="bg-yellow-500 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center shadow-md relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-8 left-24 w-24 h-24 rounded-full bg-white opacity-10"></div>
        <div className="absolute top-16 right-32 w-16 h-16 rounded-full bg-white opacity-10"></div>
      </div>
      
      <div className="md:w-1/2 z-10">
        <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
          Refer IndieGuru to your peer
          <br />& win amazing goodies
        </h2>
        <p className="text-white text-opacity-90 max-w-md">
          For every successful referral, earn 50 coins and unlock exclusive rewards!
        </p>
      </div>
      <div className="md:w-1/2 flex md:justify-end gap-12 items-center z-10">
        <Button 
          onClick={handleReferClick}
          className="bg-white hover:bg-gray-50 text-yellow-600 font-semibold px-8 py-3 mr-24 text-lg rounded shadow-md border-2 border-yellow-400 transition-colors duration-300"
        >
          Refer Now
        </Button>
        <div className="hidden md:block">
          <img src="/referillus.png" alt="Refer a friend illustration" className="w-40 h-40 transform transition-transform hover:scale-105 duration-300" />
        </div>
      </div>
    </section>
  )
}

export default ReferSection