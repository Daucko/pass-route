const fetch = require('node-fetch');

async function test() {
    try {
        const url = 'http://localhost:3000/api/questions?subject=English&limit=10';
        console.log('Fetching:', url);
        const res = await fetch(url);
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text.substring(0, 500));
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
