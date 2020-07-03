export const getTimestampAsString = (DATE) => {
    DATE = new Date(DATE);
    const year = DATE.getFullYear();
    const month = (DATE.getMonth() + 1) >= 10 ? (DATE.getMonth() + 1) : '0' + (DATE.getMonth() + 1);
    const day = DATE.getDate() >= 10 ? DATE.getDate() : '0' + DATE.getDate();
    const hours = DATE.getHours();
    const minutes = DATE.getMinutes();
    const seconds = DATE.getSeconds();
    const mlSeconds = DATE.getMilliseconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${mlSeconds}`;
}

export const getMinutes = (DATE) => {
    DATE = new Date(DATE);
    return DATE.getMinutes();
}

export const getSeconds = (DATE) => {
    DATE = new Date(DATE);
    return DATE.getSeconds();
}

export const getMilliseconds = (DATE) => {
    DATE = new Date(DATE);
    return DATE.getMilliseconds();
}
