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
  View
} from 'react-native';
import { Button } from 'antd-mobile-rn';

var Geolocation = require('Geolocation');
//监听定位的id
var watchID = null

export default class TestMap2 extends Component {
  //获取位置
  getLocation() {
    Geolocation.getCurrentPosition(
        location => {
          var result = "速度：" + location.coords.speed +
              "\n经度：" + location.coords.longitude +
              "\n纬度：" + location.coords.latitude +
              "\n准确度：" + location.coords.accuracy +
              "\n行进方向：" + location.coords.heading +
              "\n海拔：" + location.coords.altitude +
              "\n海拔准确度：" + location.coords.altitudeAccuracy +
              "\n时间戳：" + location.timestamp;
          alert(result);

        },
        error => {
          alert("获取位置失败："+ error);
        }
    );
  }

  //开始监听位置变化
  beginWatch() {
    watchID = Geolocation.watchPosition(
        location => {
          var result = "速度：" + location.coords.speed +
              "\n经度：" + location.coords.longitude +
              "\n纬度：" + location.coords.latitude +
              "\n准确度：" + location.coords.accuracy +
              "\n行进方向：" + location.coords.heading +
              "\n海拔：" + location.coords.altitude +
              "\n海拔准确度：" + location.coords.altitudeAccuracy +
              "\n时间戳：" + location.timestamp;
          alert(result);
        },
        error => {
          alert("获取位置失败："+ error)
        }
    );
  }

  //停止监听位置变化
  stopWatch() {
    Geolocation.clearWatch(watchID);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Button onClick={this.getLocation.bind(this)}>获取位置</Button>
        <Button onClick={this.beginWatch.bind(this)}>开始监听</Button>
        <Button onClick={this.stopWatch.bind(this)}>停止监听</Button>


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
  item:{
    margin:15,
    height:30,
    borderWidth:1,
    padding:6,
    borderColor:'#ddd',
    textAlign:'center'
  },
});

AppRegistry.registerComponent('TestMap2', () => TestMap2);
