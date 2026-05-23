const key = process.env.GROQ_API_KEY || "your_groq_api_key_here";
const url = "https://api.groq.com/openai/v1/chat/completions";

fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: "Hi" }]
  })
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
