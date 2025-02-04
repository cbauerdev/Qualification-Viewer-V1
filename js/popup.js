document.addEventListener('DOMContentLoaded', function () {
  const refreshButton = document.getElementById('refreshBtn');
  const closeButton = document.getElementById('closeBtn');
  const closeBtnError = document.getElementById('closeBtnError');
  const outputElement = document.getElementById('output');
  const infoMessage = document.getElementById('infoMessage');
  const spinnerOverlay = document.getElementById('spinnerOverlay'); 

  function executeScript() {

    spinnerOverlay.style.display = 'flex';

    setTimeout(() => {
      spinnerOverlay.style.display = 'none';
    }, 500);  

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];

      if (currentTab.url === "https://joinstellar.ai/home/") {

        document.getElementById("mainContent").style.display = "block";
        document.getElementById("errorTemplate").style.display = "none";

        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: runScript
        });
      } else {
        document.getElementById("mainContent").style.display = "none";
        document.getElementById("errorTemplate").style.display = "block";
      }
    });
  }

  function runScript() {
    try {
      const jsonData = JSON.parse(document.querySelector("#props").textContent);
      const output = [];

      const userName = `${jsonData.userProfile.firstname} ${jsonData.userProfile.lastname}`;
      output.push(`Info for ${userName}`);

      output.push("\nPassed Qualifications:");
      if (jsonData.existingQualifications.length > 0) {
        jsonData.existingQualifications.forEach(q => {
          let title = q.title.trim();
          title = title.replace(/"/g, '').trim(); 
          output.push(`- ${title}`);
        });
      } else {
        output.push("- None");
      }

      output.push("\nAvailable Qualifications:");
      if (jsonData.availableQualifications.length > 0) {
        jsonData.availableQualifications.forEach(q => {
          let title = q.title.trim();
          title = title.replace(/"/g, '').trim(); 
          output.push(`- ${title}`);
        });
      } else {
        output.push("- None");
      }

      output.push("\nPending Qualifications:");
      if (jsonData.pendingQualifications.length > 0) {
        jsonData.pendingQualifications.forEach(q => {
          let title = q.title.trim();
          title = title.replace(/"/g, '').trim(); 
          output.push(`- ${title}`);
        });
      } else {
        output.push("- None");
      }

      output.push("\nProjects:");
      if (jsonData.projects.projects.length > 0) {
        jsonData.projects.projects.forEach(p => {
          output.push(`- ${p.title}`);
        });
      } else {
        output.push("- None");
      }

      chrome.runtime.sendMessage({ message: output.join("\n") });
    } catch (error) {
      chrome.runtime.sendMessage({ message: "Error: Unable to fetch data." });
    }
  }

  refreshButton.addEventListener('click', executeScript);

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message) {
      infoMessage.textContent = 'Data was successfully fetched!';
      outputElement.innerHTML = request.message.replace(/\n/g, '<br>');
    }
  });

  executeScript();

  closeButton.addEventListener('click', function () {
    window.close();
  });
  closeBtnError.addEventListener('click', function () {
    window.close();
  });
});