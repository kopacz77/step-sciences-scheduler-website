// test-supabase.js - Quick test script for Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test 1: Check if companies table exists and has data
    console.log('\n📊 Testing companies table access...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, domain')
      .limit(5);

    if (companiesError) {
      console.error('❌ Companies table error:', companiesError.message);
      console.log('\n💡 This usually means:');
      console.log('   1. You need to run the SQL schema in your Supabase dashboard');
      console.log('   2. Or check if Row Level Security (RLS) is blocking access');
    } else {
      console.log('✅ Companies table access successful!');
      console.log(`📝 Found ${companies.length} companies:`);
      companies.forEach(company => {
        console.log(`   - ${company.name} (${company.id}) → ${company.domain}`);
      });
    }

    // Test 2: Check specific company lookup
    console.log('\n🔍 Testing company lookup by domain...');
    const { data: gmOshawa, error: lookupError } = await supabase
      .from('companies')
      .select('*')
      .eq('domain', 'gmoshawa.stepsciences.com')
      .single();

    if (lookupError) {
      console.error('❌ Domain lookup error:', lookupError.message);
    } else {
      console.log('✅ Domain lookup successful!');
      console.log(`📍 Found: ${gmOshawa.name} with calendar URL: ${gmOshawa.calendar_url.substring(0, 50)}...`);
    }

    // Test 3: Check if we can insert (this will likely fail due to RLS, which is expected)
    console.log('\n🧪 Testing insert capability...');
    const testCompany = {
      id: 'test-company-' + Date.now(),
      name: 'Test Company',
      full_name: 'Test Company Full Name',
      calendar_url: 'https://calendar.google.com/test',
      intake_form_url: 'https://step-sciences.web.app/intake/test',
      domain: 'test.stepsciences.com'
    };

    const { data: inserted, error: insertError } = await supabase
      .from('companies')
      .insert([testCompany])
      .select()
      .single();

    if (insertError) {
      console.log('⚠️  Insert failed (expected if RLS is enabled):', insertError.message);
      console.log('💡 This is normal - RLS should block anonymous inserts');
    } else {
      console.log('✅ Insert successful! (cleanup required)');
      // Clean up test data
      await supabase.from('companies').delete().eq('id', testCompany.id);
      console.log('🧹 Test data cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }

  console.log('\n🎯 Next steps:');
  console.log('1. If companies table access failed, run the schema SQL in Supabase dashboard');
  console.log('2. Try running your React app: pnpm start');
  console.log('3. Visit http://localhost:3000 to test the main app');
  console.log('4. Visit http://localhost:3000/admin to test the admin interface');
}

testConnection();