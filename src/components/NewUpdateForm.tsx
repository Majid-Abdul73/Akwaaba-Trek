import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function NewUpdateForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Funding',
    region: 'West Africa'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      author: 'Guest User' // In a real app, this would come from auth
    });
    setFormData({
      title: '',
      content: '',
      category: 'Funding',
      region: 'West Africa'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Share a Tech Update</h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <textarea
            placeholder="What's happening in African tech?"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            required
          />
        </div>
        
        <div className="flex space-x-4">
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Funding">Funding</option>
            <option value="Startup">Startup</option>
            <option value="Ecosystem">Ecosystem</option>
            <option value="Innovation">Innovation</option>
            <option value="Policy">Policy</option>
          </select>
          
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="West Africa">West Africa</option>
            <option value="East Africa">East Africa</option>
            <option value="North Africa">North Africa</option>
            <option value="Southern Africa">Southern Africa</option>
            <option value="Central Africa">Central Africa</option>
          </select>
        </div>
      </div>
      
      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Send className="h-4 w-4 mr-2" />
        Post Update
      </button>
    </form>
  );
}