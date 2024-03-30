// Variable to store the number of years
let numYears = 0;

// Function to create the GPA calculation table
function createTable() {
    // Parse the input value to get the number of years
    numYears = parseInt(document.getElementById('numYears').value);

    // Check if the input is a valid number
    if (isNaN(numYears) || numYears < 1 || numYears > 8) {
        alert('Please enter a number between 1 and 8 for the number of years.');
        return;
    }

    // Variable to store the HTML content for the table
    let tableHTML = '';

    for (let year = 1; year <= numYears; year++) {
        tableHTML += `<h2>Year ${year}</h2>`;
        tableHTML += '<table>';
        tableHTML += '<tr>';
        tableHTML += '<th class="tooltip" data-tooltip="Semester">Semester</th>';
        tableHTML += '<th class="tooltip" data-tooltip="Enter the number of classes you are taking here."># of Classes</th>';
        tableHTML += '<th class="tooltip" data-tooltip="Enter the name of the Course/Class you are taking here.">Course Name</th>';
        tableHTML += '<th class="tooltip" data-tooltip="Enter the percent grade you got in the class.">Grade</th>';
        tableHTML += '<th class="tooltipap" data-tooltip="Check the box if your class was Honors/AP.">Honors/AP</th>';
        tableHTML += '</tr>';

        // Loop to create rows for each semester
        for (let semester = 1; semester <= 2; semester++) {
            tableHTML += `<tr data-year="${year}" data-semester="${semester}">`;
            tableHTML += `<td>${semester} Semester</td>`;
            tableHTML += `<td><input type="number" class="custom-number-input numClasses" min="1"></td>`;
            tableHTML += `<td id="courseName_${year}_${semester}"></td>`;
            tableHTML += `<td id="grade_${year}_${semester}"></td>`;
            tableHTML += `<td id="isHonors_${year}_${semester}"></td>`;
            tableHTML += '</tr>';
        }

        tableHTML += '</table>';
    }

    // Get the table container element
    const tableContainer = document.getElementById('tableContainer');

    // Set the table HTML content
    tableContainer.innerHTML = tableHTML;

    // Triggering reflow to apply transition
    tableContainer.offsetHeight;

    // Set the opacity to make the table visible with transition effect
    tableContainer.style.opacity = 1;

    // Attach event listeners and update GPA
    attachEventListeners();
    updateGPA();
}

// Function to attach event listeners
function attachEventListeners() {
    // Get all inputs with class 'numClasses' and attach input event listener
    const numClassesInputs = document.querySelectorAll('.numClasses');
    numClassesInputs.forEach(input => {
        input.addEventListener('input', createClassRows);
        input.addEventListener('input', saveDataLocally);
    });

    // Get all inputs with id starting with 'courseName_' and attach input event listener
    const courseNameInputs = document.querySelectorAll('[id^="courseName_"]');
    courseNameInputs.forEach(input => {
        input.addEventListener('input', updateGPA);
        input.addEventListener('input', saveDataLocally);
    });

    // Get all inputs with id starting with 'grade_' and attach input event listener
    const gradeInputs = document.querySelectorAll('[id^="grade_"]');
    gradeInputs.forEach(input => {
        input.addEventListener('input', updateGPA);
        input.addEventListener('input', saveDataLocally);
    });

    // Get all inputs with id starting with 'isHonors_' and attach input event listener
    const honorsInputs = document.querySelectorAll('[id^="isHonors_"]');
    honorsInputs.forEach(input => {
        input.addEventListener('input', updateGPA);
        input.addEventListener('input', saveDataLocally);
    });
}

