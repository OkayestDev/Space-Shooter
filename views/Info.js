import React, { Component } from 'react';
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, Image } from 'react-native';
import Dimensions from 'Dimensions';
import { AdMobBanner } from 'expo';
import Config from '../config/Config.js';

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
                <View style={styles.infoScreenContainer}>
                    <View style={styles.infoItem}>
                        <Image
                            source={require('../assets/coin.png')}
                            style={styles.coinImage}
                        />
                        <Text style={styles.infoText}>
                            A shiny coin. Collect one to gain {Config.gameDefaults.pointsPerCollectible} and gain an additional {Config.gameDefaults.shotsGainedPerCollectible} shots...it makes sense...don't think about it.
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Image
                            source={require('../assets/enemy_ship.png')}
                            style={styles.enemyShipImage}
                        />
                        <Text style={styles.infoText}>
                            An enemy ship. Don't fly into one. They'll shoot at you. You know, enemy stuff.
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Image
                            source={require('../assets/heart.png')}
                            style={styles.heartImage}
                        />
                        <Text style={styles.infoText}>
                            A heart. Pick one up to gain 1 life point. Or if at full life, a whopping 50 points.
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Image
                            source={require('../assets/asteroid_two.png')}
                            style={styles.asteroidImage}
                        />
                        <Text style={styles.infoText}>
                            It's just an asteroid...don't run into it, maybe?
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => {
                            this.props.playMenuNavigation();
                            this.props.closeInfo();
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
    infoScreenContainer: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'lightgrey',
        opacity: .7,
        position: 'absolute',
        width: screenX * .9,
        height: screenY * .85,
        top: '10%',
        left: '5%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoImageContainer: {
        width: 64,
        height: 64,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Ensure image width total is 64 (the cap of our image sizes)
    coinImage: {
        width: 40,
        height: 40,
        marginLeft: 12,
        marginRight: 12,
    },
    enemyShipImage: {
        width: 48,
        height: 48,
        marginLeft: 8,
        marginRight: 8,
    },
    heartImage: {
        width: 40,
        height: 40,
        marginLeft: 12,
        marginRight: 12,
    },
    asteroidImage: {
        width: 64,
        height: 64,
    },
    infoItem: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
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