import Expo from 'expo';

// Preload sounds on object creation help with loading times
export default class Sounds {
    constructor() {
        this.playerDeath = new Expo.Audio.Sound();
        this.playerDeath.loadAsync(require('../assets/sound_bits/player_death.mp3'))

        this.enemyPlayerCollision = new Expo.Audio.Sound();
        this.enemyPlayerCollision.loadAsync(require('../assets/sound_bits/enemy_player_collision.mp3'));

        this.playerProjectile = new Expo.Audio.Sound();
        this.playerProjectile.loadAsync(require('../assets/sound_bits/player_projectile.mp3'));

        this.enemyProjectile = new Expo.Audio.Sound();
        this.enemyProjectile.loadAsync(require('../assets/sound_bits/enemy_projectile.mp3'));

        this.enemyProjectileCollision = new Expo.Audio.Sound();
        this.enemyProjectileCollision.loadAsync(require('../assets/sound_bits/enemy_projectile_collision.mp3'));

        this.playerCollectibleCollision = new Expo.Audio.Sound();
        this.playerCollectibleCollision.loadAsync(require('../assets/sound_bits/player_collectible_collision.mp3'))

        this.playerHeartCollision = new Expo.Audio.Sound();
        this.playerHeartCollision.loadAsync(require('../assets/sound_bits/player_heart_collision.mp3'));

        this.playerAsteroidCollision = new Expo.Audio.Sound();
        this.playerAsteroidCollision.loadAsync(require('../assets/sound_bits/player_asteroid_collision.mp3'));

        this.playerEProjectileCollision = new Expo.Audio.Sound();
        this.playerEProjectileCollision.loadAsync(require('../assets/sound_bits/player_eprojectile_collision.mp3'));

        this.playerOutOfAmmo = new Expo.Audio.Sound();
        this.playerOutOfAmmo.loadAsync(require('../assets/sound_bits/player_out_of_ammo.mp3'))
    }

    playPlayerDeath = () => {
        this.playerDeath.replayAsync();
    }

    playEnemyPlayerCollision = () => {
        this.enemyPlayerCollision.replayAsync();
    }

    playPlayerProjectile = () => {
        this.playerProjectile.replayAsync();
    }

    playEnemyProjectile = () => {
        this.enemyProjectile.replayAsync();
    }

    playEnemyProjectileCollision = () => {
        this.enemyProjectileCollision.replayAsync();
    }

    playPlayerCollectibleCollision = () => {
        this.playerCollectibleCollision.replayAsync();
    }

    playerPlayerHeartCollision = () => {
        this.playerHeartCollision.replayAsync();
    }

    playPlayerAsteroidCollision = () => {
        this.playerAsteroidCollision.replayAsync();
    }

    playPlayerEProjectileCollision = () => {
        this.playerEProjectileCollision.replayAsync();
    }

    playPlayerOutOfAmmo = () => {
        this.playerOutOfAmmo.replayAsync();
    }
}