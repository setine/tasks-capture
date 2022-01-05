const API_KEY = 'AIzaSyC84UR2ALrHmb580Zj-sc1i7pnzGsNKBug';

chrome.runtime.onInstalled.addListener((request, sender, sendResponse) => {
});

async function createTask(tabTitle, tabUrl, textSelection) {
    chrome.identity.getAuthToken({interactive: true}, (authToken) => {
        let fetchUrl = `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;
        let fetchOptions = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };
        fetch(fetchUrl, fetchOptions)
            .then(res => res.json())
            .then(res => console.log(res));
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

