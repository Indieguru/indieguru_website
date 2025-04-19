export function ErrorPopup({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 animate-scale-in">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#232636]">Error</h3>
        </div>
        <p className="text-[#676767] mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-[#143d65] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}