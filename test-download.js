import axios from "axios";

async function testDownload() {
  const url = "https://robotilab.online/download-api/yt/audio?url=https://www.youtube.com/watch?v=phd1U2JIfUA";
  
  try {
    console.log("1. Simple request without headers...");
    const res1 = await axios.get(url);
    console.log("Res1 status:", res1.status);
    console.log("Res1 data:", res1.data);
  } catch (err) {
    console.log("Res1 error:", err.message, err.response?.data);
  }

  try {
    console.log("\n2. Request with Referer: https://rapidapi.com/ ...");
    const res2 = await axios.get(url, {
      headers: {
        "Referer": "https://rapidapi.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("Res2 status:", res2.status);
    console.log("Res2 data length:", res2.data?.length || 0);
  } catch (err) {
    console.log("Res2 error:", err.message, err.response?.data);
  }

  try {
    console.log("\n3. Calling RapidAPI convert FIRST to see if it sets a session cookie or requires matching headers...");
    const rapidApiKey = process.env.RAPIDAPI_KEY || "";
    const convertRes = await axios.get("https://youtube-mp310.p.rapidapi.com/download/mp3", {
      params: { url: "https://www.youtube.com/watch?v=phd1U2JIfUA" },
      headers: {
        "x-rapidapi-host": "youtube-mp310.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      }
    });
    console.log("Convert data:", convertRes.data);
    const downloadUrl = convertRes.data.downloadUrl;
    console.log("New downloadUrl:", downloadUrl);

    // Let's call the new downloadUrl immediately
    const dlRes = await axios.get(downloadUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("New download status:", dlRes.status);
    console.log("New download data snippet:", typeof dlRes.data === "string" ? dlRes.data.substring(0, 100) : dlRes.data);
  } catch (err) {
    console.log("Convert/Download error:", err.message, err.response?.data);
  }
}

testDownload();
