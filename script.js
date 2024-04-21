document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadKey').addEventListener('change', handleFileUpload);
    const clearKeyButton = document.getElementById('clearKeyButton');
    if (clearKeyButton) {
        clearKeyButton.addEventListener('click', clearKey);
    }

    updateUIBasedOnKeyPresence();
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const key = e.target.result;
        sessionStorage.setItem('key', btoa(key)); // Encode and store key in sessionStorage
        displayMessage("Key file uploaded and stored successfully.", "bg-green-500 px-4 py-2 rounded");
        updateUIBasedOnKeyPresence();
    };
    reader.onerror = function () {
        displayMessage("Failed to read key file.", "bg-red-500 px-4 py-2 rounded");
    };
    reader.readAsText(file);
}

function clearKey() {
    sessionStorage.removeItem('key');
    displayMessage("Key cleared from storage.", "bg-yellow-500 px-4 py-2 rounded");
    updateUIBasedOnKeyPresence();
}

function updateUIBasedOnKeyPresence() {
    const key = sessionStorage.getItem('key');
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

function displayMessage(message, classes) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = classes;
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

async function encryptAndCopy() {
    const password = document.getElementById('password').value;
    const data = document.getElementById('textArea').value;
    if (!password || !data) {
        displayMessage("Password and data are required for encryption.", "bg-red-500 px-4 py-2 rounded");
        return;
    }

    try {
        const keyMaterial = await getKeyMaterial(password);
        const key = await window.crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: new Uint8Array(sessionStorage.getItem('key').split(',')), iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(data);
        const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
        const encryptedData = [...iv, ...new Uint8Array(encrypted)];
        const base64Encrypted = btoa(String.fromCharCode(...encryptedData));

        document.getElementById('textArea').value = base64Encrypted;
        await navigator.clipboard.writeText(base64Encrypted);
        displayMessage("Text encrypted and copied to clipboard!", "bg-green-500 px-4 py-2 rounded");
    } catch (error) {
        displayMessage("Encryption failed: " + error.message, "bg-red-500 px-4 py-2 rounded");
    }
}

async function decryptText() {
    const password = document.getElementById('password').value;
    const base64Encrypted = document.getElementById('textArea').value;
    if (!password || !base64Encrypted) {
        displayMessage("Password and encrypted data are required for decryption.", "bg-red-500 px-4 py-2 rounded");
        return;
    }

    try {
        const keyMaterial = await getKeyMaterial(password);
        const key = await window.crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: new Uint8Array(sessionStorage.getItem('key').split(',')), iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        const encryptedBytes = Uint8Array.from(atob(base64Encrypted), c => c.charCodeAt(0));
        const iv = encryptedBytes.slice(0, 12);
        const encrypted = encryptedBytes.slice(12);

        const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
        const dec = new TextDecoder().decode(decrypted);
        document.getElementById('textArea').value = dec;
        displayMessage("Text decrypted successfully!", "bg-green-500 px-4 py-2 rounded");
    } catch (error) {
        displayMessage("Decryption failed: " + error.message, "bg-red-500 px-4 py-2 rounded");
    }
}

function getKeyMaterial(password) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

function generateKey() {
    const password = document.getElementById('keyPassword').value;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    console.log("Generating key with password and salt.");
    const key = window.btoa(String.fromCharCode(...salt));
    displayMessage("Key file generated and ready for download.", "bg-green-500 px-4 py-2 rounded");
    const blob = new Blob([key], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloak.key';
    a.click();
    window.URL.revokeObjectURL(url);
}

function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}