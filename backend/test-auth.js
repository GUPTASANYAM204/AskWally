import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'TestPass123!',
  phoneNumber: '+1234567890'
};

async function testRegistration() {
  console.log('🧪 Testing User Registration...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.data.user.id);
      console.log('Token:', data.data.token.substring(0, 20) + '...');
      return data.data.token;
    } else {
      console.log('❌ Registration failed:', data.message);
      if (data.errors) {
        data.errors.forEach(error => {
          console.log(`  - ${error.path}: ${error.msg}`);
        });
      }
      return null;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return null;
  }
}

async function testLogin() {
  console.log('\n🧪 Testing User Login...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.data.user.firstName, data.data.user.lastName);
      console.log('Token:', data.data.token.substring(0, 20) + '...');
      return data.data.token;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

async function testGetProfile(token) {
  console.log('\n🧪 Testing Get Profile...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get profile successful!');
      console.log('User:', data.data.user.firstName, data.data.user.lastName);
      console.log('Email:', data.data.user.email);
      console.log('Role:', data.data.user.role);
    } else {
      console.log('❌ Get profile failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Get profile error:', error.message);
  }
}

async function testInvalidLogin() {
  console.log('\n🧪 Testing Invalid Login...');
  
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123!'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('✅ Invalid login correctly rejected:', data.message);
    } else {
      console.log('❌ Invalid login should have failed!');
    }
  } catch (error) {
    console.log('❌ Invalid login test error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Tests...\n');
  
  // Test registration
  const token = await testRegistration();
  
  // Test login
  const loginToken = await testLogin();
  
  // Test get profile with token
  if (loginToken) {
    await testGetProfile(loginToken);
  }
  
  // Test invalid login
  await testInvalidLogin();
  
  console.log('\n✨ Authentication tests completed!');
}

// Run the tests
runTests().catch(console.error); 