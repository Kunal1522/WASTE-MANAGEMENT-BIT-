import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center my-16 relative">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-80 h-80 rounded-full bg-green-100 opacity-70 tree-animation"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="mb-8 md:mb-0">
            <Image 
              src="/tree.png" 
              alt="Green Tree" 
              width={300} 
              height={300} 
              className="object-contain"
              priority
            />
          </div>
          
          <div className="text-left md:max-w-xl">
            <h1 className="text-4xl font-bold text-green-700 sm:text-5xl md:text-6xl">
              <span className="block font-extrabold">Waste Management</span>
              <span className="block mt-2 text-3xl sm:text-4xl md:text-5xl text-green-600">Make an Impact Today</span>
            </h1>
            
            <p className="mt-4 text-xl text-gray-800">
              Help clean the environment by collecting and reporting waste. Earn points and compete with others on the leaderboard.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/collect" className="px-8 py-3 rounded-lg bg-green-600 text-white font-medium text-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                Start Collecting
              </Link>
              <Link href="/leaderboard" className="px-8 py-3 rounded-lg bg-white text-green-700 border-2 border-green-600 font-medium text-lg hover:bg-green-50 transition-colors duration-300">
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Locate Waste</h3>
                <p className="text-gray-800">
                  Find waste in your surroundings that needs to be collected. Search your neighborhood, parks, or public areas.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black-800 mb-2
              ">Take a Photo</h3>
                <p className="text-gray-800">
                  Capture a photo of the waste you've found or collected to document your environmental contribution.
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Earn Points</h3>
                <p className="text-gray-800">
                  Submit your entry and earn points on the leaderboard. Compete with others to make the biggest environmental impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-24 bg-green-700 rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
        <p className="text-green-100 text-xl max-w-2xl mx-auto mb-8">
          Join our community of environmental champions and start making an impact today. Every piece of waste collected contributes to a cleaner planet.
        </p>
        <Link href="/collect" className="inline-block px-8 py-4 rounded-lg bg-white text-green-700 font-medium text-lg hover:bg-green-100 transition-colors duration-300 shadow-md">
          Get Started Now
        </Link>
      </div>
    </div>
  )
}
