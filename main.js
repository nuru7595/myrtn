const rows = document.querySelectorAll("tr[data-start]");
const now = new Date();
// Function to mark a task as done
let i = 1;
rows.forEach((row, index) => {
    // Column 5;
    row.setAttribute("data-id", i);
    i++;
    const button = document.createElement("button");
    if (index < rows.length - 2) {
        button.innerHTML = "<i class='ri-check-double-line'></i>";
        button.setAttribute("onclick", "markAsDone(this)");
    } else {
        button.innerHTML = "<i class='ri-heart-3-fill'></i>";
    }
    row.querySelectorAll("td")[4].appendChild(button);
    // Column 3;
    const dataStart = row.getAttribute("data-start");
    const dataEnd = row.getAttribute("data-end");
    const [sh, sm] = dataStart.split(":").map(Number);
    const [eh, em] = dataEnd.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = (eh < sh ? eh + 24 : eh) * 60 + em;
    row.querySelectorAll("td")[2].innerText = `${end - start}m`;
})
function markAsDone(button) {
    const row = button.closest('tr');
    const taskId = row.getAttribute('data-id');
    const todayKey = now.toISOString().split('T')[0];
    let doneTasks = JSON.parse(localStorage.getItem(todayKey)) || [];
    if (!doneTasks.includes(taskId)) {
        doneTasks.push(taskId);
        localStorage.setItem(todayKey, JSON.stringify(doneTasks));
    }
    button.disabled = true;
    button.innerHTML = '<i class="ri-heart-3-fill"></i>';
}
function loadTasks() {
    const todayKey = now.toISOString().split('T')[0];
    const doneTasks = JSON.parse(localStorage.getItem(todayKey)) || [];
    document.querySelectorAll('#table tr[data-id]').forEach(row => {
        const taskId = row.getAttribute('data-id');
        const button = row.querySelector('button');
        if (doneTasks.includes(taskId)) {
            button.disabled = true;
            button.innerHTML = '<i class="ri-heart-3-fill"></i>';
        }
    });
    Object.keys(localStorage).forEach(key => {
        if (key !== todayKey) {
            localStorage.removeItem(key);
        }
    });
}
function resetTasks() {
    localStorage.clear();
    location.reload();
}
window.onload = loadTasks;

function myFunc() {
    const now = new Date();
    let activeRow = null;
    rows.forEach(row => {
        const [sh, sm] = row.getAttribute('data-start').split(':').map(Number);
        const [eh, em] = row.getAttribute('data-end').split(':').map(Number);
        const ch = new Date().getHours();
        const cm = new Date().getMinutes();

        const on = eh < sh || (eh === sh && em < sm);
        const as = ch > sh || (ch === sh && cm >= sm);
        const be = ch < eh || (ch === eh && cm < em);
        const isTrue = on ? as || be : as && be;

        if (isTrue) {
            row.classList.add('active');
            activeRow = row;
        } else {
            row.classList.remove('active');
        }
    });

    if (activeRow) {
        activeRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function getPreviousDates() {
        const oneDayBefore = new Date(now);
        oneDayBefore.setDate(now.getDate() - 1);
        const twoDaysBefore = new Date(now);
        twoDaysBefore.setDate(now.getDate() - 2);
        const oneWeekBefore = new Date(now);
        oneWeekBefore.setDate(now.getDate() - 7);
        const twoWeeksBefore = new Date(now);
        twoWeeksBefore.setDate(now.getDate() - 14);
        return {
            oneDayBefore,
            twoDaysBefore,
            oneWeekBefore,
            twoWeeksBefore
        };
    }
    const dates = getPreviousDates();
    const preDates = `${dates.twoWeeksBefore.getDate()},${dates.oneWeekBefore.getDate()},${dates.twoDaysBefore.getDate()},${dates.oneDayBefore.getDate()}`;
    document.querySelectorAll(".preDate").forEach(x => {
        x.innerText = preDates;
    });

    function parseTime(timeString) {
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    }

    function updateCountdowns() {
        rows.forEach(row => {
            const endTime = parseTime(row.getAttribute("data-end"));
            const diff = endTime - now;

            if (diff > 0) {
                const totalMinutes = Math.floor(diff / 60000);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                if (hours > 0) {
                    row.querySelectorAll("td")[3].textContent = `${hours}:${minutes.toString().padStart(2, '0')}m`;
                } else {
                    row.querySelectorAll("td")[3].textContent = `${minutes}m`;
                }
            } else {
                row.querySelectorAll("td")[3].textContent = "0m";
            }
        });
    }
    updateCountdowns();
}

myFunc();
setInterval(myFunc, 60000);