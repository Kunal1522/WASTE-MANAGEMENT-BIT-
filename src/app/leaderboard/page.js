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
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Leaderboard</h1>
      
      {/* Database connection warning - only show when using mock data */}
      {leaderboardData && leaderboardData[0]?.name?.startsWith('Demo') && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <p className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Database connection issue:</strong> Showing demo data. Real scores will appear when the database connection is restored.
            </span>
          </p>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((user, index) => (
                <tr 
                  key={index} 
                  className={user.userId === userId ? "bg-green-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.totalPoints} points
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-sm text-gray-500 text-center">
                  No data available. Be the first to contribute!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Points are earned by collecting and reporting waste. Start collecting now to appear on the leaderboard!
        </p>
      </div>
    </div>
  )
}