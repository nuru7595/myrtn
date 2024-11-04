const rows = document.querySelectorAll("#table tr");
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
})

function myFunc() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
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
        } else {
            row.classList.remove('active');
        }
    });
}

// Call the function initially and set it to update every minute
myFunc();
setInterval(myFunc, 60000);