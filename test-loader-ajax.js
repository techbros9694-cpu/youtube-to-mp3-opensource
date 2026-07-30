import axios from "axios";

async function testLoaderToAjax() {
  const videoUrl = "https://www.youtube.com/watch?v=phd1U2JIfUA";

  try {
    console.log("Calling loader.to ajax download...");
    const response = await axios.get("https://loader.to/ajax/download.php", {
      params: {
        button: 1,
        start: 1,
        end: 20,
        format: "mp3",
        url: videoUrl
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Origin": "https://loader.to",
        "Referer": "https://loader.to/"
      },
      timeout: 10000,
    });

    console.log("Status:", response.status);
    console.log("Response JSON:", JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.id) {
      const id = response.data.id;
      console.log("\nStarting progress polling for ID:", id);

      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`Polling progress (Attempt ${i})...`);
        const progRes = await axios.get("https://loader.to/ajax/progress.php", {
          params: { id },
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://loader.to/"
          }
        });

        console.log("Progress status:", progRes.data.text);
        console.log("Progress data:", JSON.stringify(progRes.data, null, 2));

        if (progRes.data.success === 1 || progRes.data.success === true) {
          console.log("SUCCESS! Download URL:", progRes.data.download_url);
          break;
        }
        if (progRes.data.success === 0 && progRes.data.text?.includes("Error")) {
          console.log("FAILED with error message:", progRes.data.text);
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

testLoaderToAjax();
