import React, { Component } from 'react';
import { getQueue } from './QueueService';

class QueueTable extends Component {
    intervalId = 0;

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

        this.intervalId = setInterval(this.getQueueContent, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const { error, isLoaded, songs } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div id="songTable">
                <table className="pure-table pure-table-horizontal">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th colSpan="2">Requestor</th>
                        </tr>
                    </thead>
                    <tbody>
                    {songs.map((song, index) => (
                        <tr key={"song-" + index}  className={index % 2 === 0 ? '' : 'pure-table-odd'}>
                            <td>{index+1}</td>
                            <td><a href={song.url}>{song.title}</a></td>
                            <td>{song.user.username}</td>
                            <td><img src={song.user.displayAvatarURL} height="25" width="25" alt=""/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p>Last updated: {new Date().toString()}</p>
                </div>
            );
        }
    };
}

export default QueueTable;