import React from 'react';
import { NewUpdateForm } from '../components/NewUpdateForm';
import { TechUpdate } from '../components/TechUpdate';
import { TrendingTopics } from '../components/TrendingTopics';
import { NewsFilter } from '../components/NewsFilter';
import { useAuthStore } from '../stores/authStore';
import { getPosts, trackEvent } from '../lib/supabase';

export function HomePage() {
  const [posts, setPosts] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedRegion, setSelectedRegion] = React.useState('all');
  const { isAdmin } = useAuthStore();

  React.useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await getPosts();
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    const regionMatch = selectedRegion === 'all' || post.region === selectedRegion;
    return categoryMatch && regionMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {isAdmin && <NewUpdateForm />}
          <div className="mt-8">
            <NewsFilter 
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onCategoryChange={setSelectedCategory}
              onRegionChange={setSelectedRegion}
            />
          </div>
          <div className="mt-6 space-y-6">
            {filteredPosts.map(post => (
              <TechUpdate key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <TrendingTopics />
        </div>
      </div>
    </div>
  );
}