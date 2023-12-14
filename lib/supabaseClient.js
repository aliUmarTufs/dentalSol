import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
// export const supabase = createClient("https://lfnwqpnkgzbijuroafid.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTg2MzM3NywiZXhwIjoxOTQxNDM5Mzc3fQ.e-K_CIMz5KrsXpCk1gmVZ3l3BB2LfnGmM6gJhn8FX9s")

// STAGING
export const supabase = createClient(
  "https://thqoivzegkzbttgdugai.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocW9pdnplZ2t6YnR0Z2R1Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcyOTgyNTgsImV4cCI6MTk4Mjg3NDI1OH0.xB-GJIPo_xKNVflI2dFrf2ja-Nh_2_QHX1qKShh1Raw"
);
export const supabase_admin_secret = createClient(
  "https://thqoivzegkzbttgdugai.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocW9pdnplZ2t6YnR0Z2R1Z2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NzI5ODI1OCwiZXhwIjoxOTgyODc0MjU4fQ.1Tq9GIWjNIbPBmsNrpEJgf_k2zCx67Wq_PtoMckT7s8"
);

//PRODUCTION

// export const supabase = createClient(
//   "https://lfnwqpnkgzbijuroafid.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTg2MzM3NywiZXhwIjoxOTQxNDM5Mzc3fQ.e-K_CIMz5KrsXpCk1gmVZ3l3BB2LfnGmM6gJhn8FX9s"
// );
// export const supabase_admin_secret = createClient(
//   "https://lfnwqpnkgzbijuroafid.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI1ODYzMzc3LCJleHAiOjE5NDE0MzkzNzd9.TBLbnNnmkkHCHjscUKCGFIEGtl5_tBPli4b3AxzzLy0"
// );
