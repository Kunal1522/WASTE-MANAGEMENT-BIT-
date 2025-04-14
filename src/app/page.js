import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center my-16 relative">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-96 h-96 rounded-full bg-green-100 opacity-70 tree-animation-circle"></div>
          <div className="absolute w-[500px] h-[500px] tree-animation-outer"></div>
          <div className="absolute w-[400px] h-[400px] tree-animation-inner"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="mb-8 md:mb-0 tree-image-container">
            <Image 
              src="/tree.png" 
              alt="Green Tree" 
              width={400} 
              height={400} 
              className="object-contain"
              priority
            />
          </div>
          
          <div className="text-left md:max-w-xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              <span className="text-green-700">
                EcoTrack
              </span>
            </h1>
            <p className="mt-4 text-2xl font-medium text-green-800">
              Turning waste into environmental impact
            </p>
            
            <p className="mt-6 text-lg text-black font-medium">
              Join our mission for a cleaner, more sustainable future through smart waste management and community action.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/collect" 
                className="px-8 py-4 rounded-xl bg-green-600 text-white font-medium text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Collecting
              </Link>
              <Link 
                href="/leaderboard" 
                className="px-8 py-4 rounded-xl bg-white text-green-700 border-2 border-green-600 font-medium text-lg hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">100+</h3>
          <p className="text-black font-medium">Waste Items Collected</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">10+</h3>
          <p className="text-black font-medium">Active Contributors</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">5+</h3>
          <p className="text-black font-medium">Locations Covered</p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Step cards with better contrast */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Locate Waste</h3>
                <p className="text-black">
                  Discover nearby waste collection opportunities. Use our interactive map to find areas that need attention.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Document & Report</h3>
                <p className="text-black">
                  Take photos and report waste locations. Our AI helps categorize and prioritize cleanup efforts.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Earn & Impact</h3>
                <p className="text-black">
                  Collect points for your environmental contributions and compete with others on the leaderboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-24 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-700 p-12 text-center relative">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-white text-xl max-w-2xl mx-auto mb-8">
              Join our community of environmental champions and start making an impact today. 
              Every action counts towards a cleaner, more sustainable future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/collect" 
                className="px-8 py-4 rounded-xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Collecting
              </Link>
              <Link 
                href="/report" 
                className="px-8 py-4 rounded-xl bg-green-800 text-white font-bold text-lg hover:bg-green-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Report Waste
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
