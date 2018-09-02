import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';
import _ from 'lodash';

export default class EnemyPlayerCollision extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hideSprite: false,
        }
    }

    componentDidMount() {
        this.play('explosion');
    }

    render() {
        return (
            <View style={[styles.explosion, {left: this.props.position[0], top: this.props.position[1] + 10}] }>
            {
                !this.state.hideSprite &&
                <SpriteSheet
                    ref={ref => (this.explosion = ref)}
                    source={require('../assets/enemy_player_collision.png')}
                    columns={8}
                    rows={8}
                    width={64}
                    animations={{
                        explosion: (_.range(0, 64)).concat([0])
                    }}
                />
            }
            </View>
        );
    }

    play = (type) => {
        this.explosion.play({
            type,
            fps: 32,
            loop: false,
            resetAfterFinish: false,
            onFinish: () => this.setState({hideSprite: true})
        })
    }
}

const styles = StyleSheet.create({
    explosion: {
        position: 'absolute',
        width: 64,
        height: 64,
        backgroundColor: 'transparent',
    }
})