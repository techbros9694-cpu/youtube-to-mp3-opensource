import axios from "axios";

async function testYtDownload() {
  const videoId = "phd1U2JIfUA";
  const url = `https://yt-download.org/api/button/mp3/${videoId}`;

  try {
    console.log("Calling yt-download.org widget...");
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });
    console.log("Status:", response.status);
    console.log("Data snippet (first 1000 chars):", response.data.substring(0, 1000));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testYtDownload();
