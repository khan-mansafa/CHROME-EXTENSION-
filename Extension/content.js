let intervalId = null;

function startTracking() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    chrome.storage.local.get("tracking", (res) => {
      if (!res.tracking) return;

      fetch("http://127.0.0.1:5000/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          website: window.location.hostname,
          category: "unproductive",
          duration: 60,
          date: new Date().toISOString().split("T")[0]
        })
      })
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);
    });
  }, 60000);
}

startTracking();
