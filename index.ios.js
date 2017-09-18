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
      const messagingClient = Twilio.create(response.data.token);
      messagingClient
        .then(function(client) {
          console.log('init success');
          client.getPublicChannelDescriptors()
          .then((channels) => {
            channels.items.forEach((channel) => {
              console.log(channel.friendlyName);
              console.log(channel.status);
            });
            channels.items[5].getChannel()
            .then((c) => {
              c.join();
            });
          });

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
