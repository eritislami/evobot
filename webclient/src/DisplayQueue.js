import { UserFlags } from 'discord.js';
import React from 'react'

export const Songs = ({songs}) => {
    console.log('Queue length:::', songs.length);
    if (UserFlags.length === 0) return "Empty Queue";

    const SongRow = (song, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{song.name}</td>
                <td>{song.author.username}</td>
                <td>{song.author.id}</td>
            </tr>
        )
    }

    const songTable = songs.map((song, index) => SongRow(song, index))

    return(
        <div className="container">
            <h2>Queue</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>User</th>
                        <th>User ID</th>
                    </tr>
                </thead>
                <tbody>
                    {songTable}
                </tbody>
            </table>
        </div>
    )
}
/*
class QueueTable extends React.Component {
    state = {
        data: []
    };

    componentDidMount() {
        const url = "/api/queue";
        fetch(url)
            .then(resp => resp.json())
            .then(JSONresponse => {
                this.setState(
                    {
                        data: JSONresponse
                    }
                );
            });
    }

    render() {
        const { data } = this.state;

        function QueueRow(song)

        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>User</th>
                        <th>User ID</th>
                    </tr>
                </thead>
                <tbody>
                    {queueTable}
                </tbody>
            </table>
        )
    }
}

export const DisplayQueue = ({queue}) => {
    if (queue.length === 0) return <h2>Empty Queue</h2>;

    const QueueRow = (song, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{song.name}</td>
                <td>{song.author.username}</td>
                <td>{song.author.id}</td>
            </tr>
        );
    }
    const queueTable = queue.map((song, index) => QueueRow(song, index));

    return (
        <div className="container">
            <h2>Queue</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>User</th>
                        <th>User ID</th>
                    </tr>
                </thead>
                <tbody>
                    {queueTable}
                </tbody>
            </table>
        </div>
    )
}
*/