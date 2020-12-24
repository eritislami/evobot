export async function getQueue() {
    console.log("Fetching queue");
    return await fetch("/api/queue");
}