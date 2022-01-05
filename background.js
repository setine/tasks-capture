const API_KEY = 'AIzaSyC84UR2ALrHmb580Zj-sc1i7pnzGsNKBug';

chrome.runtime.onInstalled.addListener((request, sender, sendResponse) => {
    console.log('Hi there');
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
});