// Function to dynamically create rows based on the number of classes
function createClassRows(event) {
    const numClasses = parseInt(event.target.value);
    const year = event.target.closest('tr').dataset.year;
    const semester = event.target.closest('tr').dataset.semester;

    let courseNameHTML = '';
    let gradeHTML = '';
    let isHonorsHTML = '';

    // Check if the number of classes exceeds 10
    if (numClasses > 10) {
        alert('The maximum number of classes allowed is 10.');
        event.target.value = 10; // Reset the input value to 10
        numClasses = 10;
    }

    // Loop to generate input fields for each class (up to 10)
    for (let i = 1; i <= numClasses; i++) {
    courseNameHTML += `<input type="text" class="custom-text-input" id="courseName_${year}_${semester}_${i}" placeholder="Course Name"><br>`;
    gradeHTML += `<input type="number" class="custom-number-input" id="grade_${year}_${semester}_${i}" min="0" max="100" placeholder="Grade"><br>`;
    isHonorsHTML += `<div class="honors-container">
                        <input type="checkbox" class="custom-checkbox" id="isHonors_${year}_${semester}_${i}">
                        <label for="isHonors_${year}_${semester}_${i}">Honors/AP</label>
                     </div>`;
}

    // Set the inner HTML of corresponding elements
    document.getElementById(`courseName_${year}_${semester}`).innerHTML = courseNameHTML;
    document.getElementById(`grade_${year}_${semester}`).innerHTML = gradeHTML;
    document.getElementById(`isHonors_${year}_${semester}`).innerHTML = isHonorsHTML;
    updateGPA();
}

// Function to update GPA based on user input
function updateGPA() {
    const resultContainer = document.getElementById('result');
    let totalPoints = 0;
    let totalCredits = 0;
    let totalHonorsCredits = 0;

    // Remove any existing error messages
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }

    for (let year = 1; year <= numYears; year++) {
        for (let semester = 1; semester <= 2; semester++) {
            const numClasses = parseInt(document.querySelector(`[data-year="${year}"][data-semester="${semester}"] .numClasses`).value);

            for (let i = 1; i <= numClasses; i++) {
                const grade = parseFloat(document.querySelector(`#grade_${year}_${semester}_${i}`).value);
                const isHonors = document.querySelector(`#isHonors_${year}_${semester}_${i}`).checked;

                let gpa;

                if (isHonors) {
                    // For honors/AP classes, treat a failing grade as 1.0
                    switch (true) {
                        case (grade >= 90):
                            gpa = 5.0;
                            break;
                        case (grade >= 80):
                            gpa = 4.0;
                            break;
                        case (grade >= 70):
                            gpa = 3.0;
                            break;
                        case (grade >= 60):
                            gpa = 2.0;
                            break;
                        default:
                            gpa = 1.0;
                    }
                } else {
                    // For regular classes, use the existing logic
                    switch (true) {
                        case (grade >= 90):
                            gpa = 4.0;
                            break;
                        case (grade >= 80):
                            gpa = 3.0;
                            break;
                        case (grade >= 70):
                            gpa = 2.0;
                            break;
                        case (grade >= 60):
                            gpa = 1.0;
                            break;
                        default:
                            gpa = 0.0;
                    }
                }

                totalPoints += gpa;
                totalCredits += 1;

                if (isHonors) {
                    totalHonorsCredits += 1;
                }
            }
        }
    }

    // Calculate unweighted and weighted GPA
    const unweightedGPA = totalPoints / totalCredits - totalHonorsCredits / totalCredits;
    const weightedGPA = unweightedGPA + totalHonorsCredits / totalCredits;

    // Display GPA in the result container
    let color;
    if (unweightedGPA >= 3.0) {
        color = 'green';
    } else if (unweightedGPA >= 2.0) {
        color = 'orange';
    } else if (unweightedGPA >= 1.0) {
        color = 'red';
    } else {
        color = '#8B0000';
    }

    resultContainer.innerHTML = `
        Unweighted GPA: <span style="color: ${color};">${unweightedGPA.toFixed(2)}</span><br>
        Weighted GPA: <span style="color: ${color};">${weightedGPA.toFixed(2)}</span>
    `;

    // Remove any existing error messages
    const errorMessages = document.querySelectorAll('p[style="color: #8B0000;"]');
    errorMessages.forEach(message => message.remove());
}

