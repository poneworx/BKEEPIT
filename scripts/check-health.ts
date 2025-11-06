import http from 'http';
http.get('http://localhost:3000/health', res => {
  console.log('Health status:', res.statusCode);
}).on('error', e => console.error('Health error', e.message));