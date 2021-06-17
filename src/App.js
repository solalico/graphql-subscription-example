import logo from './logo.svg';
import './App.css';
import React from 'react'
import { generateRandomQuery } from 'ibm-graphql-query-generator'
import {execute, gql} from '@apollo/client'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import {WebSocketLink} from '@apollo/client/link/ws'

function App() {
  const [link, setLink] = React.useState(null)
  function startSub() {
    const client = new SubscriptionClient('wss://zenithjun16main-rgw.superman.dev.ciondemand.com/test/sandbox/test-yahel-graphql-stocks-curl-unsecured-api/graphql', {
      reconnect: false,
      connectionCallback: (err) => {
        // default: subscription by payload
        const wsLink = new WebSocketLink(client)
        execute(wsLink, {
          query: gql`
          subscription {
            liveQuotes(stock: "IBM") {
              lastPrice
            }
          }
          `
        }).subscribe((obj) => {
          console.log('1', obj)
        })
      }
    })
    setLink(client)
  }

  function stop() {
    link.close()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input type='button' value='start' onClick={() => startSub()}/>
        <input type='button' value='stop' onClick={() => stop()}/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
