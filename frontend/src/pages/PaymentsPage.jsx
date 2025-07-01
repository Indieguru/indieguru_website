import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import axiosInstance from '../config/axios.config';

function ExpertPayments() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentsData, setPaymentsData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [showFiltered, setShowFiltered] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchExpertTransactions();
  }, []);

  const fetchExpertTransactions = async () => {
    try {
      const response = await axiosInstance.get('/expert/transactions');
      if (response.status === 200) {
        setPaymentsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSearch = async () => {
    if (!filterType && !startDate && !endDate) {
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (filterType && filterType !== 'all') params.append('type', filterType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosInstance.get(`/expert/transactions/filter?${params.toString()}`);
      if (response.status === 200) {
        setFilteredData(response.data);
        setShowFiltered(true);
      }
    } catch (error) {
      console.error('Error fetching filtered transactions:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const resetFilters = () => {
    setFilterType('all');
    setStartDate('');
    setEndDate('');
    setShowFiltered(false);
    setFilteredData(null);
  };

  const currentData = showFiltered ? filteredData : paymentsData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        </motion.div>

        {/* Filter Section */}
        <motion.section 
          className="mb-8 bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Transactions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="session">Sessions</option>
                <option value="course">Courses</option>
                <option value="cohort">Cohorts</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Search Button */}
            <div className="flex space-x-2">
              <button
                onClick={handleFilterSearch}
                disabled={isSearching}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Search'
                )}
              </button>
              {showFiltered && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter Results Summary */}
          {showFiltered && filteredData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">{filteredData.transactionCount}</span> transactions found
                  </p>
                  <p className="text-sm text-blue-600">
                    Total earnings: <span className="font-semibold">₹{filteredData.totalEarnings}</span>
                  </p>
                </div>
                <div className="text-xs text-blue-600">
                  {filteredData.filters.type !== 'all' && (
                    <span className="inline-block bg-blue-100 px-2 py-1 rounded mr-2">
                      Type: {filteredData.filters.type}
                    </span>
                  )}
                  {filteredData.filters.startDate && (
                    <span className="inline-block bg-blue-100 px-2 py-1 rounded mr-2">
                      From: {filteredData.filters.startDate}
                    </span>
                  )}
                  {filteredData.filters.endDate && (
                    <span className="inline-block bg-blue-100 px-2 py-1 rounded">
                      To: {filteredData.filters.endDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* Section 1: Payment Cards Overview */}
        <motion.section 
          className="mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Lifetime Earnings Card */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-[0.1px] border-green-200 flex flex-col items-center justify-center"
              variants={item}
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-500">
                  {showFiltered ? 'Filtered Earnings' : 'Lifetime Earnings'}
                </h3>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{showFiltered ? filteredData?.totalEarnings || 0 : paymentsData?.lifetimeEarnings || 0}
                </div>
              </div>
            </motion.div>
            
            {/* Only show source breakdown for unfiltered data */}
            {!showFiltered && (
              <>
                {/* Courses Card */}
                <motion.div 
                  className="bg-blue-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-800">Courses</h4>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">₹{paymentsData?.sourceEarnings?.courses || 0}</div>
                  <div className="mt-3 text-xs text-gray-600">From course sales</div>
                </motion.div>

                {/* 1:1 Sessions Card */}
                <motion.div 
                  className="bg-purple-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100"
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-800">1:1 Sessions</h4>
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">₹{paymentsData?.sourceEarnings?.sessions || 0}</div>
                  <div className="mt-3 text-xs text-gray-600">From 1:1 sessions</div>
                </motion.div>

                {/* Cohorts Card */}
                <motion.div 
                  className="bg-green-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-green-800">Cohorts</h4>
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">₹{paymentsData?.sourceEarnings?.cohorts || 0}</div>
                  <div className="mt-3 text-xs text-gray-600">From cohort programs</div>
                </motion.div>

                {/* Outstanding Amount Card */}
                <motion.div 
                  className="bg-orange-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100"
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-orange-800">Outstanding</h4>
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-orange-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">₹{paymentsData?.outstandingAmount?.total || 0}</div>
                  <div className="mt-3 text-xs text-gray-600">Pending payments</div>
                </motion.div>
              </>
            )}
          </div>
        </motion.section>

        {/* Recent Activity Table */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {showFiltered ? 'Filtered Transactions' : 'Recent Activity'}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData?.transactions?.map((transaction) => (
                      <motion.tr 
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₹{transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                    {(!currentData?.transactions || currentData.transactions.length === 0) && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

export default ExpertPayments;