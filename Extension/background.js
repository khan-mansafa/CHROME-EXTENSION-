let activeTab = null;
let startTime = Date.now();

const productiveKeywords = ["github", "stackoverflow", "leetcode", "chatgpt", "geeksforgeeks", "openai"];

async function shouldTrack() {
  return new Promise((resolve) => {
    chrome.storage.local.get("tracking", (res) => resolve(res.tracking ?? true));
  });
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (!(await shouldTrack())) return;
  if (activeTab) logTime(activeTab);
  const tab = await chrome.tabs.get(activeInfo.tabId);
  activeTab = tab;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!(await shouldTrack())) return;
  if (tab.active && changeInfo.status === "complete") {
    if (activeTab) logTime(activeTab);
    activeTab = tab;
    startTime = Date.now();
  }
});

function logTime(tab) {
  try {
    if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) return;

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const url = new URL(tab.url);
    const website = url.hostname.replace("www.", "");

    let category = "unproductive";
    for (const keyword of productiveKeywords) {
      if (website.toLowerCase().includes(keyword.toLowerCase())) {
        category = "productive";
        break;
      }
    }

    fetch("http://127.0.0.1:5000/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        website,
        category,
        duration,
        date: new Date().toISOString().slice(0, 10)
      })
    }).catch(console.error);
  } catch (err) {
    console.error("Error logging time:", err);
  }
}

// Listen for Stop/Start messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "stopTracking") {
    if (activeTab) logTime(activeTab);
    activeTab = null;
  }
});
