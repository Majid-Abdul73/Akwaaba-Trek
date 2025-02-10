import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export function TechUpdate({ post }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = React.useState(false);

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return;

    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);

    await supabase
      .from('posts')
      .update({ 
        likes_count: post.likes_count + (newLikeStatus ? 1 : -1) 
      })
      .eq('id', post.id);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: `${window.location.origin}/post/${post.id}`
      });
    } catch (err) {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    }
  };

  return (
    <article 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center mb-4">
        <img
          src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.profiles?.username}`}
          alt={post.profiles?.username}
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{post.profiles?.username}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="ml-auto px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
          {post.category}
        </span>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4 line-clamp-3">{
        typeof post.content === 'string' 
          ? post.content 
          : post.content.content?.[0]?.content?.[0]?.text || ''
      }</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button 
          onClick={handleLike}
          className={`flex items-center ${isLiked ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600`}
        >
          <ThumbsUp className="h-5 w-5 mr-1" />
          <span>{post.likes_count}</span>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${post.id}#comments`);
          }}
          className="flex items-center text-gray-600 hover:text-indigo-600"
        >
          <MessageCircle className="h-5 w-5 mr-1" />
          <span>{post.comments_count}</span>
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center text-gray-600 hover:text-indigo-600"
        >
          <Share2 className="h-5 w-5 mr-1" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}