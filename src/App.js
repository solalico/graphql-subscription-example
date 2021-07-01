import logo from './logo.svg';
import './App.css';
import React from 'react'
import { generateRandomQuery } from 'ibm-graphql-query-generator'
import {execute, gql} from '@apollo/client'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import {WebSocketLink} from '@apollo/client/link/ws'

const token = ``

function App() {
  const [link, setLink] = React.useState(null)
  const [d, setData] = React.useState([])

  function startSub() {
    let acked = 0
    let dataArr = []
    const wb = new WebSocket('ws://localhost:3020', 'graphql-ws')
    setLink(wb)
    wb.onopen = (e) => {
      console.log('opened')
      wb.send(JSON.stringify({ type: 'connect', url: '', token: token.trim(), headers: { 'x-ibm-client-id': '' } }))
    }
    wb.onmessage= (e) => {
      const data = JSON.parse(e.data)
      dataArr.push(e.data)
      console.log('dataArr', dataArr)
      setData([...dataArr])
      if(data.type === 'connection_ack') {
        if(acked === 0) {
          wb.send(JSON.stringify({
            type: "connection_init",
            payload: {}
          }))
          acked++
        } else if(acked === 1) {
          wb.send(JSON.stringify({
            type: 'start',
            payload: {
              query: `subscription {
                liveQuotes(stock: "IBM") {
                  lastPrice
                }
              }`
            }
          }))
          acked++
        }
      }
    }
    // const client = new SubscriptionClient('ws://localhost:3020', {
    //   reconnect: false,
    //   connectionCallback: (err) => {
    //     // default: subscription by payload
    //     const wsLink = new WebSocketLink(client)
    //     execute(wsLink, {
    //       query: gql`
    //       subscription {
    //         liveQuotes(stock: "IBM") {
    //           lastPrice
    //         }
    //       }
    //       `
    //     }).subscribe((obj) => {
    //       console.log('1', obj)
    //     })
    //   }
    // })
    // setLink(client)
  }

  function stop() {
    link.close()
    setData([])
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="display-panel">
          {d}
        </div>
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
