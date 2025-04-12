function ProgressSection() {
  return (
    <section className="bg-blue-800 rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between relative shadow-md transition-transform hover:translate-y-[-2px] duration-300">
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-indigo-700 flex items-center justify-center rounded-l-lg">
        <div className="transform -rotate-90 whitespace-nowrap text-white text-sm font-semibold tracking-wider">
          PROGRESS
        </div>
      </div>
      <div className="pl-8 md:pl-12">
        <div className="flex items-center gap-2 text-white mb-1">
          <div className="text-green-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 17L9 11L13 15L21 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm">Profile Level</span>
        </div>
        <div className="text-2xl font-bold text-white">6/8</div>
      </div>
      <div>
        <div className="flex items-center gap-2 text-white mb-1">
          <div className="text-green-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 17L9 11L13 15L21 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm">Courses Enrolled</span>
        </div>
        <div className="text-2xl font-bold text-white">4</div>
      </div>
      <div>
        <div className="flex items-center gap-2 text-white mb-1">
          <div className="text-green-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 17L9 11L13 15L21 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm">Skills Learned</span>
        </div>
        <div className="text-2xl font-bold text-white">4</div>
      </div>
      <div>
        <div className="flex items-center gap-2 text-white mb-1">
          <div className="text-yellow-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm">Daily Streak</span>
        </div>
        <div className="text-2xl font-bold text-white">100</div>
      </div>
    </section>
  )
}

export default ProgressSection