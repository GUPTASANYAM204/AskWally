import http from 'http';

const signupData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'TestPass123!',
  phone: '+1234567890'
};

const postData = JSON.stringify(signupData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('\nParsed Response:', JSON.stringify(parsed, null, 2));
      
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log('\n✅ Signup successful!');
      } else {
        console.log('\n❌ Signup failed!');
        if (parsed.errors) {
          console.log('Validation errors:');
          parsed.errors.forEach(error => {
            console.log(`  - ${error.path}: ${error.msg}`);
          });
        }
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