import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Dimensions from 'Dimensions';

export default class GamePaused extends Component {
    render() {
        return (
            <View style={styles.GamePausedScreen}>
                <Text style={styles.gamePausedText}>Game Paused</Text>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => this.props.resumeGame()}
                >
                    <Text>Resume Game</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    GamePausedScreen: {
        position: 'absolute',
        top: "30%",
        left: "22.5%",
        height: .3 * Dimensions.get('window').height,
        width: .55 * Dimensions.get('window').width,
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'lightgrey',
        opacity: .7,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gamePausedText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 26,
        paddingBottom: 10,
    },
    buttonContainer: {
        width: screenX * .3,
        height: 40,
        borderRadius: 4,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});