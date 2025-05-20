import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/layout/Footer';
import useExpertStore from '../store/expertStore';
import useExpertSessionsStore from '../store/expertSessionsStore';
import useExpertCohortsStore from '../store/expertCohortsStore';
import useExpertCoursesStore from '../store/expertCoursesStore';

function PaymentsPage() {
  const { expertData, fetchExpertData, isLoading: isLoadingExpert } = useExpertStore();
  const { sessions, fetchExpertSessions, isLoading: isLoadingSessions } = useExpertSessionsStore();
  const { cohorts, fetchExpertCohorts, isLoading: isLoadingCohorts } = useExpertCohortsStore();
  const { courses, fetchExpertCourses, isLoading: isLoadingCourses } = useExpertCoursesStore();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchExpertData(),
          fetchExpertSessions(),
          fetchExpertCohorts(),
          fetchExpertCourses()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, [fetchExpertData, fetchExpertSessions, fetchExpertCohorts, fetchExpertCourses]);

  if (isLoadingExpert || isLoadingSessions || isLoadingCohorts || isLoadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate totals for each type
  const sessionTotal = sessions.reduce((acc, session) => 
    acc + (session.pricing?.expertFee || 0), 0);
  const cohortTotal = cohorts.reduce((acc, cohort) => 
    acc + (cohort.pricing || 0), 0);
  const courseTotal = courses.reduce((acc, course) => 
    acc + (course.pricing || 0), 0);

  const totalEarnings = sessionTotal + cohortTotal + courseTotal;
  const totalOutstanding = expertData.outstandingAmount?.total || 0;
  const availableBalance = totalEarnings - totalOutstanding;

  // Get monthly stats
  const currentMonthEarnings = expertData.earnings?.thisMonth || 0;
  const lastMonthEarnings = expertData.earnings?.lastMonth || 0;
  const monthlyGrowth = lastMonthEarnings ? 
    ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-800">IndieGuru</span>
                <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">Expert</span>
              </div>
              <nav className="ml-8 flex space-x-8">
                <Link to="/expert" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Dashboard
                </Link>
                <Link to="/blogpage" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Blogs
                </Link>
                <Link to="/communitypage" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Community
                </Link>
                <Link to="/bookings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Bookings
                </Link>
                <Link to="/payments" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-700 text-sm font-medium text-gray-900">
                  Payments
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src={expertData.avatar || "https://randomuser.me/api/portraits/women/48.jpg"} alt="Expert profile" />
                  <span className="ml-2 text-sm text-gray-700">{expertData.name || "Expert"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Earnings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-indigo-600">${totalEarnings}</p>
              <div className="mt-2 text-sm text-gray-500">Combined earnings from all services</div>
            </div>
            
            {/* Outstanding Amount Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Outstanding Amount</h3>
              <p className="text-3xl font-bold text-yellow-600">${totalOutstanding}</p>
              <div className="mt-2 text-sm text-gray-500">
                Pending payments to be received
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-medium text-yellow-600">${expertData.outstandingAmount?.sessions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="text-gray-600">Courses</span>
                    <span className="font-medium text-yellow-600">${expertData.outstandingAmount?.courses || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Cohorts</span>
                    <span className="font-medium text-yellow-600">${expertData.outstandingAmount?.cohorts || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Available Balance Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Balance</h3>
              <p className="text-3xl font-bold text-green-600">${availableBalance}</p>
              <div className="mt-2 text-sm text-gray-500">
                Amount available for withdrawal
                <div className="flex flex-col gap-1 mt-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Total Earnings</span>
                    <span className="font-medium text-gray-900">+${totalEarnings}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span>Outstanding Amount</span>
                    <span>-${totalOutstanding}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t font-medium text-green-600">
                    <span>Available Balance</span>
                    <span>${availableBalance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Earnings Breakdown */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings Breakdown</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Courses</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">${courseTotal}</p>
                  <div className="text-xs text-gray-500">{courses.length} courses</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">1:1 Sessions</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">${sessionTotal}</p>
                  <div className="text-xs text-gray-500">{sessions.length} sessions</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cohorts</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">${cohortTotal}</p>
                  <div className="text-xs text-gray-500">{cohorts.length} cohorts</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...sessions, ...courses, ...cohorts]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 10)
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.createdAt || item.publishingDate || item.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.title ? (item.meetLink ? 'Cohort' : 'Course') : 'Session'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.title || 'One-on-One Session'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ${typeof item.pricing === 'object' ? 
                            (item.pricing.expertFee || 0) : 
                            (item.pricing || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'completed' || item.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

export default PaymentsPage;