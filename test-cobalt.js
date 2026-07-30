import axios from "axios";

async function testCobalt() {
  const videoUrl = "https://www.youtube.com/watch?v=phd1U2JIfUA";

  // We can try different cobalt public api endpoints:
  const endpoints = [
    "https://api.cobalt.tools",
    "https://cobalt.tools/api/json",
    "https://co.wukko.me"
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n--- Testing Cobalt endpoint: ${endpoint} ---`);
      const response = await axios.post(endpoint, {
        url: videoUrl,
        isAudioOnly: true,
        aFormat: "mp3",
        audioBitrate: "320"
      }, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        timeout: 10000
      });

      console.log("Status:", response.status);
      console.log("Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(`Error with ${endpoint}:`, error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  }
}

testCobalt();
