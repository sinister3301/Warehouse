Warehouse Automation Dashboard


Hello! My name is Faizul, and this is a prototype dashboard for a warehouse automation system,

This application simulates a real-time dashboard that a warehouse manager would use to monitor logistics operations. It showcases how a modern web interface can be used to display live data, track events, and even provide AI-powered analysis.

Features
This dashboard comes with several key features to demonstrate a proof-of-concept:
Live Video Feed: Simulates a CCTV camera feed from a loading dock to provide visual monitoring.

Real-Time Data Simulation
Vehicle Detection: Periodically simulates a new vehicle arriving, complete with a randomly generated license plate and a confidence score.
Goods Counting: Updates a live counter for goods being processed.
Vehicle Snapshot: Shows a random image to represent the detected vehicle.
Hourly Analytics: Two dynamic line graphs, built with Chart.js, that track the number of vehicles detected and goods transported over time.
Live Event Log: A scrollable log that shows a timestamped record of every major event (like a vehicle arrival or goods being loaded).

 AI-Powered Insight
Generate Briefing: Analyzes the chart data and asks the Gemini AI to generate a concise summary for a shift manager.
Find Problems: Sends the event log to the Gemini AI to check for any anomalies or potential issues that need attention.

Technologies Used
This project was built using standard frontend web technologies, which makes it fast, responsive, and easy to run.
Core: HTML5, CSS3, modern JavaScript (ES6)
Styling: Tailwind CSS - A utility-first CSS framework for rapid UI development.
Charting Library: Chart.js - A popular library for creating beautiful and responsive graphs.
AI Integration: Google Gemini API - Used for the "AI-Powered Insights" feature to generate intelligent text summaries.

How to Run
Since this is a self-contained prototype, running it is very simple.
No Installation Needed: There are no complex installations or setups required.
Open the File: Just open the index.html file (the main project file) directly in any modern web browser like Google Chrome, Firefox, or Microsoft Edge.
Internet Connection: An active internet connection is required, as the project uses external libraries (Tailwind CSS, Chart.js) and makes API calls to Google Gemini, which are loaded from the web.

Thank you for checking out my project!
