export async function getQueue() {
    console.debug(`${new Date().toString()}: Fetching queue`);
    return await fetch("https://fred.skydev.one:8081/api/queue")
        .then(response => response.json())
        .then((json) => {
            json.totalTime = getTotalTime(json.songs.reduce((a, b) =>  a + parseInt(b.duration), 0));
            return json;
        });
    }

function getTotalTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}