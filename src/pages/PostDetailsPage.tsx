import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { supabase, createComment, trackEvent } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { RichTextEditor } from '../components/RichTextEditor';

export function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState('');
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    const fetchPost = async () => {
      const { data: postData } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (username, avatar_url),
          media (url, type)
        `)
        .eq('id', id)
        .single();

      if (postData) {
        setPost(postData);
        // Track view
        trackEvent('view_post', { post_id: id });
      }
    };

    const fetchComments = async () => {
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:author_id (username, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (commentsData) setComments(commentsData);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      // Implement auth redirect
      return;
    }

    const { data: comment } = await createComment({
      post_id: id,
      author_id: user.id,
      content: newComment
    });

    if (comment) {
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);

    await supabase
      .from('posts')
      .update({ 
        likes_count: post.likes_count + (newLikeStatus ? 1 : -1) 
      })
      .eq('id', id);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <img
              src={post.profiles.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.profiles.username}`}
              alt={post.profiles.username}
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{post.profiles.username}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="ml-auto px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
              {post.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="prose max-w-none mb-6">
            {typeof post.content === 'string' 
              ? post.content
              : <RichTextEditor content={post.content} onChange={() => {}} readOnly />
            }
          </div>

          {post.media?.map(media => (
            <div key={media.id} className="mt-4">
              {media.type === 'image' && (
                <img src={media.url} alt="" className="rounded-lg" />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button 
              onClick={handleLike}
              className={`flex items-center ${isLiked ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-600`}
            >
              <ThumbsUp className="h-5 w-5 mr-1" />
              <span>{post.likes_count}</span>
            </button>

            <button className="flex items-center text-gray-600 hover:text-indigo-600">
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>{comments.length}</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-indigo-600"
            >
              <Share2 className="h-5 w-5 mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>

          {user ? (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                required
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="text-gray-600 mb-6">
              Please <button onClick={() => {/* Implement auth */}} className="text-indigo-600">sign in</button> to comment
            </p>
          )}

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.profiles.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.profiles.username}`}
                  alt={comment.profiles.username}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-900">{comment.profiles.username}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}