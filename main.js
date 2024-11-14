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
    document.querySelectorAll(".preDate").forEach(element => {
        element.innerText = getPreviousDates();
    });
    const updateTime = (row) => {
        const [startHour, startMin] = row.getAttribute("data-start").split(":").map(Number);
        const [endHour, endMin] = row.getAttribute("data-end").split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = (endHour < startHour ? endHour + 24 : endHour) * 60 + endMin;
        const duration = endMinutes - startMinutes;
        row.querySelector("td:nth-child(3)").innerText =
            duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`;

        const updateRemainingTime = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            let remainingMinutes = endMinutes - currentMinutes;
            if (remainingMinutes < 0) {
                remainingMinutes += 24 * 60;
            } else if (remainingMinutes >= 24 * 60) {
                remainingMinutes %= 24 * 60;
            }
            row.querySelector("td:nth-child(4)").innerText =
                remainingMinutes > 0 ?
                    (remainingMinutes >= 60 ? `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m` : `${remainingMinutes}m`)
                    : "0m";
            const nowHours = now.getHours();
            const nowMinutes = now.getMinutes();
            const afterStart = (nowHours > startHour) || (nowHours === startHour && nowMinutes >= startMin);
            const beforeEnd = (nowHours < endHour) || (nowHours === endHour && nowMinutes < endMin);
            const crossesMidnight = endHour < startHour;
            const isActive = crossesMidnight ? (afterStart || beforeEnd) : (afterStart && beforeEnd);
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
    document.querySelectorAll("tr[data-start]").forEach(row => updateTime(row));
});