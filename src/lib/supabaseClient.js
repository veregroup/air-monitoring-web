import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://app.supabase.com";       // ← Replace this
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqemd6cHdyZGV3ZHVoa29haHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDIwODEsImV4cCI6MjA2MTQxODA4MX0.NiYOSRhD6-m8DDhSEdSrzcIktw3hqplZMz2PohgaffION_KEY";                // ← Replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
