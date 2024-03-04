import { gql } from '@apollo/client/core';
import { apolloClient } from './subscription_manager';
import 'cross-fetch/polyfill';
import { WebSocket } from "ws";

(global as any).WebSocket = WebSocket;


// Function to start listening to events
function startListening() {
    const SUBSCRIBE_TO_EVENT = gql`
        subscription {
          eventEmitted {
            id
            keys
            data
            transactionHash
          }
        }
    `;

    let client = apolloClient;
    console.log("client initialized");
    client.subscribe({ query: SUBSCRIBE_TO_EVENT }).subscribe({
      next(response) {
        console.log('Event received:', response.data.eventEmitted);
        // Handle the event data here
      },
      error(err) {
        console.error('Subscription error:', err);
      },
    });
}

startListening();
