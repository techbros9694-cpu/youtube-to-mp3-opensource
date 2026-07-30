import axios from "axios";

async function testPublicAPIs() {
  const videoId = "phd1U2JIfUA"; // Mr Robot
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const apis = [
    {
      name: "Vevioz API button",
      url: `https://api.vevioz.com/api/button/mp3/${videoId}`,
      method: "GET",
    },
    {
      name: "Savetube.me API",
      url: `https://api.savetube.me/download/audio/${videoId}`,
      method: "GET",
    },
    {
      name: "Loader.to Card API",
      url: `https://loader.to/api/card/?url=${encodeURIComponent(videoUrl)}`,
      method: "GET",
    },
    {
      name: "Y2mate API (v2)",
      url: `https://api.y2mate.is/v1/analyze?url=${encodeURIComponent(videoUrl)}`,
      method: "GET",
    },
    {
      name: "Tuberip",
      url: `https://tuberip.com/api/v1/download/mp3/${videoId}`,
      method: "GET",
    },
  ];

  for (const api of apis) {
    try {
      console.log(`\n--- Testing ${api.name} ---`);
      console.log(`Request URL: ${api.url}`);
      
      const response = await axios({
        method: api.method,
        url: api.url,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/html, */*"
        },
        timeout: 10000,
      });

      console.log("Status:", response.status);
      console.log("Data snippet:", JSON.stringify(response.data, null, 2).substring(0, 500));
    } catch (err) {
      console.log(`Error with ${api.name}:`, err.message);
      if (err.response) {
        console.log("Response data snippet:", JSON.stringify(err.response.data, null, 2).substring(0, 300));
      }
    }
  }
}

testPublicAPIs();
