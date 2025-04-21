import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://vqksdzkihzcsjitrcqaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa3NkemtpaHpjc2ppdHJjcWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTUwMzEsImV4cCI6MjA2MDc5MTAzMX0.qQAR4boQn-mSNcPOkjJcI4lZku8UAiuwEtOG0tQIA54';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);