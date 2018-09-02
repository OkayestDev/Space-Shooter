import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default class Projectile extends PureComponent {
    render() {
        return (
            <View style={[styles.projectile, {left: this.props.position[0], top: this.props.position[1]}]}>
                <Image
                    source={require('../assets/player_projectile.png')}
                    style={{width: 20, height: 40}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    projectile: {
        position: 'absolute',
        width: 44,
        height: 87,
        backgroundColor: 'transparent'
    }
})