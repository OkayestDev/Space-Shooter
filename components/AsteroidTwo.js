import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default class AsteroidTwo extends PureComponent {
    render() {
        return (
            <View style={[styles.asteroid, {left: this.props.position[0], top: this.props.position[1]}]}>
                <Image
                    source={require('../assets/asteroid_two.png')}
                    style={{width: 64, height: 64}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    asteroid: {
        position: 'absolute',
        height: 64,
        width: 64,
    }
})