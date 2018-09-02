import React, { Component } from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import { AdMobBanner } from 'expo';
import Dimensions from 'Dimensions';

const screenX = Dimensions.get('window').width;
const screenY = Dimensions.get('window').height;

export default class EndGameScreen extends Component {
    render() {
        return (
            <Modal
                style={styles.EndGameScreen}
                animationType="fade"
                transparent={true}
                visible={this.props.hasGameEnded}
                onRequestClose={() => this.props.backToTitleScreen()}
            >
                <View style={styles.EndGameScreen}>
                    <Text style={styles.ohDearText}>
                        Oh Dear, You've Died
                    </Text>
                    <Text style={styles.infoText}>
                        Final Points: {this.props.points}
                    </Text>
                    <Text style={styles.infoText}>
                        Enemies Destroyed: {this.props.enemiesDestroyed}
                    </Text>
                    <Text style={styles.infoText}>
                        Shots Fired: {this.props.shotsFired}
                    </Text>
                    <Text style={styles.infoText}>
                        Accuracy: 
                        {
                            this.props.shotsFired === 0
                            ?
                            " 0%"
                            :
                            " " + (this.props.enemiesDestroyed / this.props.shotsFired * 100).toFixed(2) + '%'
                        }
                    </Text>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => {
                            this.props.playMenuNavigation();
                            this.props.playAgain(true);
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Play Again?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => {
                            this.props.playMenuNavigation();
                            this.props.backToTitleScreen();
                        }}
                    >
                        <Text>
                            Back To Title Screen
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.adMobBanner}>
                    <AdMobBanner
                        bannerSize="fullBanner"
                        adUnitID="ca-app-pub-5830175342552944/8024421682"
                        testDeviceID="EMULATOR"
                    />
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    EndGameScreen: {
        backgroundColor: "grey",
        position: 'absolute',
        top: "25%",
        left: "10%",
        height: .5 * Dimensions.get('window').height,
        width: .8 * Dimensions.get('window').width,
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'lightgrey',
        opacity: .7,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ohDearText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 24,
    },
    infoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    buttonContainer: {
        width: screenX * .5,
        height: 40,
        borderRadius: 4,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adMobBanner: {
        position: 'absolute',
        bottom: 0,
        width: screenX,
        height: 60,
    }
});