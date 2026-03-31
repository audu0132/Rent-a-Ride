import http from 'http';

const data = JSON.stringify({
  pickUpDistrict: "Kochi",
  pickUpLocation: "kalamassery : skoda service",
  pickupDate: "2026-03-31T07:13:45.000Z",
  dropOffDate: "2026-04-02T07:13:45.000Z"
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/user/showSingleofSameModel',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk.toString()}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
