import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Posts helpers
export const createPost = async (postData) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();
  return { data, error };
};

export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (username, avatar_url),
      media (url, type)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Comments helpers
export const createComment = async (commentData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single();
  return { data, error };
};

// Notifications helpers
export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Analytics helpers
export const trackEvent = async (eventType: string, metadata = {}) => {
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      event_type: eventType,
      metadata
    });
  return { error };
};

// Real-time subscriptions
export const subscribeToNewPosts = (callback) => {
  return supabase
    .channel('public:posts')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'posts'
    }, callback)
    .subscribe();
};

export const subscribeToNotifications = (userId: string, callback) => {
  return supabase
    .channel(`user_notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
};