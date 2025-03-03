import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Film, 
  Clock, 
  Calendar, 
  CreditCard, 
  Download,
  ChevronDown
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalMovies: number;
    totalWatchTime: number;
    totalRevenue: number;
  };
  userStats: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    userGrowthRate: number;
  };
  contentStats: {
    mostWatchedGenres: { name: string; count: number }[];
    mostWatchedMovies: { id: string; title: string; count: number }[];
    averageWatchTime: number;
  };
  revenueStats: {
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
    revenueGrowthRate: number;
    subscriptionDistribution: { name: string; count: number; revenue: number }[];
  };
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const { data, loading, error } = useApi<AnalyticsData>(() => 
    adminService.getAnalytics(timeRange)
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  const getGrowthIndicator = (rate: number) => {
    if (rate > 0) {
      return <span className="text-green-500 flex items-center"><TrendingUp size={14} className="mr-1" />{rate}%</span>;
    } else if (rate < 0) {
      return <span className="text-red-500 flex items-center"><TrendingUp size={14} className="mr-1 transform rotate-180" />{Math.abs(rate)}%</span>;
    } else {
      return <span className="text-gray-400">0%</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              className="pl-4 pr-10 py-2 bg-black/40 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
          
          <button className="flex items-center px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white hover:bg-white/5">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error loading analytics data. Please try again.</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">{formatNumber(data.overview.totalUsers)}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users size={20} className="text-purple-500" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                {getGrowthIndicator(data.userStats.userGrowthRate)} from last period
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <h3 className="text-2xl font-bold mt-1">{formatNumber(data.overview.activeUsers)}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users size={20} className="text-blue-500" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                {((data.overview.activeUsers / data.overview.totalUsers) * 100).toFixed(1)}% of total users
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Movies</p>
                  <h3 className="text-2xl font-bold mt-1">{formatNumber(data.overview.totalMovies)}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Film size={20} className="text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                {data.contentStats.averageWatchTime > 0 ? `Avg. watch time: ${formatTime(data.contentStats.averageWatchTime)}` : 'No watch data available'}
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Watch Time</p>
                  <h3 className="text-2xl font-bold mt-1">{formatTime(data.overview.totalWatchTime)}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Clock size={20} className="text-yellow-500" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                Across all users
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(data.overview.totalRevenue)}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <CreditCard size={20} className="text-red-500" />
                </div>
              </div>
              <div className="mt-2 text-sm">
                {getGrowthIndicator(data.revenueStats.revenueGrowthRate)} from last period
              </div>
            </div>
          </div>
          
          {/* User Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">User Growth</h2>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatNumber(data.userStats.newUsersToday)}</div>
                  <div className="text-sm text-gray-400 mt-1">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatNumber(data.userStats.newUsersThisWeek)}</div>
                  <div className="text-sm text-gray-400 mt-1">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatNumber(data.userStats.newUsersThisMonth)}</div>
                  <div className="text-sm text-gray-400 mt-1">This Month</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-400">Growth Rate</div>
                  <div className="text-sm font-medium">{data.userStats.userGrowthRate}%</div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      data.userStats.userGrowthRate > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${Math.min(Math.abs(data.userStats.userGrowthRate), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm text-gray-400 mb-3">User Acquisition</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Organic</div>
                    <div className="text-sm font-medium">65%</div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Referral</div>
                    <div className="text-sm font-medium">25%</div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Campaign</div>
                    <div className="text-sm font-medium">10%</div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Revenue Analysis */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Revenue Analysis</h2>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatCurrency(data.revenueStats.revenueToday)}</div>
                  <div className="text-sm text-gray-400 mt-1">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatCurrency(data.revenueStats.revenueThisWeek)}</div>
                  <div className="text-sm text-gray-400 mt-1">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{formatCurrency(data.revenueStats.revenueThisMonth)}</div>
                  <div className="text-sm text-gray-400 mt-1">This Month</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-400">Growth Rate</div>
                  <div className="text-sm font-medium">{data.revenueStats.revenueGrowthRate}%</div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      data.revenueStats.revenueGrowthRate > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${Math.min(Math.abs(data.revenueStats.revenueGrowthRate), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm text-gray-400 mb-3">Subscription Distribution</div>
                <div className="space-y-4">
                  {data.revenueStats.subscriptionDistribution.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">{item.name}</div>
                        <div className="text-sm font-medium">{formatCurrency(item.revenue)}</div>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-gray-400">{item.count} subscribers</div>
                        <div className="text-xs text-gray-400">
                          {((item.revenue / data.overview.totalRevenue) * 100).toFixed(1)}% of revenue
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${(item.revenue / data.overview.totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Watched Genres */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Most Watched Genres</h2>
              <div className="space-y-4">
                {data.contentStats.mostWatchedGenres.map((genre, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">{genre.name}</div>
                      <div className="text-sm font-medium">{formatNumber(genre.count)} views</div>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                        style={{ width: `${(genre.count / data.contentStats.mostWatchedGenres[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Most Watched Movies */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Most Watched Movies</h2>
              <div className="space-y-4">
                {data.contentStats.mostWatchedMovies.map((movie, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">{movie.title}</div>
                      <div className="text-sm font-medium">{formatNumber(movie.count)} views</div>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                        style={{ width: `${(movie.count / data.contentStats.mostWatchedMovies[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Analytics;
