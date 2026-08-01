import fetch from 'node-fetch'; // wait, node >= 18 has fetch natively.
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;

async function run() {
  console.log('Fetching models...');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
  const data = await res.json();
  if (!data.models) {
    console.error('Failed to fetch models:', data);
    return;
  }
  
  const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
  console.log(`Found ${generateModels.length} models supporting generateContent:`);
  generateModels.forEach(m => console.log(' - ' + m.name));

  // Try one by one
  for (const m of generateModels) {
    console.log(`\nTesting ${m.name}...`);
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/${m.name}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
      });
      const result = await resp.json();
      if (resp.ok) {
        console.log(`✅ SUCCESS with ${m.name}! Response:`, result.candidates[0].content.parts[0].text);
        break; // Stop on first success
      } else {
        console.log(`❌ FAILED with ${m.name}:`, result.error.message);
      }
    } catch (err) {
      console.log(`❌ ERROR with ${m.name}:`, err.message);
    }
  }
}

run();
