import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';
import _ from 'lodash';

export default class PlayerExplosion extends PureComponent {
    componentDidMount() {
        this.play('explosion')
    }

    render() {
        return (
            <View style={[styles.explosion, {left: this.props.position[0] - 128, top: this.props.position[1] - 128}]}>
                <SpriteSheet
                    ref={ref => (this.explosion = ref)}
                    source={require('../assets/player_explosion.png')}
                    columns={8}
                    rows={6}
                    animations={{
                        explosion: _.range(0, 64),
                    }}
                />
            </View>
        )
    }

    play = (type) => {
        this.explosion.play({
            type,
            fps: 32,
            loop: false,
            resetAfterFinish: false,
        })
    }
}

const styles = StyleSheet.create({
    explosion: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'transparent',
    }
});

 