import http from 'http';

const loginData = {
  email: 'test@example.com',
  password: 'TestPass123!'
};

const postData = JSON.stringify(loginData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed response:', JSON.stringify(parsed, null, 2));
      
      if (parsed.success && parsed.data.token) {
        console.log('\n✅ Login successful!');
        console.log('Token received:', parsed.data.token.substring(0, 50) + '...');
        
        // Test the token by calling the /me endpoint
        testGetProfile(parsed.data.token);
      }
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function testGetProfile(token) {
  console.log('\n🧪 Testing /me endpoint with token...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Profile Response:', data);
      try {
        const parsed = JSON.parse(data);
        if (parsed.success) {
          console.log('✅ Profile retrieved successfully!');
          console.log('User:', parsed.data.user.firstName, parsed.data.user.lastName);
          console.log('Email:', parsed.data.user.email);
        }
      } catch (e) {
        console.log('Could not parse profile response as JSON');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with profile request: ${e.message}`);
  });

  req.end();
} 