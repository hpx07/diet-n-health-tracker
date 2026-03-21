import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbHRpeXdqeXFodmVkaGVhcmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzEzODEsImV4cCI6MjA4NDY0NzM4MX0.jKTdz5cgfE2LfpZvaa4fesOPi9YrtZg9WY1hwGm55Jc';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey;
};
