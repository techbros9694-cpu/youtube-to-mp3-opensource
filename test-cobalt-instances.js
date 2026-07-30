import axios from "axios";

async function testInstances() {
  try {
    console.log("Calling instances.cobalt.tools...");
    const response = await axios.get("https://instances.cobalt.tools");
    console.log("Status:", response.status);
    console.log("Type of data:", typeof response.data);
    if (Array.isArray(response.data)) {
      console.log(`Found ${response.data.length} instances.`);
      console.log("First instance:", JSON.stringify(response.data[0], null, 2));
    } else {
      console.log("Data snippet:", JSON.stringify(response.data, null, 2).substring(0, 500));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testInstances();
