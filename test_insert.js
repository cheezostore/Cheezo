import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectColumns() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error("Error fetching product:", error.message);
  } else {
    console.log("Product columns:", data.length > 0 ? Object.keys(data[0]) : "No products in DB");
    console.log("Full product object:", data[0]);
  }
}

inspectColumns();
