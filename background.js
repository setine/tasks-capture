const API_KEY = 'AIzaSyC84UR2ALrHmb580Zj-sc1i7pnzGsNKBug';
const FETCH_TASK_LISTS_URL = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;

chrome.runtime.onInstalled.addListener((request, sender, sendResponse) => {
});

async function createTask(tabTitle, tabUrl, textSelection) {
    chrome.identity.getAuthToken({interactive: true}, (authToken) => {
        let fetchOptions = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };
        const defaultTaskList = fetch(FETCH_TASK_LISTS_URL, fetchOptions)
                .then(res => res.json())
                .then(res => res.items[0])
                .then(defaultTaskList => {
                    // TODO: Create a task
                    console.log(defaultTaskList.id);
                });
    });
    console.log([tabTitle, tabUrl, textSelection]);
}

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

async function capture(){
    const tab = await getCurrentTab();
    const selection = await getCurrentSelection(tab.id);
    await createTask(tab.title, tab.url, selection);
}

chrome.commands.onCommand.addListener((command) => {
    if(command === 'capture-task') {
        capture();
    }
});

