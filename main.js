document.addEventListener("DOMContentLoaded", () => {
    const getPreviousDates = () => {
        const now = new Date();
        const offsets = [14, 7, 2, 1];
        return offsets.map(offset => {
            const date = new Date(now);
            date.setDate(now.getDate() - offset);
            return date.getDate();
        }).join(',');
    };
    document.querySelectorAll(".preDate").forEach(x => x.innerText = getPreviousDates());

    const rows = document.querySelectorAll("tr[data-start]");
    const totalRows = rows.length;

    const updateTime = (row) => {
        const [sh, sm] = row.getAttribute("data-start").split(":").map(Number);
        const [eh, em] = row.getAttribute("data-end").split(":").map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes = (eh < sh ? eh + 24 : eh) * 60 + em;
        const duration = endMinutes - startMinutes;
        row.querySelectorAll("td")[2].innerText = duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`;

        const updateRemainingTime = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            let remaining = endMinutes - currentMinutes;
            if (remaining < 0) {
                remaining += 24 * 60;
            }
            row.querySelectorAll("td")[3].innerText = remaining > 0 ?
                (remaining >= 60 ? `${Math.floor(remaining / 60)}h ${remaining % 60}m` : `${remaining}m`) : "0m";

            const ch = now.getHours();
            const cm = now.getMinutes();
            const on = eh < sh || (eh === sh && em < sm);
            const as = ch > sh || (ch === sh && cm >= sm);
            const be = ch < eh || (ch === eh && cm < em);
            const isActive = on ? as || be : as && be;

            if (isActive) {
                row.classList.add('active');
                row.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                row.classList.remove('active');
            }
        };
        updateRemainingTime();
        setInterval(updateRemainingTime, 60000);
    };

    const addDoneButton = (row, index) => {
        const button = document.createElement("button");
        if (index >= totalRows - 2) {
            button.innerHTML = "<i class='ri-heart-3-fill'></i>";
            button.disabled = true;
        } else {
            button.innerHTML = "<i class='ri-check-double-line'></i>";
            button.addEventListener("click", () => {
                const isDone = row.classList.toggle("done");
                if (isDone) {
                    button.innerHTML = "<i class='ri-heart-3-fill'></i>";
                    button.disabled = true;
                } else {
                    "<i class='ri-check-double-line'></i>";
                }
                updateDoneStatus();
            });
        }
        row.querySelectorAll("td")[4].appendChild(button);
    };

    const updateDoneStatus = () => {
        const doneRows = [];
        rows.forEach((row, index) => {
            if (row.classList.contains("done")) doneRows.push(index);
        });
        localStorage.setItem("doneRows", JSON.stringify(doneRows));
    };

    const loadRowStatus = () => {
        const doneRows = JSON.parse(localStorage.getItem("doneRows")) || [];
        rows.forEach((row, index) => {
            if (doneRows.includes(index)) {
                row.classList.add("done");
                const button = row.querySelector("button");
                button.innerHTML = "<i class='ri-heart-3-fill'></i>";
            }
        });
    };

    const resetTime = new Date();
    resetTime.setHours(20, 0, 0, 0);
    if (new Date() > resetTime) {
        resetTime.setDate(resetTime.getDate() + 1);
    }

    setTimeout(() => {
        localStorage.removeItem("doneRows");
        rows.forEach(row => {
            row.classList.remove("done");
            const button = row.querySelector("button");
            button.innerHTML = "<i class='ri-check-double-line'></i>";
        });
    }, resetTime - new Date());

    rows.forEach((row, index) => {
        updateTime(row);
        addDoneButton(row, index);
    });

    loadRowStatus();
});

function resetTasks() {
    localStorage.clear();
    location.reload();
}