import React, { Component } from 'react';
import { getQueue } from './QueueService';
//import { Songs } from './DisplayQueue';
//import QueueTable from './QueueTable';
import './App.css';
import QueueTable from './QueueTable';

class App extends Component {
  componentDidMount() {
    getQueue()
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            songs: result.songs
          })
        }
      )
  }

  render() {
    console.log("Rendering...");
    return (
      <QueueTable />
    );
    /*this.getAllSongs()
    return (
      <div className="App">
        <header></header>
        <div className="container">
          <Songs songs={this.state.songs}/>
        </div>
      </div>
    );*/
    
  }
}

export default App;
