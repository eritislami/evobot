const {PubSub} = require('@google-cloud/pubsub');

const projectId = 'rythmaddon';
const queueUpdateTopic = 'fred-queueupdate';
console.log("Creating pubsub client");
const pubsub = new PubSub({projectId});

module.exports = {
    listenForQueueUpdates() {
        const subscription = pubsub.subscription(queueUpdateTopic);
        const messageHandler = (message) => {
            console.log(`Received message ${message.id}: ${message.data}`);
            message.ack();
        };
        subscription.on('message', messageHandler);
    }
}