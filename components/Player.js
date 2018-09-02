import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import EntitySizes from '../config/EntitySizes.js';
import DebugConfig from '../config/DebugConfig.js';
import SpriteSheet from 'rn-sprite-sheet';
import _ from 'lodash';

export default class Player extends PureComponent {
    // componentDidMount() {
    //     this.play('exhaust');
    // }

    render() {
        return (
            <View 
                style={[styles.player, {left: this.props.position[0], top: this.props.position[1]}]}
            >
            {
                DebugConfig.DEVELOPMENT && 
                <Text style={{color: 'white'}}>
                    x: {this.props.position[0].toFixed() + '\n'}
                    y: {this.props.position[1].toFixed() + '\n'}
                </Text>
            }
                <Image 
                    source={require('../assets/player_large.png')}
                    style={{width: 56, height: 56}}
                />
                {/* <View style={styles.exhaust}>
                    <SpriteSheet
                        ref={ref => (this.exhaust = ref)}
                        source={require('../assets/exhaust.png')}
                        columns={12}
                        rows={6}
                        imageStyle={{width: 45, height: 45}}
                        animations={{
                            exhaust: _.range(0, 72)
                        }}
                    />
                </View> */}
            </View>
        )
    }

    // play = type => {
    //     this.exhaust.play({
    //         type,
    //         fps: 20,
    //         loop: true,
    //     })
    // }
}

const styles = StyleSheet.create({
    player: {
        position: 'absolute',
        width: 54,
        height: 54,
        backgroundColor: (DebugConfig.DEVELOPMENT ? 'red' : 'transparent'),
        borderRadius: EntitySizes.PLAYER_CIRCLE.radius,
    },
    exhaust: {
        position: 'absolute',
        zIndex: 1,
        width: 120, 
        height: 120,
    }
})