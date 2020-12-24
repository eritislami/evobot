export async function getQueue() {
    console.debug(`${new Date().toString()}: Fetching queue`);
    return await fetch("/api/queue");
}