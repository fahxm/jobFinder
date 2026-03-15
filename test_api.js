
const RAPID_API_KEY = '997b52feb0mshdbcd0f2b8112940p1cc865jsnd7b462c5ba22';
const fullQuery = 'Software Engineer in India';
const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(fullQuery)}&num_pages=2`;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
};

fetch(url, options)
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(json => {
        console.log('Response JSON:', JSON.stringify(json, null, 2));
    })
    .catch(err => {
        console.error('Error:', err);
    });
