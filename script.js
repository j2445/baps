// Get form and table elements
const attendanceForm = document.getElementById('attendanceForm');
const attendanceRecordsBody = document.getElementById('attendanceRecords');
const printButton = document.getElementById('printButton');
const nameButtons = document.querySelectorAll('.name-button'); // Get all name buttons
const submitAttendanceButton = document.getElementById('submitAttendanceButton');
const thankYouPopup = document.getElementById('thankYouPopup');
const closePopupButton = document.querySelector('.popup-container .close-button');

// Load existing records from localStorage
let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');
const today = formatDate(new Date());

// Check if it's a new day and reset records if so
if (lastAttendanceDate && lastAttendanceDate !== today) {
    records = []; // Clear records
    localStorage.removeItem('attendanceRecords');
}
localStorage.setItem('lastAttendanceDate', today); // Update last attendance date

// Function to apply 'done' class to buttons based on records
function applyDoneClassToButtons() {
    records.forEach(record => {
        const button = document.querySelector(`.name-button[data-name="${record.name}"]`);
        if (button) {
            button.classList.add('done');
            button.disabled = true; // Disable the button if attendance is already recorded
        }
    });
}
// Function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options); // DD/MM/YYYY
}
// Function to format time
function formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options); // HH:MM:SS AM/PM
}
// Function to count attendance by date and list names
function countAttendanceByDate() {
    const attendanceDetails = {};
    records.forEach(record => {
        const [day, month, year] = record.date.split('/').map(Number);
        const recordDate = new Date(year, month - 1, day); // Month is 0-indexed

            if (!attendanceDetails[record.date]) {
                attendanceDetails[record.date] = new Set();
            }
            attendanceDetails[record.date].add(record.name);

    });

    const sortedDates = Object.keys(attendanceDetails).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        // Note: Month is 0-indexed in Date constructor, so subtract 1
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    let summaryHtml = '<h3>Daily Attendance Summary</h3>'; // Changed heading
    summaryHtml += '<div class="attendance-summary-list">';
    if (sortedDates.length === 0) {
        summaryHtml += '<p>No daily attendance records found.</p>';
    } else {
        sortedDates.forEach(date => {
            const names = Array.from(attendanceDetails[date]); // Get names for the date
            summaryHtml += `<div class="summary-date-entry">`;
            summaryHtml += `<h4>${date}: ${names.length} Yuvaks present</h4>`;
            // Removed the line that lists individual names
            summaryHtml += `</div>`;
        });
    }
    summaryHtml += '</div>';

    return summaryHtml;
}

// Function to delete record
function deleteRecord(index) {
    records.splice(index, 1);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
    displayRecords();
    // Re-enable the button if its record was deleted
    const deletedRecordName = records[index] ? records[index].name : null; // Get name before splice
    if (deletedRecordName) {
        const button = document.querySelector(`.name-button[data-name="${deletedRecordName}"]`);
        if (button) {
            button.classList.remove('done');
            button.disabled = false;
        }
    }
}

// Display existing records (only on records.html)
function displayRecords() {
    if (attendanceRecordsBody) { // Check if element exists (i.e., on records.html)
        attendanceRecordsBody.innerHTML = '';
        records.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.name}</td>
                <td>${record.date}</td>
                <td>${record.time}</td>
                <td>
                    <button class="delete-button" onclick="deleteRecord(${index})">
                        Delete
                    </button>
                </td>
            `;
            attendanceRecordsBody.appendChild(row);
        });

        // Add the attendance summary to the designated div
        const attendanceSummaryDiv = document.getElementById('attendanceSummary');
        if (attendanceSummaryDiv) {
            attendanceSummaryDiv.innerHTML = countAttendanceByDate();
        }
    }
}

// Handle form submission (only on index.html)
if (attendanceForm) {
    let selectedName = '';

    // Add click event listeners to name buttons
    nameButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Only proceed if the button is not already 'done' (disabled)
            if (!button.classList.contains('done')) {
                // Remove 'selected' class from previously selected button
                nameButtons.forEach(btn => btn.classList.remove('selected'));
                // Add 'selected' class to the clicked button
                button.classList.add('selected');
                selectedName = button.dataset.name;
                // Automatically submit attendance when a name is clicked
                submitAttendance();
            }
        });
    });

    // Function to submit attendance
    function submitAttendance() {
        if (!selectedName) {
            alert('Please select a Yuvak name.');
            return;
        }

        const now = new Date();
        const date = formatDate(now);
        const time = formatTime(now);
        
        // Create new record
        const newRecord = { name: selectedName, date, time };
        records.push(newRecord);
        
        // Save to localStorage
        localStorage.setItem('attendanceRecords', JSON.stringify(records));
        
        // Find the button that was just clicked and add the 'done' class
        const clickedButton = document.querySelector(`.name-button[data-name="${selectedName}"]`);
        if (clickedButton) {
            clickedButton.classList.add('done');
            clickedButton.disabled = true; // Disable the button after attendance
        }
    
        // Reset selection
        nameButtons.forEach(btn => btn.classList.remove('selected'));
        selectedName = ''; // Clear selected name after submission
        
    }
}

// Handle print button click (only on records.html)
if (printButton) {
    printButton.addEventListener('click', () => {
        window.print();
    });
}

// Display records when page loads (only on records.html)
displayRecords();

// Apply 'done' class to buttons on index.html when page loads
if (attendanceForm) {
    applyDoneClassToButtons();
}


function logout() {
    sessionStorage.removeItem('loggedIn'); // Use sessionStorage for session-based logout
    window.location.href = 'login.html'; // Redirect to the login page
}

// Attach the logout function to the logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

