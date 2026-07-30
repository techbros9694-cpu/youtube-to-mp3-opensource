import axios from "axios";
import { exec } from "child_process";

async function testDownload2() {
  const videoUrl = "https://www.youtube.com/watch?v=phd1U2JIfUA";
  const rapidApiKey = process.env.RAPIDAPI_KEY || "";

  try {
    console.log("1. Triggering convert on RapidAPI...");
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

    console.log("\n2. Trying to fetch with curl to see detailed response...");
    const curlCmd = `curl -i -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${downloadUrl}"`;
    exec(curlCmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Curl Error:", error);
        return;
      }
      console.log("--- CURL OUTPUT (first 1000 chars) ---");
      console.log(stdout.substring(0, 1000));
      console.log("--- END CURL OUTPUT ---");
    });

  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

testDownload2();
