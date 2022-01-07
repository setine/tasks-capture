let createTaskButton = document.getElementById("createTask");
let titleInput = document.getElementById("title");
let descriptionInput = document.getElementById("description");

createTaskButton.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
      'message': 'capture',
      'title': titleInput.value,
      'description': descriptionInput.value,
  });
  window.close();
});

window.addEventListener('DOMContentLoaded', async (event) => {
  const tab = await getCurrentTab();
  const selection = await getCurrentSelection(tab.id);
  titleInput.value = tab.title;
  descriptionInput.value = [selection, tab.url]
        .filter(Boolean).join("\n\n");
});

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getCurrentSelection(tabId) {
    const [selection] = await chrome.scripting.executeScript({
        'func': () => window.getSelection().toString(),
        'target': {'tabId': tabId}
    });
    return selection.result;
}
