import React from 'react';
import { Filter } from 'lucide-react';

export function NewsFilter({ 
  selectedCategory, 
  selectedRegion, 
  onCategoryChange, 
  onRegionChange 
}) {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
      <Filter className="h-5 w-5 text-gray-500" />
      
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">All Categories</option>
        <option value="Funding">Funding</option>
        <option value="Startup">Startup</option>
        <option value="Ecosystem">Ecosystem</option>
        <option value="Innovation">Innovation</option>
        <option value="Policy">Policy</option>
      </select>
      
      <select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">All Regions</option>
        <option value="West Africa">West Africa</option>
        <option value="East Africa">East Africa</option>
        <option value="North Africa">North Africa</option>
        <option value="Southern Africa">Southern Africa</option>
        <option value="Central Africa">Central Africa</option>
      </select>
    </div>
  );
}