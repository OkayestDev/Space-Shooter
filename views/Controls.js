import React, { Component } from 'react';
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { AdMobBanner } from 'expo';
import Dimensions from 'Dimensions';

const screenX = Dimensions.get('window').width;
const screenY = Dimensions.get('window').height;

export default class Info extends Component {
    render() {
        return(
            <ImageBackground
                source={require('../assets/space_background.png')}
                style={{width: screenX, height: screenY}}
            >
                <View style={styles.isJustGameContainer}>
                    <Text style={styles.isJustGameText}>Is Just Game</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Space Shooter</Text>
                </View>
                <View style={styles.controlsScreenContainer}>
                    <Text style={styles.controlsText}>
                        Drag your finger around the screen to move your ship.
                    </Text>
                    <Text style={styles.controlsText}>
                        Tap the screen to shoot. Careful, though, you have a limited number of shots.
                    </Text>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => {
                            this.props.playMenuNavigation();
                            this.props.closeControls();
                        }}
                    >
                        <Text>
                            Back to Title Screen
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
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    isJustGameContainer: {
        position: 'absolute',
        width: screenX * .8,
        left: '10%',
        top: 0,
    },
    isJustGameText: {
        color: 'white',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    titleContainer: {
        position: 'absolute',
        width: .8 * this.screenX,
        top: 35,
        left: '10%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        fontSize: 36,
    },
    controlsScreenContainer: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'lightgrey',
        opacity: .7,
        position: 'absolute',
        width: screenX * .8,
        height: screenY * .55,
        top: '25%',
        left: '10%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    controlsText: {
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
})