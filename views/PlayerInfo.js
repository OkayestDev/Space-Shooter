import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Dimensions from 'Dimensions';
import Config from '../config/Config.js';

this.screenX = Dimensions.get('window').width;
this.screenY = Dimensions.get('window').height;

export default class PlayerInfo extends Component {
    constructor(props) {
        super(props)
    }

    renderHealthBar = () => {
        let healthBar = [];
        for (let i = 0; i < Config.playerStats.maxHealth; i++) {
            let style = [styles.healthBarSegment];
            if (i === 0) {
                style.push(styles.firstHealthBarSegment);
            }
            if (i === Config.playerStats.maxHealth - 1) {
                style.push(styles.lastHealthBarSegment)
            }
            if (i < this.props.playerHealth) {
                style.push({backgroundColor: 'red'});
            }
            else {
                style.push({backgroundColor: 'white'});
            }
            healthBar.push(
                <View
                    key={i}
                    style={style}
                />
            );
        }
        return (
            <View style={styles.healthBar}>
                <Image
                    source={require('../assets/heart.png')}
                    style={{width: 25, height: 25, marginRight: 5}}
                />
                {healthBar}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.playerInfo}>
                <View style={styles.innerContainer}>
                    <View style={styles.pointsContainer}>
                        <Text style={[styles.playerInfoText, {flex: 1, flexWrap: 'nowrap'}]}>
                            {this.props.points}
                        </Text>
                    </View>
                    <View style={styles.shotsLeftContainer}>
                        <Image
                            source={require('../assets/player_projectile.png')}
                            style={{width: 25, height: 40}}
                        />
                        <Text style={styles.playerInfoText}>
                            {this.props.shotsLeft}
                        </Text>
                    </View>
                    <View style={styles.coinsCollectedContainer}>
                        <Image
                            source={require('../assets/coin.png')}
                            style={{width: 20, height: 20}}
                        />
                        <Text style={styles.playerInfoText}>
                            {this.props.coinsCollected}
                        </Text>
                    </View>
                </View>
                {this.renderHealthBar()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    playerInfo: {
        width: this.screenX,
        height: 'auto',
        position: 'absolute',
        top: 0,
    },
    innerContainer: {
        backgroundColor: 'transparent',
        width: .9 * this.screenX,
        height: 40,
        position: 'absolute',
        left: '5%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsContainer: {
        width: this.screenX * .33 * .9,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    shotsLeftContainer: {
        width: this.screenX * .33 * .9,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinsCollectedContainer: {
        width: this.screenX * .33 * .9,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    playerInfoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    healthBar: {
        width: .9 * this.screenX,
        position: 'absolute',
        left: "5%",
        top: 40,
        height: 25,
        flexDirection: 'row',
    },
    healthBarSegment: {
        width: .9 * this.screenX * Config.playerStats.maxHealth / 10,
        borderColor: 'black',
        borderRightWidth: .5,
        borderRightColor: 'black',
    },
    firstHealthBarSegment: {
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
    },
    lastHealthBarSegment: {
        borderRightWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
    }
});
