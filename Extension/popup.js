document.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("status");
    const toggleBtn = document.getElementById("toggleTracking");

    // Initialize
    chrome.storage.local.get(["tracking"], (res) => {
        const isTracking = res.tracking ?? true;
        chrome.storage.local.set({ tracking: isTracking });
        statusEl.textContent = isTracking ? "Running" : "Paused";
        toggleBtn.textContent = isTracking ? "Stop Tracking" : "Start Tracking";
    });

    toggleBtn.addEventListener("click", () => {
        chrome.storage.local.get(["tracking"], (res) => {
            const newState = !res.tracking;
            chrome.storage.local.set({ tracking: newState });
            statusEl.textContent = newState ? "Running" : "Paused";
            toggleBtn.textContent = newState ? "Stop Tracking" : "Start Tracking";

            // Notify background for last tab log
            chrome.runtime.sendMessage({ action: newState ? "startTracking" : "stopTracking" });

            // Notify all tabs for content.js interval
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: newState ? "startTracking" : "stopTracking" });
                });
            });
        });
    });
});
