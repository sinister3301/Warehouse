// This makes sure our code only runs after the whole HTML page is loaded.
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. GETTING ALL THE ELEMENTS FROM HTML ---
    // We need to grab all the parts of the page we want to change with our code.

    const timeEl = document.getElementById('current-time');
    const vehiclePlateEl = document.getElementById('vehicle-plate');
    const goodsCounterEl = document.getElementById('goods-counter');
    const confidenceLevelEl = document.getElementById('confidence-level');
    const eventLogEl = document.getElementById('event-log');
    const snapshotImageEl = document.getElementById('snapshot-image');
    
    // Buttons and output for the Gemini AI
    const briefingBtn = document.getElementById('generate-briefing-btn');
    const anomalyBtn = document.getElementById('generate-anomaly-btn');
    const geminiOutputBox = document.getElementById('gemini-output-box');
    const geminiLoader = document.getElementById('gemini-loader');


    // --- 2. SETTING UP THE GRAPHS (CHARTS) ---
    
    const goodsChartCanvas = document.getElementById('goodsChart').getContext('2d');
    const vehiclesChartCanvas = document.getElementById('vehiclesChart').getContext('2d');

    // A function to create a new chart. We can reuse this for both graphs.
    function createMyChart(canvas, label) {
        return new Chart(canvas, {
            type: 'line', // line graph
            data: {
                labels: ['start', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'now'], // placeholder labels
                datasets: [{
                    label: label,
                    data: [0,0,0,0,0,0,0,0,0,0], // start with all zeros
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    borderColor: 'rgba(52, 211, 153, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                }]
            },
            options: {
                maintainAspectRatio: false, // very important to control the size!
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } }
            }
        });
    };
    
    const goodsChart = createMyChart(goodsChartCanvas, 'Goods');
    const vehiclesChart = createMyChart(vehiclesChartCanvas, 'Vehicles');

    
    // --- 3. SIMULATING REAL-TIME DATA ---
    // In a real project, this data would come from sensors and cameras.
    // Here, we just pretend by generating random data.

    let totalGoods = 0;
    let recentGoods = 0;
    let recentVehicles = 0;
    let allLogMessages = [];

    // This is the main "engine" that runs every 10 seconds to create a new event.
    setInterval(function() {
        // make a random license plate
        const plate = 'MH' + Math.floor(10 + Math.random() * 90) + 'AB' + Math.floor(1000 + Math.random() * 9000);
        vehiclePlateEl.textContent = plate;
        recentVehicles++; // one more vehicle this hour

        // update the picture
        snapshotImageEl.src = `https://picsum.photos/seed/${Math.random()}/600/400`;
        confidenceLevelEl.textContent = `${(85 + Math.random() * 15).toFixed(1)}%`;
        addLogMessage(`Vehicle detected: ${plate}`, 'vehicle');

        // add some random goods
        const goodsAmount = Math.floor(Math.random() * 50) + 10;
        totalGoods += goodsAmount;
        recentGoods += goodsAmount;
        goodsCounterEl.textContent = totalGoods.toLocaleString();
        addLogMessage(`${goodsAmount} units loaded.`, 'goods');

        // After 7 seconds, make it look like the vehicle has left
        setTimeout(function() {
            vehiclePlateEl.textContent = '-- WAITING --';
            snapshotImageEl.src = 'https://placehold.co/600x400/1f2937/374151?text=No+Event';
        }, 7000);

    }, 10000); // 10000 milliseconds = 10 seconds

    // This runs every 30 seconds to update the graphs
    setInterval(function() {
        updateChart(goodsChart, recentGoods);
        updateChart(vehiclesChart, recentVehicles);
        // reset counters for the next interval
        recentGoods = 0;
        recentVehicles = 0;
    }, 30000);


    // --- 4. HELPER FUNCTIONS ---
    // Small functions that do specific jobs.
    
    // Updates the clock every second
    function updateTheClock() {
        timeEl.textContent = new Date().toLocaleTimeString();
    }
    setInterval(updateTheClock, 1000);

    // Adds a new line to our event log
    function addLogMessage(message, type) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' });
        const logEntry = { text: `[${timestamp}] ${message}`, type: type };
        allLogMessages.unshift(logEntry); // add to the start of the list
        if (allLogMessages.length > 20) {
            allLogMessages.pop(); // keep the list from getting too long
        }
        // Redraw the whole log
        eventLogEl.innerHTML = ''; // clear it
        allLogMessages.forEach(log => {
            const p = document.createElement('p');
            p.textContent = log.text;
            p.className = (log.type === 'vehicle' ? 'text-blue-300' : 'text-green-300') + ' p-1';
            eventLogEl.appendChild(p);
        });
    }
    
    // Updates the data in our charts
    function updateChart(chart, newData) {
        chart.data.labels.shift(); // remove first label
        chart.data.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // add new label
        chart.data.datasets[0].data.shift(); // remove first data point
        chart.data.datasets[0].data.push(newData); // add new data point
        chart.update(); // redraw the chart
    }

    // --- 5. GEMINI AI API STUFF ---
    // This is where we talk to the Google AI

    async function askGemini(prompt) {
        geminiLoader.classList.remove('hidden'); // show "thinking..."
        geminiOutputBox.textContent = '';
        briefingBtn.disabled = true; // disable buttons
        anomalyBtn.disabled = true;

        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = ""; // Canvas handles the API key for us
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;
            geminiOutputBox.textContent = text; // Show the AI's answer

        } catch (error) {
            console.error("Oops! Gemini API failed.", error);
            geminiOutputBox.textContent = "Sorry, there was an error talking to the AI.";
        } finally {
            geminiLoader.classList.add('hidden'); // hide "thinking..."
            briefingBtn.disabled = false; // re-enable buttons
            anomalyBtn.disabled = false;
        }
    }

    // What happens when you click the "Get Briefing" button
    briefingBtn.addEventListener('click', function() {
        const dataSummary = `Goods data: ${goodsChart.data.datasets[0].data.toString()}\nVehicle data: ${vehiclesChart.data.datasets[0].data.toString()}`;
        const prompt = `You are a helpful assistant. Summarize this warehouse data in simple points for a shift manager:\n${dataSummary}`;
        askGemini(prompt);
    });

    // What happens when you click the "Find Problems" button
    anomalyBtn.addEventListener('click', function() {
        if (allLogMessages.length === 0) {
            geminiOutputBox.textContent = "Not enough data yet. Let the simulation run for a bit.";
            return;
        }
        const logText = allLogMessages.map(log => log.text).join('\n');
        const prompt = `Review this event log. Are there any potential problems or things to watch out for? Be brief.\n---\n${logText}\n---`;
        askGemini(prompt);
    });

});
