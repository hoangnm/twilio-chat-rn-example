/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import {create} from 'apisauce';
import DeviceInfo from 'react-native-device-info';
import Twilio, { Client } from 'twilio-chat';

const api = create({
  baseURL: 'http://localhost:3000'
});

export default class chatTwilio extends Component {

  initClicked = () => {
    api.post('/token', {
      identity: 'hoangnguyen',
      device: DeviceInfo.getUniqueID()
    }).then((response) => {
      // create twilio chat instance, with given token from api.
      const messagingClient = Twilio.create(response.data.token);
      messagingClient
        .then(function(client) {
          console.log('init success');

          // get public channels that we can join.
          client.getPublicChannelDescriptors()
          .then((channels) => {
            // information for each channel.
            channels.items.forEach((channel) => {
              console.log(channel.friendlyName);
              console.log(channel.status);
            });

            // try to join one channel.
            channels.items[5].getChannel()
            .then((c) => {
              c.join();
            });
          });

          // subscribe to events: when to join channel and when to receive new message.
          client.on('channelJoined', function(channel) {
            console.log('join');
            channel.on('messageAdded', (mess) => {
              console.log(mess);
            });
          });
        });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Init" onPress={this.initClicked}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('chatTwilio', () => chatTwilio);
