import { createClient } from '@supabase/supabase-js';

// These values will be provided by the Supabase integration
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Make sure you have connected your project to Supabase using the Supabase menu in the top right corner.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);