import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

const SUPABASE_URL: any = process.env.SUPABASE_URL;
const SUPABASE_KEY: any = process.env.SUPABASE_APIKEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: "public"}});