// Function to save GPA data locally
function saveDataLocally() {
    const data = [];

    // Loop to gather data for each year and semester
    for (let year = 1; year <= numYears; year++) {
        for (let semester = 1; semester <= 2; semester++) {
            const numClasses = parseInt(document.querySelector(`[data-year="${year}"][data-semester="${semester}"] .numClasses`).value);

            data.push({ year, semester, numClasses });

            // Loop to gather data for each class
            for (let i = 1; i <= numClasses; i++) {
                const courseName = document.querySelector(`#courseName_${year}_${semester}_${i}`).value;
                const grade = document.querySelector(`#grade_${year}_${semester}_${i}`).value;
                const isHonors = document.querySelector(`#isHonors_${year}_${semester}_${i}`).checked;

                data.push({ year, semester, courseName, grade, isHonors, num: i });
            }
        }
    }

    // Save data to local storage as a JSON string
    localStorage.setItem('gpaData', JSON.stringify({ numYears, data }));
}

// Function to load saved GPA data
function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('gpaData'));

    if (!savedData) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'No saved GPA data found!';
        errorMessage.style.color = '#8B0000';
        errorMessage.classList.add('error-message');
        document.body.appendChild(errorMessage);
    } else {
        // Update the number of years input and create the table structure
        numYears = savedData.numYears;
        document.getElementById('numYears').value = numYears;
        createTable();

        // Loop to populate input fields with saved data
        savedData.data.forEach((entry) => {
            if (entry.numClasses) {
                document.querySelector(`[data-year="${entry.year}"][data-semester="${entry.semester}"] .numClasses`).value = entry.numClasses;
                createClassRows({ target: document.querySelector(`[data-year="${entry.year}"][data-semester="${entry.semester}"] .numClasses`) });
            } else {
                const courseName = document.querySelector(`#courseName_${entry.year}_${entry.semester}_${entry.num}`);
                const grade = document.querySelector(`#grade_${entry.year}_${entry.semester}_${entry.num}`);
                const isHonors = document.querySelector(`#isHonors_${entry.year}_${entry.semester}_${entry.num}`);

                if (courseName && grade && isHonors) {
                    courseName.value = entry.courseName;
                    grade.value = entry.grade;
                    isHonors.checked = entry.isHonors;
                }
            }
        });

        // Update GPA based on loaded data
        updateGPA();
    }

    // Load saved chart data from localStorage
    const savedChartData = JSON.parse(localStorage.getItem('gpaChartData'));

    // Check if there is saved chart data
    if (savedChartData) {
        gpaChartData = savedChartData;

        // Render the chart with the loaded data
        const ctx = document.getElementById('gpaChart').getContext('2d');
        if (gpaChart) {
            gpaChart.destroy(); // Destroy the existing chart instance before creating a new one
        }
        gpaChart = new Chart(ctx, {
            type: 'line',
            data: gpaChartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 5, // Suggested max value to accommodate weighted GPA
                    },
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0,
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'xy',
                        },
                        pan: {
                            enabled: true,
                            mode: 'xy',
                        },
                    },
                },
            }
        });
    }

    // Remove any existing error messages after input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const errorMessage = document.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
}

// Function to clear locally saved GPA data
function clearData() {
    // Remove saved GPA data from localStorage
    localStorage.removeItem('gpaData');

    // Clear the GPA calculation results and the table container from the UI
    document.getElementById('tableContainer').innerHTML = '';
    document.getElementById('result').textContent = '';

    // Remove saved chart data from localStorage
    localStorage.removeItem('gpaChartData');

    // Optionally, if you wish to remove the chart visually as well, you can do so by checking if the chart exists and then destroying it
    if (gpaChart) {
        gpaChart.destroy();
        gpaChart = null; // Reset the chart variable to ensure you can create a new chart later without issues
    }
}

