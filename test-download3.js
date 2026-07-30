import axios from "axios";
import { exec } from "child_process";

async function testVideo(videoUrl, label) {
  const rapidApiKey = process.env.RAPIDAPI_KEY || "";
  console.log(`\n=== Testing ${label}: ${videoUrl} ===`);

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

    console.log("2. Fetching with curl...");
    return new Promise((resolve) => {
      const curlCmd = `curl -i -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${downloadUrl}"`;
      exec(curlCmd, (error, stdout, stderr) => {
        if (error) {
          console.error("Curl Error:", error);
          resolve();
          return;
        }
        console.log("--- CURL OUTPUT (first 500 chars) ---");
        console.log(stdout.substring(0, 500));
        console.log("--- END CURL OUTPUT ---");
        resolve();
      });
    });

  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

async function run() {
  await testVideo("https://www.youtube.com/watch?v=jNQXAC9IVRw", "Me at the zoo (Short)");
  await testVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Never Gonna Give You Up");
}

run();
