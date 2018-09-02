import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, StatusBar, ImageBackground, AsyncStorage } from 'react-native';
import Expo from 'expo';
import Player from './components/Player.js';
import Dimensions from 'Dimensions';
import { GameEngine } from 'react-native-game-engine';
import GameLogic from './GameLogic.js';
import TitleScreen from './views/TitleScreen.js';
import Info from './views/Info.js';
import Controls from './views/Controls.js';
import EndGameScreen from './views/EndGameScreen.js';
import Config from './config/Config.js';
import EntitySizes from './config/EntitySizes.js';

export default class App extends PureComponent {
    constructor(props) {
        super(props);
        this.screenX = Dimensions.get('window').width;
        this.screenY = Dimensions.get('window').height;
        this.playerWidth = 50;
        this.menuNavigation = new Expo.Audio.Sound();
        this.menuNavigation.loadAsync(require('./assets/sound_bits/menu_navigation.mp3'));
        this.state = {
            // Current Game Stats
            points: 0,
            coinsCollected: 0,
            shotsFired: 0,
            enemiesDestroyed: 0,
            playerHealth: Config.gameDefaults.playerHealth,

            // Player Stats
            highScore: 0,
            allEnemiesDestroyed: 0,
            allCoinsCollected: 0,

            shotsLeft: Config.gameDefaults.shotsLeft,
            hasGameStarted: false,
            hasGameEnded: false,
            isInfoOpen: false,
            isControlsOpen: false,
            causeOfEnd: '',
        };
    }
    
    componentDidMount = () => {
        this.GameLogic = new GameLogic(this.setState.bind(this));
        this.readerPlayerStats();
    }

    readerPlayerStats = () => {
        AsyncStorage.multiGet(['highScore', 'allEnemiesDestroyed', 'allCoinsCollected']).then(res => {
            let tempHighScore = 0;
            let tempAllEnemiesDestroyed = 0;
            let tempAllCoinsCollected = 0;

            // highScore
            if (res[0][1] !== null) {
                tempHighScore = String(res[0][1]);
            }
            // tempAllEnemiesDestroyed
            if (res[1][1] !== null) {
                tempAllEnemiesDestroyed = String(res[1][1]);
            }
            // tempAllCoinsCollected
            if (res[2][1] !== null) {
                tempAllCoinsCollected = String(res[2][1]);
            }

            this.setState({
                highScore: tempHighScore,
                allEnemiesDestroyed: tempAllEnemiesDestroyed,
                allCoinsCollected: tempAllCoinsCollected,
            })
        });
    }

    backToTitleScreen = () => {
        this.GameLogic.resetGame();
        this.setState({
            hasGameStarted: false,
            hasGameEnded: false,
            isInfoOpen: false,
            isControlsOpen: false,
            points: 0,
            coinsCollected: 0,
            shotsLeft: Config.gameDefaults.shotsLeft,
            playerHealth: Config.gameDefaults.playerHealth,
        });
    }

    render() {
        if (this.state.hasGameStarted)
        {
            return (
                <ImageBackground
                    source={require('./assets/space_background.png')}
                    style={{width: this.screenX, height: this.screenY}}
                >
                    <GameEngine
                        style={styles.gameContainer}
                        systems={[
                            this.GameLogic.gameLoop,
                            this.GameLogic.movePlayer,
                            this.GameLogic.fireProjectile,
                            this.GameLogic.chanceToSpawnEnemy,
                            this.GameLogic.chanceToSpawnFallingCollectible,
                            this.GameLogic.chanceToSpawnFallingHeart,
                            this.GameLogic.chanceToSpawnAsteroid,
                            this.GameLogic.playAgain,
                        ]}
                        entities={{
                            1: {
                                name: 'Player',
                                size: EntitySizes.PLAYER_SIZE,
                                circle: EntitySizes.PLAYER_CIRCLE,
                                health: this.state.playerHealth,
                                position: [this.screenX / 2 - this.playerWidth / 2, this.screenY - 100],
                                renderer: <Player/>
                            },
                            // @Dev to set static object, make sure entity doesn't have name an is in the visible field
                            // 2: {
                            //     position: [this.screenX / 3 - this.playerWidth / 2, this.screenY - 100],
                            //     renderer: <Projectile/>
                            // }
                        }}
                    >
                        <StatusBar hidden={true}/>
                        <EndGameScreen
                            playMenuNavigation={() => this.menuNavigation.replayAsync()}
                            points={this.state.points}
                            shotsFired={this.state.shotsFired}
                            enemiesDestroyed={this.state.enemiesDestroyed}
                            hasGameEnded={this.state.hasGameEnded} //@TODO this.state.hasGameEnded
                            playAgain={(value) => this.GameLogic.setPlayAgain(value)}
                            backToTitleScreen={() => this.backToTitleScreen()}
                        />
                    </GameEngine>
                </ImageBackground>
            );
        }
        else if (!this.state.hasGameStarted && !this.state.isInfoOpen && !this.state.isControlsOpen) {
            return (
                <View>
                    <StatusBar hidden={true}/>
                    <TitleScreen
                        playMenuNavigation={() => this.menuNavigation.replayAsync()}
                        startGame={() => this.setState({hasGameStarted: true})}
                        openControls={() => this.setState({isControlsOpen: true})}
                        openInfo={() => this.setState({isInfoOpen: true})}
                        allCoinsCollected={this.state.allCoinsCollected}
                        allEnemiesDestroyed={this.state.allEnemiesDestroyed}
                        highScore={this.state.highScore}
                    />
                </View>
            );
        }
        else if (!this.state.hasGameStarted && this.state.isInfoOpen) {
            return (
                <View>
                    <StatusBar hidden={true}/>
                    <Info
                        closeInfo={() => this.setState({isInfoOpen: false})}
                        playMenuNavigation={() => this.menuNavigation.replayAsync()}
                    />                     
                </View>
            )
        }
        else if (!this.state.hasGameStarted && this.state.isControlsOpen) {
            return(
                <View>
                    <StatusBar hidden={true}/>
                    <Controls
                        closeControls={() => this.setState({isControlsOpen: false})}
                        playMenuNavigation={() => this.menuNavigation.replayAsync()}
                    />                    
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    gameContainer: {
        zIndex: 0,
        position: 'relative',
        backgroundColor: 'transparent',
    },
});
