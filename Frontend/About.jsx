import React from 'react';

function About() {
  return (
    <div className="p-6 flex-1">
      <h1 className="text-3xl font-bold mb-4">About ProdTracker</h1>
      <p className="mb-2">
        ProdTracker is a web-based productivity analytics tool. It tracks the time you spend on different websites
        and classifies them as productive or unproductive. You can see weekly reports and improve your efficiency.
      </p>
      <p>
        The tool includes a Chrome extension that monitors website usage and a React dashboard for visual analytics.
      </p>
    </div>
  );
}

export default About;
