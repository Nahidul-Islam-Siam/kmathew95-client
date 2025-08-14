import React from "react";

const BoostPage = () => {
  return (
    <div className="w-full py-12 text-center  bg-white">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Boost your Listings
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Give your visitors a smooth online experience with a solid UX design.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Boost Post Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13 2.05v2.02c4.39.54 7.5 4.53 6.96 8.92A8.014 8.014 0 0 1 13 19.93v2.02c5.5-.55 9.5-5.43 8.95-10.93-.45-4.5-4.45-8.5-8.95-8.97zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-1-11h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Boost Post</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Feature your listing at the top of feeds for 7 days
          </p>

          <div className="text-3xl font-bold text-gray-900 mb-8">$4.99</div>

          <button className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-700 transition-colors mb-6">
            Purchase now
          </button>

          <p className="text-sm text-gray-500">
            Available when viewing a specific listing
          </p>
        </div>

        {/* Verified Badge Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Verified Badge
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Feature your listing at the top of feeds for 7 days
          </p>

          <div className="text-3xl font-bold text-gray-900 mb-8">$7.99</div>

          <button className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-700 transition-colors mb-6">
            Purchase now
          </button>

          <p className="text-sm text-gray-500">
            Available when viewing a specific listing
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoostPage;
