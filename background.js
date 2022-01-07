const API_KEY = 'AIzaSyC84UR2ALrHmb580Zj-sc1i7pnzGsNKBug';
const FETCH_TASK_LISTS_URL =
    `https://tasks.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`;
const CREATE_TASK_URL = (taskListId) =>
    `https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?key=${
        API_KEY}`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'capture') {
        createTask(request.title, request.description, request.date);
        sendResponse();
    }
});

async function createTask(title, description, date) {
    chrome.identity.getAuthToken({interactive: true}, (authToken) => {
        const fetchHeaders = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        };
        const defaultTaskListPromise =
            fetch(FETCH_TASK_LISTS_URL, {'headers': fetchHeaders})
                .then((res) => res.json())
                .then((res) => res.items[0]);
        defaultTaskListPromise.then((taskList) => {
            fetch(CREATE_TASK_URL(taskList.id), {
                'headers': fetchHeaders,
                'method': 'POST',
                'body': JSON.stringify({
                    'title': title,
                    'notes': description,
                    'due': date ? date + 'T00:00:00.00Z' : '',
                }),
            });
        });
    });
}
