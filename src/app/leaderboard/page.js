import { auth } from '@clerk/nextjs/server'
import connectToDatabase from '../../lib/mongodb'
import User from '../../lib/models/User'

async function getLeaderboardData() {
  try {
    // Connect to the database and check connection status
    const connection = await connectToDatabase() 
    // Check if connection was successful
    if (connection && connection.isConnected === false) {
      console.log('Using mock data due to MongoDB connection issues')
      // Return mock data if database is not available
      return [
        { name: 'Demo User 1', totalPoints: 150 },
        { name: 'Demo User 2', totalPoints: 120 },
        { name: 'Demo User 3', totalPoints: 100 },
        { name: 'Demo User 4', totalPoints: 85 },
        { name: 'Demo User 5', totalPoints: 70 }
      ]
    }
    
    // Get top 50 users by points in descending order
    const users = await User.find({})
      .sort({ totalPoints: -1 })
      .limit(50)
      .select('name totalPoints')
      .lean()
    
    return users
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    // Return mock data in case of error
    return [
      { name: 'Demo User 1', totalPoints: 150 },
      { name: 'Demo User 2', totalPoints: 120 },
      { name: 'Demo User 3', totalPoints: 100 }
    ]
  }
}

export default async function LeaderboardPage() {
  const { userId } = auth()
  const leaderboardData = await getLeaderboardData()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl shadow-lg px-8 py-10 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3 text-white">Environmental Champions</h1>
        <p className="text-white text-xl max-w-2xl mx-auto">
          Recognizing those making the biggest impact in waste management and environmental cleanup
        </p>
      </div>
      
      {/* Database connection warning - only show when using mock data */}
      {leaderboardData && leaderboardData[0]?.name?.startsWith('Demo') && (
        <div className="mb-8 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl shadow-sm">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-base font-medium">
              <strong>Database connection issue:</strong> Showing demo data. Real scores will appear when the database connection is restored.
            </span>
          </p>
        </div>
      )}
      
      {/* Leaderboard Table */}
      <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-green-100">
        <div className="bg-green-50 px-6 py-5 border-b border-green-100">
          <h2 className="text-2xl font-semibold text-black font-bold">Leaderboard Rankings</h2>
          <p className="text-green-900 mt-1 font-medium">Top waste collectors making a difference</p>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-600">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((user, index) => (
                <tr 
                  key={index} 
                  className={`${user.userId === userId ? "bg-green-50" : index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index < 3 ? (
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-white font-bold
                        ${index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          'bg-amber-700'
                        }
                      `}>
                        {index + 1}
                      </div>
                    ) : (
                      <div className="text-black font-medium">{index + 1}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-black flex items-center">
                      {user.userId === userId && (
                        <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          You
                        </span>
                      )}
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="text-base font-semibold text-black">
                        {user.totalPoints} points
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-base text-black text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <p className="text-lg font-medium text-black">No data available. Be the first to contribute!</p>
                  <p className="mt-2 text-black">Start collecting and reporting waste to earn points.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-black font-medium">
              Points are earned by collecting and reporting waste. Each verified contribution earns you points!
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-12 bg-green-700 rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Join the Environmental Movement!</h2>
        <p className="text-white text-lg max-w-2xl mx-auto mb-6">
          Every piece of waste collected contributes to a cleaner planet. Start collecting or reporting now!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/collect" className="px-6 py-3 bg-blue text-green-700 font-semibold rounded-lg shadow hover:bg-black-50 transition-colors">
            Collect Waste
          </a>
          <a href="/report" className="px-6 py-3 bg-green-800 text-white font-semibold rounded-lg shadow hover:bg-green-900 transition-colors">
            Report Waste
          </a>
        </div>
      </div>
    </div>
  )
}