const createTaskButton = document.getElementById('createTask');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');

createTaskButton.addEventListener('click', async () => {
    if (!titleInput.value) return;
    chrome.runtime.sendMessage({
        'message': 'capture',
        'title': titleInput.value,
        'description': descriptionInput.value,
        'date': dateInput.value
    });
    window.close();
});

window.addEventListener('DOMContentLoaded', async (event) => {
    const tab = await getCurrentTab();
    const selection = await getCurrentSelection(tab.id);
    titleInput.value = tab.title;
    descriptionInput.value = [selection, tab.url].filter(Boolean).join('\n\n');
    titleInput.select();
});

async function getCurrentTab() {
    const queryOptions = {active: true, currentWindow: true};
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function getCurrentSelection(tabId) {
    const [selection] = await chrome.scripting.executeScript({
        'func': () => window.getSelection().toString(),
        'target': {'tabId': tabId},
    });
    return selection.result;
}
