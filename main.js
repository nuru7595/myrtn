const rows = document.querySelectorAll(".tr");
let i = 1;
rows.forEach(row => {
    let td = row.querySelector("td");
    let tdEnd = row.querySelectorAll("td")[1];
    let h = Number(td.innerText.slice(0, 2));
    let hEnd = Number(tdEnd.innerText.slice(0, 2));
    let m = Number(td.innerText.slice(3, 5));
    let mEnd = Number(tdEnd.innerText.slice(3, 5));
    let ap = td.innerText.slice(6, 7);
    let apEnd = tdEnd.innerText.slice(6, 7);
    //
    if (ap == "P") {
        if (h < 12) {
            h += 12;
        }
    }
    if (apEnd == "P") {
        if (hEnd < 12) {
            hEnd += 12;
        }
    }
    row.setAttribute("data-start", `${h}:${m}`);
    row.setAttribute("data-end", `${hEnd}:${mEnd}`);
    row.setAttribute("data-task-id", i);
    i++;
})

function myFunc() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    let activeRow = null;
    rows.forEach(row => {
        const startTime = row.getAttribute('data-start').split(':');
        const startHour = parseInt(startTime[0]);
        const startMinutes = parseInt(startTime[1]);

        const endTime = row.getAttribute('data-end').split(':');
        const endHour = parseInt(endTime[0]);
        const endMinutes = parseInt(endTime[1]);

        // Handle overnight time range
        if (endHour < startHour || (endHour === startHour && endMinutes < startMinutes)) {
            // Current time is within start and midnight
            const isAfterStart = currentHour > startHour || (currentHour === startHour && currentMinutes >= startMinutes);
            const isBeforeMidnight = currentHour < 24; // up to 11:59 PM

            // Current time is after midnight and before end time
            const isAfterMidnight = currentHour < endHour || (currentHour === endHour && currentMinutes < endMinutes);

            isWithinTimeRange = (isAfterStart && isBeforeMidnight) || (currentHour < endHour || (currentHour === endHour && currentMinutes < endMinutes));
        } else {
            // Normal time range
            const isAfterStart = currentHour > startHour || (currentHour === startHour && currentMinutes >= startMinutes);
            const isBeforeEnd = currentHour < endHour || (currentHour === endHour && currentMinutes < endMinutes);

            isWithinTimeRange = isAfterStart && isBeforeEnd;
        }

        if (isWithinTimeRange) {
            row.classList.add('active');
            activeRow = row;
        } else {
            row.classList.remove('active');
        }
    });

    // Scroll to the active row if it exists
    if (activeRow) {
        activeRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Review Dates;
    function getPreviousDates() {
        const currentDate = new Date();

        // 1 day before the current date
        const oneDayBefore = new Date(currentDate);
        oneDayBefore.setDate(currentDate.getDate() - 1);

        // 2 days before the current date
        const twoDaysBefore = new Date(currentDate);
        twoDaysBefore.setDate(currentDate.getDate() - 2);

        // 1 week before the current date
        const oneWeekBefore = new Date(currentDate);
        oneWeekBefore.setDate(currentDate.getDate() - 7);

        // 2 weeks before the current date
        const twoWeeksBefore = new Date(currentDate);
        twoWeeksBefore.setDate(currentDate.getDate() - 14);

        return {
            oneDayBefore,
            twoDaysBefore,
            oneWeekBefore,
            twoWeeksBefore
        };
    }

    // Test the function
    const dates = getPreviousDates();
    const preDates = `${dates.twoWeeksBefore.getDate()}, ${dates.oneWeekBefore.getDate()}, ${dates.twoDaysBefore.getDate()}, ${dates.oneDayBefore.getDate()} Review`;
    document.querySelectorAll(".preDate").forEach(x => {
        x.innerText = preDates;
    });
}

// Call the function initially and set it to update every minute
myFunc();
setInterval(myFunc, 60000);

// New Update
// Helper function to get today's date as a unique key
function getTodayKey() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
}

// Function to mark a task as done
function markAsDone(button) {
    const row = button.closest('tr');
    const taskId = row.getAttribute('data-task-id');
    const todayKey = getTodayKey();

    // Retrieve the done tasks for today from localStorage
    let doneTasks = JSON.parse(localStorage.getItem(todayKey)) || [];

    // Mark the current task as done
    if (!doneTasks.includes(taskId)) {
        doneTasks.push(taskId);
        localStorage.setItem(todayKey, JSON.stringify(doneTasks));
    }

    // Update the row visually
    button.disabled = true;
    button.innerHTML = '-<i class="ri-heart-3-fill text-white"></i>-';
}

// Function to load the done tasks status from localStorage
function loadTasks() {
    const todayKey = getTodayKey();
    const doneTasks = JSON.parse(localStorage.getItem(todayKey)) || [];

    // Loop through each row and set its status if it was marked as done
    document.querySelectorAll('#table tr[data-task-id]').forEach(row => {
        const taskId = row.getAttribute('data-task-id');
        const button = row.querySelector('button');

        if (doneTasks.includes(taskId)) {
            button.disabled = true;
            button.innerHTML = '-<i class="ri-heart-3-fill text-white"></i>-';
        }
    });
}

function resetTasks() {
    const todayKey = getTodayKey();
    localStorage.removeItem(todayKey); // Clear today's tasks
    location.reload(); // Reload the page to reflect changes
}

// Load tasks status on page load
window.onload = loadTasks;