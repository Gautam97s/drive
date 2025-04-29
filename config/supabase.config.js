const { createClient } = require('@supabase/supabase-js');

console.log('Environment:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'exists' : 'MISSING',
  SUPABASE_SERVICE_ROLL_KEY: process.env.SUPABASE_SERVICE_ROLL_KEY ? 'exists' : 'MISSING'
});

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLL_KEY) {
    console.error('Missing Supabase credentials!');
    throw new Error('Supabase configuration failed');
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLL_KEY  
);


(async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
        
      if (error) throw error;
      console.log('\x1b[32m','Supabase connected successfully');
      console.log('Available buckets:', data.map(b => b.name));
      
      
      if (!data.find(bucket => bucket.name === BUCKET_NAMES.gtmdrive)) {
        console.log('Creating gtmdrive bucket...');
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAMES.gtmdrive, {
          public: true 
        });
        
        if (createError) throw createError;
        console.log('gtmdrive bucket created successfully');
      }
    } catch (err) {
      console.error('\x1b[31m', 'Supabase operation failed:', err.message);
      process.exit(1);
    }
  })();

const BUCKET_NAMES = {
  gtmdrive: 'gtmdrive',
  DOCUMENTS: 'user-documents'
};

module.exports = { supabase, BUCKET_NAMES };
