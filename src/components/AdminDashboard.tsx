import React from 'react';
import { BarChart, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalPosts: 0,
    totalUsers: 0,
    totalViews: 0
  });

  React.useEffect(() => {
    async function fetchStats() {
      const [
        { count: postsCount },
        { count: usersCount },
        { data: viewsData }
      ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('analytics_events')
          .select('event_type')
          .eq('event_type', 'view_post')
      ]);

      setStats({
        totalPosts: postsCount || 0,
        totalUsers: usersCount || 0,
        totalViews: viewsData?.length || 0
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BarChart className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}