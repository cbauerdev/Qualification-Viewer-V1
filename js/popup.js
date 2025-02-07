document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const elements = {
    refreshButton: document.getElementById('refreshBtn'),
    closeButton: document.getElementById('closeBtn'),
    closeBtnError: document.getElementById('closeBtnError'),
    outputElement: document.getElementById('output'),
    infoMessage: document.getElementById('infoMessage'),
    spinnerOverlay: document.getElementById('spinnerOverlay'),
    toggleView: document.getElementById('toggleView'),
    showAllText: document.getElementById('showAll'),
    switchContainer: document.getElementById('switchContainer'),
    mainContent: document.getElementById('mainContent'),
    errorTemplate: document.getElementById('errorTemplate')
  };

  // Initialize UI
  elements.showAllText.classList.add('text-inactive');

  // Message Handler
  function handleMessage(message) {
    elements.infoMessage.textContent = 'Data was successfully fetched!';
    elements.outputElement.innerHTML = message.replace(/\n/g, '<br>');
    elements.switchContainer.style.display = 'block';
  }

  // Data Processing
  function runScript(isChecked = false) {
    try {
      const jsonData = JSON.parse(document.querySelector("#props").textContent);
      const output = [];

      // Basic Info
      const userName = `${jsonData.userProfile.firstname} ${jsonData.userProfile.lastname}`;
      output.push(`Info for ${userName}`);

      // Extended Info when checked
      if (isChecked) {
        output.push(`Country: ${jsonData.userProfile.country}`);
      }

      // Qualifications
      output.push("\nPassed Qualifications:");
      if (jsonData.existingQualifications.length > 0) {
        jsonData.existingQualifications.forEach(q => {
          output.push(`- ${q.title.trim().replace(/"/g, '')}`);
        });
      } else {
        output.push("- None");
      }

      output.push("\nAvailable Qualifications:");
      if (jsonData.availableQualifications.length > 0) {
        jsonData.availableQualifications.forEach(q => {
          output.push(`- ${q.title.trim().replace(/"/g, '')}`);
        });
      } else {
        output.push("- None");
      }

      output.push("\nPending Qualifications:");
      if (jsonData.pendingQualifications.length > 0) {
        jsonData.pendingQualifications.forEach(q => {
          output.push(`- ${q.title.trim().replace(/"/g, '')}`);
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

  // Script Execution
  function executeScript(isChecked = false) {
    elements.spinnerOverlay.style.display = 'flex';
    
    setTimeout(() => {
      elements.spinnerOverlay.style.display = 'none';
    }, 500);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      if (currentTab.url === "https://joinstellar.ai/home/") {
        elements.mainContent.style.display = "block";
        elements.errorTemplate.style.display = "none";
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: runScript,
          args: [isChecked]
        });
      } else {
        elements.mainContent.style.display = "none";
        elements.errorTemplate.style.display = "block";
      }
    });
  }

  // Event Listeners
  elements.toggleView.addEventListener('change', function() {
    const isChecked = this.checked;
    elements.showAllText.classList.toggle('text-active', isChecked);
    elements.showAllText.classList.toggle('text-inactive', !isChecked);
    executeScript(isChecked);
  });

  elements.refreshButton.addEventListener('click', () => executeScript(elements.toggleView.checked));
  elements.closeButton.addEventListener('click', () => window.close());
  elements.closeBtnError.addEventListener('click', () => window.close());

  chrome.runtime.onMessage.addListener((request) => {
    if (request.message) {
      handleMessage(request.message);
    }
  });

  // Initial Load
  executeScript(false);
});