// Function to navigate to the FAQ page
function goToFAQ() {
    window.location.href = 'faq.html';
}

// Function to toggle light/dark mode
function toggleLightDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    // Update chart colors based on the mode
    const chartColors = body.classList.contains('dark-mode') ? ['rgb(255, 159, 64)', 'rgb(255, 99, 132)'] : ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'];

    gpaChartData.datasets[0].borderColor = chartColors[0];
    gpaChartData.datasets[0].pointBackgroundColor = chartColors[0];
    gpaChartData.datasets[0].pointHoverBackgroundColor = chartColors[0];

    gpaChartData.datasets[1].borderColor = chartColors[1];
    gpaChartData.datasets[1].pointBackgroundColor = chartColors[1];
    gpaChartData.datasets[1].pointHoverBackgroundColor = chartColors[1];

    // Update the chart with the new colors
    if (gpaChart) {
        gpaChart.update();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
});

let gpaChartData = {
    labels: [],
    datasets: [
        {
            label: 'Unweighted GPA',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 5,
            hitRadius: 5,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointHoverRadius: 7,
            pointHoverBackgroundColor: 'rgb(75, 192, 192)',
        },
        {
            label: 'Weighted GPA',
            data: [],
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
            pointRadius: 5,
            hitRadius: 5,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointHoverRadius: 7,
            pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        }
    ]
};

let gpaChart;

function addToPlot() {
    // Retrieve GPA values
    const unweightedGPA = parseFloat(document.querySelector('#result span:first-child').textContent);
    const weightedGPA = parseFloat(document.querySelector('#result span:last-child').textContent);

    // Check if the GPAs are valid numbers
    if (isNaN(unweightedGPA) || isNaN(weightedGPA)) {
        // Remove any existing error messages
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }

        const newErrorMessage = document.createElement('p');
        newErrorMessage.textContent = 'Invalid GPA values. Please ensure all grades are entered correctly.';
        newErrorMessage.classList.add('error-message');
        document.body.appendChild(newErrorMessage);
    } else {
        const currentDate = new Date();
        const label = currentDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        // Update chart data
        gpaChartData.labels.push(label);
        gpaChartData.datasets[0].data.push(unweightedGPA);
        gpaChartData.datasets[1].data.push(weightedGPA);

        // Check if the chart has already been created
        if (gpaChart) {
            // If the chart exists, update it with the new data
            gpaChart.update();
        } else {
            // If the chart hasn't been created, initialize it with the current data
            const ctx = document.getElementById('gpaChart').getContext('2d');
            gpaChart = new Chart(ctx, {
                type: 'line',
                data: gpaChartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: 5, // Suggested max value to accommodate weighted GPA
                        },
                        x: {
                            ticks: {
                                autoSkip: true,
                                maxRotation: 0,
                            },
                        },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                        },
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true,
                                },
                                mode: 'xy',
                            },
                            pan: {
                                enabled: true,
                                mode: 'xy',
                            },
                        },
                    },
                }
            });
        }

        // Save the updated chart data to localStorage
        localStorage.setItem('gpaChartData', JSON.stringify(gpaChartData));
    }
}

// Get the textarea element for the journal entry
const journalEntryTextarea = document.getElementById('journalEntry');

// Add an event listener for the 'input' event
journalEntryTextarea.addEventListener('input', () => {
    // Get the current value of the textarea
    const journalEntry = journalEntryTextarea.value.trim();

    // Save the journal entry to localStorage
    localStorage.setItem('currentJournalEntry', journalEntry);
});

// Load the previously saved journal entry when the page loads
window.addEventListener('load', () => {
    // Get the saved journal entry from localStorage
    const savedJournalEntry = localStorage.getItem('currentJournalEntry');

    // Set the value of the textarea to the saved journal entry (if it exists)
    if (savedJournalEntry) {
        journalEntryTextarea.value = savedJournalEntry;
    }
});
