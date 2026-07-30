import axios from "axios";

async function testLoaderToJSON() {
  const videoUrl = "https://www.youtube.com/watch?v=phd1U2JIfUA";

  const urls = [
    `https://api.loader.to/api/py/convert?url=${encodeURIComponent(videoUrl)}&f=mp3`,
    `https://api.colb.co/api/py/convert?url=${encodeURIComponent(videoUrl)}&f=mp3`,
    `https://loader.to/api/py/convert?url=${encodeURIComponent(videoUrl)}&f=mp3`,
  ];

  for (const url of urls) {
    try {
      console.log(`\nTesting: ${url}`);
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        timeout: 10000
      });
      console.log("Status:", res.status);
      console.log("Data snippet:", JSON.stringify(res.data, null, 2).substring(0, 500));
    } catch (err) {
      console.log("Error:", err.message);
      if (err.response) {
        console.log("Response data:", err.response.data);
      }
    }
  }
}

testLoaderToJSON();
