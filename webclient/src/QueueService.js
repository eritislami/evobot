export async function getQueue() {
    console.debug(`${new Date().toString()}: Fetching queue`);
    return await fetch("https://fred.skydev.one:8080/api/queue");
}