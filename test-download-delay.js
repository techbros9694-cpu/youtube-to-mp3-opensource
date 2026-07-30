import axios from "axios";

async function testWithDelay() {
  const videoUrl = "https://www.youtube.com/watch?v=phd1U2JIfUA";
  const rapidApiKey = process.env.RAPIDAPI_KEY || "";

  try {
    console.log("1. Triggering convert...");
    const convertRes = await axios.get("https://youtube-mp310.p.rapidapi.com/download/mp3", {
      params: { url: videoUrl },
      headers: {
        "x-rapidapi-host": "youtube-mp310.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      }
    });
    
    console.log("Convert Response:", convertRes.data);
    const downloadUrl = convertRes.data.downloadUrl;

    if (!downloadUrl) {
      console.log("No downloadUrl returned.");
      return;
    }

    // Let's poll the downloadUrl over several seconds to see if it starts working!
    for (let i = 1; i <= 5; i++) {
      const delayMs = i * 4000;
      console.log(`\nWaiting ${delayMs / 1000} seconds before checking...`);
      await new Promise(resolve => setTimeout(resolve, 4000));

      try {
        console.log(`Checking download (Attempt ${i})...`);
        const dlRes = await axios.get(downloadUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://rapidapi.com/"
          }
        });
        console.log(`Attempt ${i} Status:`, dlRes.status);
        console.log(`Attempt ${i} Content-Type:`, dlRes.headers["content-type"]);
        console.log(`Attempt ${i} Data snippet:`, String(dlRes.data).substring(0, 200));
        break; // If successful (no throw), we break
      } catch (err) {
        console.log(`Attempt ${i} failed:`, err.message, err.response?.data);
      }
    }

  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

testWithDelay();
