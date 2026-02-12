
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * PENTING:
 * Ganti dua nilai di bawah ini dengan data dari Dashboard Supabase Anda.
 * Jika masih berisi teks "SILAKAN_PASTE...", aplikasi akan menampilkan peringatan.
 */

const supabaseUrl = 'https://xivavwurquspakdgtgvd.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdmF2d3VycXVzcGFrZGd0Z3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NjI4OTksImV4cCI6MjA4NjQzODg5OX0.XaG0WHeS0EVLwu0U97y8yzscznXKhq1i3IwLtRwphxU';

// Fungsi pengecekan agar tidak blank putih
const isValidUrl = (url: string) => {
  try { return url.startsWith('https://'); } catch { return false; }
};

export const supabase = isValidUrl(supabaseUrl) 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

if (!supabase) {
  console.error("Supabase belum dikonfigurasi dengan URL yang benar.");
}
