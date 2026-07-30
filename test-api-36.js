import axios from "axios";

async function test36() {
  const videoId = "phd1U2JIfUA"; // "Mr Robot - Where is my mind ?"
  const rapidApiKey = process.env.RAPIDAPI_KEY || "";

  try {
    console.log("Calling youtube-mp36...");
    const response = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
      params: { id: videoId },
      headers: {
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      }
    });
    console.log("STATUS:", response.status);
    console.log("DATA:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("ERROR:", error.message);
    if (error.response) {
      console.error("RESPONSE DATA:", error.response.data);
    }
  }
}

test36();
