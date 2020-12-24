import React, { Component } from 'react';
import { getQueue } from './QueueService';

class QueueTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            songs: []
        };

        this.getQueueContent = this.getQueueContent.bind(this);
    }

    getQueueContent() {
        getQueue()
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    isLoaded: true,
                    songs: result.songs
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    componentDidMount() {
        this.getQueueContent();

        setInterval(this.getQueueContent, 5000);
    }    

    render() {
        console.log("Rendering QueueTable");
        const { error, isLoaded, songs } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div id="songTable">
                <ul>
                    {songs.map((song, index) => (
                        <li key={index}>{song.title}</li>
                    ))}
                </ul>
                <p>Last updated: {new Date().toString()}</p>
                </div>
            );
        }
    };
}

export default QueueTable;