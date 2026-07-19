const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const BASE_URL = 'http://localhost:5005';

async function runTests() {
  console.log('--- Starting Tests ---');
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for Test Setup');
  
  const dummyUser = await User.create({
    name: 'Test User ' + Date.now(),
    email: 'test' + Date.now() + '@example.com'
  });
  console.log('Test User Created:', dummyUser._id);

  try {
    console.log('\n--- Test 1: Health Check ---');
    const t1 = await fetch(`${BASE_URL}/`);
    const j1 = await t1.json();
    console.log(j1);

    console.log('\n--- Test 3: Create Withdrawal ---');
    const t3 = await fetch(`${BASE_URL}/api/withdrawals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: dummyUser._id, amount: 500 })
    });
    const j3 = await t3.json();
    console.log(j3);
    const withdrawalId = j3.data._id;

    console.log(`\n--- Test 4: Get Withdrawal (${withdrawalId}) ---`);
    const t4 = await fetch(`${BASE_URL}/api/withdrawals/${withdrawalId}`);
    const j4 = await t4.json();
    console.log(j4);

    console.log(`\n--- Test 5: Mark FAILED (${withdrawalId}) ---`);
    const t5 = await fetch(`${BASE_URL}/api/recoveries/${withdrawalId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'FAILED' })
    });
    const j5 = await t5.json();
    console.log(j5);

    console.log(`\n--- Test 6: Recovery History for User (${dummyUser._id}) ---`);
    const t6 = await fetch(`${BASE_URL}/api/recoveries/user/${dummyUser._id}`);
    const j6 = await t6.json();
    console.log(j6);

    console.log(`\n--- Test 7: Idempotency (Mark FAILED again) ---`);
    const t7 = await fetch(`${BASE_URL}/api/recoveries/${withdrawalId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'FAILED' })
    });
    console.log('Status Code:', t7.status);
    const j7 = await t7.json();
    console.log(j7);

  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
