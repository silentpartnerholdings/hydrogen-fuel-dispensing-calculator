document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('refuelingForm');
    const result = document.getElementById('result');
    const configuration = document.getElementById('configuration');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const numberOfVehicles = parseInt(document.getElementById('numberOfVehicles').value);
        const vehicleModel = document.getElementById('vehicleModel').value;
        const fuelCapacity = parseFloat(document.getElementById('fuelCapacity').value);
        const vehiclePressure = parseFloat(document.getElementById('vehiclePressure').value);
        const emptyPercentage = parseFloat(document.getElementById('emptyPercentage').value);
        const returnFrequency = parseFloat(document.getElementById('returnFrequency').value);
        const refuelTime = parseFloat(document.getElementById('refuelTime').value);
        const deliveryPressure = parseFloat(document.getElementById('deliveryPressure').value);

        // Constants
        const AMBIENT_TEMPERATURE = 293.15; // 20°C in Kelvin
        const HYDROGEN_DENSITY = 0.08988; // kg/m³ at STP
        const COMPRESSIBILITY_FACTOR = 1.4; // Approximate Z-factor for hydrogen

        // Calculations
        const compressionRatio = vehiclePressure / deliveryPressure;
        
        // Calculate the mass of hydrogen needed per refuel
        const vehicleCapacity = fuelCapacity * (100 - emptyPercentage) / 100;
        
        // Daily hydrogen demand
        const dailyDemand = numberOfVehicles * (24 / returnFrequency) * vehicleCapacity; // kg/day

        // Storage capacity needed (3x daily demand for buffer)
        const storageCapacity = 3 * dailyDemand; // kg

        // Compressor size
        const compressorSize = (dailyDemand / 24) * 3600 / HYDROGEN_DENSITY; // m³/hour

        // Dispenser flow rate
        const dispenserFlowRate = vehicleCapacity / (refuelTime / 60); // kg/hour

        // Number of storage tanks (assuming 1000L tanks at 500 bar)
        const storageTankCapacity = 1000 * 500 * HYDROGEN_DENSITY / 1000; // kg per tank
        const numberOfTanks = Math.ceil(storageCapacity / storageTankCapacity);

        // Compression stages
        const compressionStages = Math.ceil(Math.log(compressionRatio) / Math.log(3));

        const configText = `
            <h3>Input Summary:</h3>
            <div class="result-item">
                <i class="fas fa-car"></i> Number of Vehicles: <span>${numberOfVehicles}</span>
            </div>
            ${vehicleModel ? `
            <div class="result-item">
                <i class="fas fa-info-circle"></i> Vehicle Model: <span>${vehicleModel}</span>
            </div>
            ` : ''}
            <div class="result-item">
                <i class="fas fa-gas-pump"></i> Fuel Capacity: <span>${fuelCapacity.toFixed(2)} kg</span>
            </div>

            <h3>Calculated Results:</h3>
            <div class="result-item">
                <i class="fas fa-compress-alt"></i> Compression ratio: <span>${compressionRatio.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <i class="fas fa-gas-pump"></i> Daily hydrogen demand: <span>${dailyDemand.toFixed(2)} kg/day</span>
            </div>
            <div class="result-item">
                <i class="fas fa-database"></i> Storage capacity: <span>${storageCapacity.toFixed(2)} kg</span>
            </div>
            <div class="result-item">
                <i class="fas fa-compress"></i> Compressor size: <span>${compressorSize.toFixed(2)} m³/hour</span>
            </div>
            <div class="result-item">
                <i class="fas fa-fill-drip"></i> Dispenser flow rate: <span>${dispenserFlowRate.toFixed(2)} kg/hour</span>
            </div>
            
            <h3>Recommendations:</h3>
            <div class="result-item">
                <i class="fas fa-cog"></i> Use a <span>${compressionStages}-stage</span> compressor
            </div>
            <div class="result-item">
                <i class="fas fa-tank"></i> Install <span>${numberOfTanks}</span> storage tanks of 1000L each at 500 bar
            </div>
            <div class="result-item">
                <i class="fas fa-tachometer-alt"></i> Use a dispenser with a minimum flow rate of <span>${Math.ceil(dispenserFlowRate)} kg/hour</span>
            </div>
            
            <p class="note"><i class="fas fa-info-circle"></i> Note: This calculation is based on simplified models and assumptions. For a real-world implementation, consult with hydrogen refueling experts and consider safety factors, local regulations, and specific equipment specifications.</p>
        `;

        configuration.innerHTML = configText;
        result.classList.remove('hidden');
        result.scrollIntoView({ behavior: 'smooth' });

        // Add animation to result items
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
        });
    });
});