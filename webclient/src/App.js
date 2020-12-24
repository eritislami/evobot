import React, { Component } from 'react';
import './App.css';
import QueueTable from './QueueTable';

class App extends Component {

  render() {
    console.log("Rendering...");
    return (
      <QueueTable />
    );
  }
}

export default App;
