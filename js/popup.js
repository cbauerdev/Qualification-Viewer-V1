function runScript(isChecked) {
  try {
    // Get props element and log for debugging
    const propsElement = document.querySelector("#props");
    console.log("Props element:", propsElement);
    
    if (!propsElement) {
      throw new Error("Props element not found");
    }

    // Parse JSON and log for debugging
    const jsonData = JSON.parse(propsElement.textContent);
    console.log("Parsed JSON:", jsonData);
    
    // Verify userProfile exists
    if (!jsonData.userProfile) {
      throw new Error("User profile data not found");
    }

    const output = [];
    const userName = `${jsonData.userProfile.firstname} ${jsonData.userProfile.lastname}`;
    output.push(`Info for ${userName}`);

    // Add country info when checked
    if (isChecked && jsonData.userProfile.country) {
      output.push(`\nCountry: ${jsonData.userProfile.country}`);
      console.log("Country data:", jsonData.userProfile.country);
    }

    // ...existing code...

    chrome.runtime.sendMessage({ message: output.join("\n") });
  } catch (error) {
    console.error("Error in runScript:", error);
    chrome.runtime.sendMessage({ 
      message: `Error: Unable to fetch data. Details: ${error.message}` 
    });
  }
}