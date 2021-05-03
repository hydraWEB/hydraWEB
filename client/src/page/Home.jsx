import React from 'react';
import logo from '../logo.svg';
import './Home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 5,
            lat: 34,
            zoom: 2
        };
    }

    render() {
        return (
            <>
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
          </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
          </a>
            </>
        )
    }
}

export default Home;