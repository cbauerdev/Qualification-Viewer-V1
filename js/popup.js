document.addEventListener('DOMContentLoaded', function () {

  const LOADING_TIMEOUT = 500;

  const elements = {
    refreshButton: document.getElementById('refreshBtn'),
    closeButton: document.getElementById('closeBtn'),
    closeBtnError: document.getElementById('closeBtnError'),
    outputElement: document.getElementById('output'),
    spinnerOverlay: document.getElementById('spinnerOverlay'),
    toggleView: document.getElementById('toggleView'),
    showAllText: document.getElementById('showAll'),
    switchContainer: document.getElementById('switchContainer'),
    mainContent: document.getElementById('mainContent'),
    errorTemplate: document.getElementById('errorTemplate'),
    msg: document.getElementById('msg')
  };

  function showMessage(text, type = 'info') {
    const msgElement = elements.msg;
    msgElement.textContent = text;
    msgElement.className = '';

    switch (type) {
      case 'error':
        msgElement.classList.add('text-error');
        break;
      case 'success':
        msgElement.classList.add('text-success');
        break;
      default:
        msgElement.classList.add('text-info');
    }
  }

  function toggleLoading(show) {
    elements.spinnerOverlay.style.display = show ? 'flex' : 'none';
  }

  function handleMessage(message) {
    elements.outputElement.innerHTML = message.replace(/\n/g, '<br>');
    elements.switchContainer.style.display = 'block';
  }

  function runScript(isChecked = false) {
    try {
      const jsonData = JSON.parse(document.querySelector("#props").textContent);
      const output = [];

      if (!isChecked) {
        const userName = `${jsonData.userProfile.firstname} ${jsonData.userProfile.lastname}`;
        output.push(`Info for ${userName}`);

        output.push("\nExisting Qualifications:");
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
      } else {
        output.push("\n<b>USERPROFILE</b>\n");
        output.push(`First Name: ${jsonData.userProfile.firstname}`);
        output.push(`Last Name: ${jsonData.userProfile.lastname}`);
        output.push(`Country: ${jsonData.userProfile.country}`);
        output.push(`Education: ${jsonData.userProfile.education}`);
        output.push(`English Level: ${jsonData.userProfile.english}`);
        output.push(`Work Hours: ${jsonData.userProfile.work_hours}`);
        output.push(`Biography: ${jsonData.userProfile.bio}`);
        output.push(`Source: ${jsonData.userProfile.source}`);
        output.push(`Has Messages: ${jsonData.layoutProps.user_has_messages ? "Yes" : "No"}\n`);

        // ...existing code...

        if (isChecked) {
          // Handle existing qualifications first
          output.push("\nEXISTING QUALIFICATIONS:\n");
          if (jsonData.existingQualifications && jsonData.existingQualifications.length > 0) {
            jsonData.existingQualifications.forEach(q => {
              output.push(`Title: ${q.title.trim().replace(/"/g, '')}`);
              output.push(`Status: ${q.status}`);
              output.push(`Description: ${q.description || 'None'}`);
              output.push(`Hourly Rate: ${q.hourly_rate}`);
              output.push(`Bonus Rate: ${q.bonus_rate}\n`);
            });
          } else {
            output.push("None\n");
          }

          // Handle other qualifications only if they exist
          const otherQualifications = [
            { type: "AVAILABLE QUALIFICATIONS", key: "availableQualifications" },
            { type: "PENDING QUALIFICATIONS", key: "pendingQualifications" }
          ];

          otherQualifications.forEach(({ type, key }) => {
            output.push(`\n${type}:\n`);
            if (jsonData[key] && jsonData[key].length > 0) {
              jsonData[key].forEach(q => {
                output.push(`Title: ${q.title.trim().replace(/"/g, '')}`);
                output.push(`Status: ${q.status}`);
                output.push(`Description: ${q.description || 'None'}`);
                output.push(`Hourly Rate: ${q.hourly_rate}`);
                output.push(`Bonus Rate: ${q.bonus_rate}\n`);
              });
            } else {
              output.push("None\n");
            }
          });
        }

        output.push("\nPROJECTS\n");
        if (jsonData.projects.projects.length > 0) {
          jsonData.projects.projects.forEach(p => {
            output.push(`Title: ${p.title}`);
            output.push(`Description: ${p.description}`);
            output.push(`Hourly Rate: ${p.hourly_rate}`);
            output.push(`Multiplier: ${p.multiplier}`);
            output.push(`Final Rate: ${p.final_rate}`);
            output.push(`URL: ${p.url}`);
            output.push(`Tasks Available: ${p.num_tasks_available}`);
            if (p.special_message.title || p.special_message.text) {
              output.push(`Special Message:`);
              output.push(`Title: ${p.special_message.title}`);
              output.push(`Text: ${p.special_message.text}\n`);
            }
          });
        } else {
          output.push("None");
        }

        output.push("\nACCOUNT SETTINGS\n");
        output.push(`Balance: ${jsonData.balance}`);
        output.push(`Profile URL: ${jsonData.userProfileUrl}`);
        output.push(`Show Payments: ${jsonData.showPayments ? "Yes" : "No"}`);
        output.push(`Requires Verification: ${jsonData.requireVerification ? "Yes" : "No"}`);
        output.push(`First Withdrawal Required: ${jsonData.requireFirstWithdrawal ? "Yes" : "No"}`);
      }

      chrome.runtime.sendMessage({
        message: output.join("\n")
      });
    } catch (error) {
      showMessage('Unable to fetch data.', 'error');
      chrome.runtime.sendMessage({
        message: ''
      });
    }
  }

  function executeScript(isChecked = false) {
    toggleLoading(true);
    showMessage('Loading...', 'info');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      if (currentTab.url === "https://joinstellar.ai/home/") {
        elements.mainContent.style.display = "block";
        elements.errorTemplate.style.display = "none";
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: runScript,
          args: [isChecked]
        }, () => {
          setTimeout(() => {
            toggleLoading(false);
            showMessage('Data was successfully fetched!', 'success');
          }, LOADING_TIMEOUT);
        });
      } else {
        elements.mainContent.style.display = "none";
        elements.errorTemplate.style.display = "block";
        setTimeout(() => {
          toggleLoading(false);
        }, LOADING_TIMEOUT);
      }
    });
  }

  function handleToggleChange() {
    const isChecked = this.checked;
    elements.showAllText.classList.toggle('text-active', isChecked);
    elements.showAllText.classList.toggle('text-inactive', !isChecked);
    executeScript(isChecked);
  }

  elements.toggleView.addEventListener('change', handleToggleChange);
  elements.refreshButton.addEventListener('click', () => executeScript(elements.toggleView.checked));
  elements.closeButton.addEventListener('click', () => window.close());
  elements.closeBtnError.addEventListener('click', () => window.close());

  chrome.runtime.onMessage.addListener((request) => {
    if (request.message) {
      handleMessage(request.message);
    }
  });

  elements.showAllText.classList.add('text-inactive');
  executeScript(false);
});