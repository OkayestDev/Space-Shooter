import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import EntitySizes from '../config/EntitySizes.js';
import DebugConfig from '../config/DebugConfig.js';

// Frills of enemy causing some weird collisions
export default class EnemyShipOne extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            shipToSpawn: Math.floor(Math.random() * 7),
        }
    }

    render() {
        return (
            <View style={[styles.enemy, {left: this.props.position[0], top: this.props.position[1]}]}>
                <Image
                    source={require("../assets/enemy_ship.png")}
                    style={{width: 45, height: 45, transform: [{rotate: '180deg'}]}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    enemy: {
        position: 'absolute',
        width: 45,
        height: 45,
        borderRadius: EntitySizes.ENEMY_CIRCLE.radius,
        backgroundColor: (DebugConfig.DEVELOPMENT ? 'purple' : 'transparent'),
    }
})