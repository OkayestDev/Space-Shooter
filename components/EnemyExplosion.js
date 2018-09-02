import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

export default class EnemyExplosion extends PureComponent {
    componentDidMount() {
        this.play('explosion')
    }

    render() {
        return (
            <View style={[styles.explosion, {left: this.props.position[0] - 5, top: this.props.position[1] - 5}]}>
                <SpriteSheet
                    ref={ref => (this.explosion = ref)}
                    source={require('../assets/explosion.png')}
                    columns={4}
                    rows={4}
                    height={64}
                    imageStyle={{marginTop: 0}}
                    animations={{
                        explosion: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                    }}
                />
            </View>
        )
    }

    play = type => {
        this.explosion.play({
            type,
            fps: 16,
            loop: false,
            resetAfterFinish: false,
        })
    }
}

const styles = StyleSheet.create({
    explosion: {
        position: 'absolute',
        zIndex: 1,
        width: 64,
        height: 64,
        backgroundColor: 'transparent',
    }
})