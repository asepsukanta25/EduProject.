
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Ganti nilai di bawah ini dengan URL dan Key dari dashboard Supabase Anda
// Untuk demo ini, kita asumsikan variabel dipasang di window atau diisi manual
const supabaseUrl = (window as any).SUPABASE_URL || 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = (window as any).SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
