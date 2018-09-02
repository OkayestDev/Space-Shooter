import React, { PureComponent } from 'react'
import { StyleSheet, View, Animated } from 'react-native';
import EntitySizes from '../config/EntitySizes.js';
import DebugConfig from '../config/DebugConfig.js';
import SpriteSheet from 'rn-sprite-sheet';

export default class Collectible extends PureComponent {
    componentDidMount() {
        this.play('spin');
    }

    render() {
        return (
            <View style={[styles.collectible, {left: this.props.position[0], top: this.props.position[1]}]}>
                <SpriteSheet
                    ref={ref => (this.coin = ref)}
                    source={require('../assets/coins.png')}
                    columns={1}
                    rows={4}
                    height={25}
                    imageStyle={{marginTop: 0}}
                    animations={{
                        spin: [0, 1, 2, 3, 2, 1],
                    }}
                />
            </View>
        )
    }

    play = type => {
        this.coin.play({
            type,
            fps: 8,
            loop: true,
            resetAfterFinish: true,
        });
    }
}


const styles = StyleSheet.create({
    collectible: {
        position: 'absolute',
        backgroundColor: (DebugConfig.DEVELOPMENT ? 'white' : 'transparent'),
        width: 25,
        height: 24,
        borderRadius: EntitySizes.COLLECTIBLE_CIRCLE.radius,
    }
})