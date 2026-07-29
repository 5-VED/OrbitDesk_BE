const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function parseTime(str) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
}

function getDayConfig(bh, dayIndex) {
    return bh[DAYS[dayIndex]] || { enabled: false, start: '09:00', end: '17:00' };
}

function isHoliday(bh, date) {
    if (!bh.holidays || bh.holidays.length === 0) return false;
    const d = new Date(date);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return bh.holidays.some((h) => {
        const hd = new Date(h.date);
        const hs = `${hd.getFullYear()}-${String(hd.getMonth() + 1).padStart(2, '0')}-${String(hd.getDate()).padStart(2, '0')}`;
        return hs === ds;
    });
}

function minutesToMs(m) {
    return m * 60000;
}

function calculateDueDate(startDate, targetMinutes, businessHours) {
    const bh = businessHours;
    if (!bh) {
        return new Date(startDate.getTime() + targetMinutes * 60000);
    }

    let remaining = targetMinutes;
    let current = new Date(startDate);

    let dayIndex = current.getDay();
    let dayConfig = getDayConfig(bh, dayIndex);
    let currentMinutes = current.getHours() * 60 + current.getMinutes();

    if (isHoliday(bh, current)) {
        dayConfig = { enabled: false };
    }

    let inBusinessDay = dayConfig.enabled && currentMinutes >= parseTime(dayConfig.start) && currentMinutes < parseTime(dayConfig.end);

    const maxIterations = 1000;
    let iterations = 0;

    while (remaining > 0 && iterations < maxIterations) {
        iterations++;

        if (!dayConfig.enabled || isHoliday(bh, current)) {
            current.setDate(current.getDate() + 1);
            current.setHours(0, 0, 0, 0);
            dayIndex = current.getDay();
            dayConfig = getDayConfig(bh, dayIndex);
            inBusinessDay = false;
            continue;
        }

        const start = parseTime(dayConfig.start);
        const end = parseTime(dayConfig.end);
        const availableToday = end - start;

        if (!inBusinessDay) {
            if (currentMinutes < start) {
                current.setHours(0, 0, 0, 0);
                currentMinutes = start;
                current.setHours(Math.floor(start / 60), start % 60, 0, 0);
                inBusinessDay = true;
            } else {
                current.setDate(current.getDate() + 1);
                current.setHours(0, 0, 0, 0);
                dayIndex = current.getDay();
                dayConfig = getDayConfig(bh, dayIndex);
                currentMinutes = 0;
                inBusinessDay = false;
                continue;
            }
        }

        const timeLeftToday = end - currentMinutes;

        if (remaining <= timeLeftToday) {
            current = new Date(current.getTime() + remaining * 60000);
            remaining = 0;
        } else {
            remaining -= timeLeftToday;
            current.setDate(current.getDate() + 1);
            current.setHours(0, 0, 0, 0);
            dayIndex = current.getDay();
            dayConfig = getDayConfig(bh, dayIndex);
            currentMinutes = 0;
            inBusinessDay = false;
        }
    }

    return current;
}

module.exports = {
    calculateDueDate,
    isHoliday,
};
