document.addEventListener('DOMContentLoaded', function() {
    updateUIBasedOnKeyPresence();

    document.getElementById('uploadKey').addEventListener('change', function() {
        const reader = new FileReader();
        reader.onload = function() {
            document.cookie = "key=" + btoa(reader.result);
            displayMessage("Key file uploaded and stored successfully.", "bg-green-500 px-4 py-2 rounded");
            updateUIBasedOnKeyPresence();
        };
        reader.onerror = function () {
            displayMessage("Failed to read key file.", "bg-red-500 px-4 py-2 rounded");
        };
        reader.readAsText(this.files[0]);
    });

    document.getElementById('clearKeyButton').addEventListener('click', function() {
        clearCookie();
        updateUIBasedOnKeyPresence();
    });
});

function updateUIBasedOnKeyPresence() {
    const key = getCookie('key');
    const clearButton = document.getElementById('clearKeyButton');
    const keySensitiveUI = document.getElementById('keySensitiveUI');
    if (key) {
        clearButton.classList.remove('hidden');
        keySensitiveUI.classList.remove('hidden');
    } else {
        clearButton.classList.add('hidden');
        keySensitiveUI.classList.add('hidden');
    }
}

function clearCookie() {
    document.cookie = "key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    displayMessage("Key cleared from storage.", "bg-yellow-500 px-4 py-2 rounded");
    updateUIBasedOnKeyPresence();
}

function displayMessage(message, classes) {
    const messageElement = document.getElementById('message');
    if (!messageElement) return; // Guard clause if no message element is found
    messageElement.textContent = message;
    messageElement.className = classes; // Apply classes and show message
    messageElement.classList.remove('hidden');
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

function getCookie(name) {
    let cookieValue = `; ${document.cookie}`;
    let parts = cookieValue.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

function generateKey() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = window.btoa(String.fromCharCode(...salt));
    const blob = new Blob([key], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'key.key';
    a.click();
    window.URL.revokeObjectURL(url);
}
