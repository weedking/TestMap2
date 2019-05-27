/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    View,
    WebView
} from 'react-native';
import { Button } from 'antd-mobile-rn';

var GPS = {
    PI : 3.14159265358979324,
    x_pi : 3.14159265358979324 * 3000.0 / 180.0,
    delta : function (lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },

    //GPS---高德
    gcj_encrypt : function ( wgsLat , wgsLon ) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};

        var d = this.delta(wgsLat, wgsLon);
        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
    },
    outOfChina : function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat : function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon : function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
}

//获取设备的宽度和高度
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

export default class TestMap2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            longitude:'',//经度
            latitude:'',//纬度
            position:'深圳1',//位置名称
        };
    }

    componentWillMount = () => {
        this.getPositions();
    };



    getPositions=()=>{
        return new Promise(() => {
            /** 获取当前位置信息 */
            navigator.geolocation.getCurrentPosition(
                location => {
                    this.setState({
                        longitude: location.coords.longitude,//经度
                        latitude: location.coords.latitude,//纬度
                    });
                    //通过调用高德地图逆地理接口，传入经纬度获取位置信息
                    //`https://restapi.amap.com/v3/geocode/geo?key=7ac979dc2d03edcfba300ed3b34f6e98&location=${this.state.longitude},${this.state.latitude}&radius=1000&extensions=all&batch=false&roadlevel=0`
                    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=6242e86bdd67a603ef5cf7e47dad6b29&location=113.915690,22.534607&poitype=住宅&radius=1000&extensions=all&batch=false&roadlevel=0`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: ``
                        })
                        .then((response) => response.json())
                        .then((jsonData) => {
                            try {
                                this.setState({
                                    position:jsonData.regeocode.formatted_address,
                                    // position:jsonData.street,
                                    // position: jsonData[0],
                                });
                                // alert(jsonData.regeocode.formatted_address)
                            }catch (e) {

                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    //访问网络结束
                },
                error => {
                    console.error(error);
                }
            );

        })
    }


    render() {
        return (
            <View style={styles.container}>
                <WebView bounces={false}
                         scalesPageToFit={true}
                         source={{uri:"https://lbs.amap.com/fn/iframe/?id=879",method: 'GET'}}
                         style={{width:deviceWidth, height:deviceHeight}}>
                </WebView>
                <Text style={styles.instructions}>经度：{this.state.longitude}</Text>
                <Text style={styles.instructions}>纬度：{this.state.latitude}</Text>
                <Text style={styles.instructions}>当前位置：{this.state.position}</Text>
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