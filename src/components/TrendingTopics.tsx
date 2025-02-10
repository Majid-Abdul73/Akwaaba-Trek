import React from 'react';
import { TrendingUp, Users, Rocket } from 'lucide-react';

const TRENDING_TOPICS = [
  {
    title: "African Startups Breaking Records",
    views: "2.5K",
    category: "Trending"
  },
  {
    title: "Tech Talent Development",
    views: "1.8K",
    category: "Education"
  },
  {
    title: "Blockchain in Africa",
    views: "1.2K",
    category: "Technology"
  }
];

const FEATURED_CONTRIBUTORS = [
  {
    name: "Ada Okonkwo",
    role: "Tech Journalist",
    posts: 45
  },
  {
    name: "Kwame Mensah",
    role: "VC Analyst",
    posts: 32
  },
  {
    name: "Amina Said",
    role: "Startup Founder",
    posts: 28
  }
];

export function TrendingTopics() {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h2 className="ml-2 text-lg font-semibold text-gray-900">Trending Topics</h2>
        </div>
        
        <div className="space-y-4">
          {TRENDING_TOPICS.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{topic.title}</h3>
                <p className="text-xs text-gray-500">{topic.category}</p>
              </div>
              <span className="text-sm text-gray-600">{topic.views} views</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Contributors */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <h2 className="ml-2 text-lg font-semibold text-gray-900">Featured Contributors</h2>
        </div>
        
        <div className="space-y-4">
          {FEATURED_CONTRIBUTORS.map((contributor, index) => (
            <div key={index} className="flex items-center">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${contributor.name}`}
                alt={contributor.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                <p className="text-xs text-gray-500">{contributor.role}</p>
              </div>
              <span className="ml-auto text-sm text-gray-600">{contributor.posts} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Rocket className="h-5 w-5 text-indigo-600" />
          <h2 className="ml-2 text-lg font-semibold text-gray-900">Platform Stats</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">1.2K</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">3.5K</p>
            <p className="text-sm text-gray-600">Updates Shared</p>
          </div>
        </div>
      </div>
    </div>
  );
}