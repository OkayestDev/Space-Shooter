import React from 'react';
import { AsyncStorage, AppState } from 'react-native';
import PlayerInfo from './views/PlayerInfo.js';
import GamePaused from './views/GamePaused.js';
import Player from './components/Player.js';
import PlayerProjectile from './components/PlayerProjectile.js';
import EnemyProjectile from './components/EnemyProjectile.js';
import EnemyShipOne from './components/EnemyShipOne.js';
import EnemyShipTwo from './components/EnemyShipTwo.js';
import Collectible from './components/Collectible.js';
import Heart from './components/Heart.js';
import PlayerExplosion from './components/PlayerExplosion.js';
import EnemyExplosion from './components/EnemyExplosion.js';
import PlayerCollision from './components/PlayerCollision.js';
import AsteroidOne from './components/AsteroidOne.js';
import AsteroidTwo from './components/AsteroidTwo.js';
import Dimensions from 'Dimensions';
import EntitySizes from './config/EntitySizes.js';
import Config from './config/Config.js';
import Sounds from './config/Sounds.js'; 
import _ from 'lodash';

export default class GameLogic {
    constructor(setState) {
        this.setState = setState;
        this.screenX = Dimensions.get('window').width;
        this.screenY = Dimensions.get('window').height;
        // Controls how many columns the screen is separated into for our spatial hash map
        // 20 seems optimal for most screen sizes
        this.SCREEN_DIVISIONS = 20;
        this.spatialHashMap = [];
        this.constructSpatialHashMap();
        this.Sounds = new Sounds();
        this.resetGame();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (newState) => {
        if (newState !== 'active') {
            this.gamePaused = true;
        }
    }

    constructSpatialHashMap = () => {
        for (let i = 0; i < this.SCREEN_DIVISIONS; i++) {
            this.spatialHashMap[i] = {};
        }
        // Add player to the initial hash map
        let defaultPlayer = this.defaultPlayer();
        this.addEntityToSpatialHashMap(defaultPlayer, 1);
    }

    figureSpatialHashMapIndexForEntity = (entity) => {
        if (entity && entity.position) {
            let mapWindow = this.screenX / this.SCREEN_DIVISIONS;
            let indexOne = Math.floor(entity.position[0] / mapWindow);
            let indexTwo = Math.floor((entity.position[0] + entity.size[0]) /  mapWindow);
            // entity falls more than one column;
            if (indexTwo !== indexOne) {
                let indexes = [];
                for (let i = indexOne; i !== indexTwo && i < this.SCREEN_DIVISIONS; i++) {
                    indexes.push(i);
                }
                return indexes;
            }
            // Object only falls into one column
            else {
                return indexOne;
            }
        }
    }

    // Adds an entity to our spatial hash map - at most an entity will fall into two columns
    addEntityToSpatialHashMap = (entities, id) => {
        let spatialHashMapIndex = this.figureSpatialHashMapIndexForEntity(entities[id]);
        // entity doesn't fit inside one column
        if (spatialHashMapIndex instanceof Array) {
            for (let i = 0; i < spatialHashMapIndex.length; i++) {
                this.spatialHashMap[spatialHashMapIndex[i]][id] = entities[id];
            }
        }
        else {
            this.spatialHashMap[spatialHashMapIndex][id] = entities[id];
        }
    }

    resetGame = () => {
        // Stats
        this.playAgainFlag = false,
        this.points = 0;
        this.shotsFired = 0;
        this.enemiesDestroyed = 0;
        this.coinsCollected = 0;
        this.playerHealth = Config.gameDefaults.playerHealth;
        this.shotsLeft = Config.gameDefaults.shotsLeft;

        this.showingGamePausedScreen = false;
        this.gamePaused = false;
        this.hasGameEnded = false;
        this.framesPlayed = 0; //framePlayed / 60 ~= seconds played
    }

    writePlayerStats = () => {
        AsyncStorage.multiGet(['highScore', 'allEnemiesDestroyed', 'allCoinsCollected']).then(res => {
            let tempHighScore = 0;
            let tempAllEnemiesDestroyed = 0;
            let tempAllCoinsCollected = 0;

            // highScore
            if (res[0][1] !== null && parseFloat(res[0][1]) > this.points) {
                tempHighScore = res[0][1];
            }
            else {
                tempHighScore = this.points;
            }

            // tempAllEnemiesDestroyed
            if (res[1][1] === null) {
                tempAllEnemiesDestroyed = this.enemiesDestroyed;
            }
            else {
                tempAllEnemiesDestroyed = parseFloat(res[1][1]) + this.enemiesDestroyed;
            }

            // tempAllCoinsCollected
            if (res[2][1] === null) {
                tempAllCoinsCollected = this.coinsCollected;
            }
            else {
                tempAllCoinsCollected = parseFloat(res[2][1]) + this.coinsCollected;
            }

            AsyncStorage.multiSet([
                ['highScore', String(tempHighScore)], 
                ['allEnemiesDestroyed', String(tempAllEnemiesDestroyed)], 
                ['allCoinsCollected', String(tempAllCoinsCollected)],
            ]);

            this.setState({
                highScore: tempHighScore,
                allEnemiesDestroyed: tempAllEnemiesDestroyed,
                allCoinsCollected: tempAllCoinsCollected,
            });
        });
    }

    // Returns the default state of our player
    defaultPlayer = () => {
        return {
            1: {
                name: 'Player',
                size: EntitySizes.PLAYER_SIZE,
                circle: EntitySizes.PLAYER_CIRCLE,
                health: 1,
                position: [this.screenX / 2 - 50 / 2, this.screenY - 100],
                renderer: <Player/>
            }
        }
    }

    /**
    * Given an object, compute the circle
    * @param circle object - contains x, y, radius of entities circle
    * @param position array - x, y of entity
    */
    computeCircle = (circle, position) => {
        let width = circle.width;
        let height = circle.height;
        let xOfCenter = .5 * width  + position[0];
        let yOfCenter = .5 * height + position[1];
        return {
            radius: circle.radius, 
            x: xOfCenter,
            y: yOfCenter,
        }
    }

    /**
    * Given two circles, computer where they are overlapping
    * @param circleOne object - { x, y, radius } where x, y is the center of the circle
    * @param circleTwo object - { x, y, radius } where x, y is the center of the circle
    */
    areCirclesColliding = (circleOne, circleTwo) => {
        let dx = circleOne.x - circleTwo.x;
        let dy = circleOne.y - circleTwo.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < circleOne.radius + circleTwo.radius) {
            return true;
        }
        return false;
    }

    /** Check if entity is in X bounds */
    isXInBounds = (xPosition, size) => {
        if (xPosition + size[0] > this.screenX || xPosition < 0) {
            return false;
        }
        return true;
    }

    /** Check if entity is in Y bounds */
    isYInBounds = (yPosition, size) => {
        if (yPosition + size[1] > this.screenY || yPosition < 0) {
            return false;
        }
        return true;
    }

    /** Check if entity is in X, Y bounds */
    isEntityInBounds = (entity) => {
        if (entity.position[0] + entity.size[0] > this.screenX || entity.position[0] < 0) {
            return false;
        }
        if (entity.position[1] > this.screenY || entity.position[1] < -10) {
            return false;
        }
        return true;
    }

    figureId = () => {
        let id = Math.random() * 100000000 + 1;
        return id;
    }

    isValidEntity = (entity) => {
        if (typeof entity !== 'undefined' &&
            'name' in entity && 
            'position' in entity &&
            'size' in entity) {
                return true;
        }
        else {
            return false;
        }
    }

    // searches in the corresponding spatial hash index for a collision
    checkForCollision = (entities, entity, idOfEntity) => {
        let entityKeys = [];
        let spatialHashMapIndex = this.figureSpatialHashMapIndexForEntity(entity);
        if (spatialHashMapIndex instanceof Array) {
            for (let i = 0; i < spatialHashMapIndex.length; i++) {
                entityKeys = entityKeys.concat(Object.keys(this.spatialHashMap[spatialHashMapIndex[i]]));
            }
        }
        else {
            entityKeys = Object.keys(this.spatialHashMap[spatialHashMapIndex]);
        }
        for (let index in entityKeys) {
            let id = entityKeys[index];
            // Skip id of current entity
            if (idOfEntity === id) {
                continue;
            }
            if (this.isValidEntity(entities[id])) {
                // Player, Collectible Collision
                if (entity.name.includes('Collectible') && entities[id].name === 'Player') {
                    let playerCircle = this.computeCircle(entities[id].circle, entities[id].position);
                    let collectibleCircle = this.computeCircle(entity.circle, entity.position);
                    if (this.areCirclesColliding(playerCircle, collectibleCircle)) {
                            this.Sounds.playPlayerCollectibleCollision();
                            this.points += Config.gameDefaults.pointsPerCollectible;
                            this.shotsLeft += Config.gameDefaults.shotsGainedPerCollectible;
                            this.coinsCollected++;
                            this.deleteEntity(idOfEntity, entities);
                            return entities;
                    }
                }
                // Player, Enemy Collision
                else if (entity.name.includes('Enemy') && entities[id].name === 'Player') {
                    let playerCircle = this.computeCircle(entities[id].circle, entities[id].position);
                    let enemyCircle = this.computeCircle(entity.circle, entity.position);
                    if (this.areCirclesColliding(playerCircle, enemyCircle)) {
                            let idOfExplosion = this.figureId();
                            // Check player health
                            if (entities[id].health <= 1) {
                                this.Sounds.playPlayerDeath();
                                this.hasGameEnded = true;
                                this.playerHealth--;
                                let newPlayerExplosion = {
                                    name: "PlayerExplosionSprite",
                                    position: [entities[id].position[0], entities[id].position[1]],
                                    renderer: <PlayerExplosion/>
                                }
                                entities[idOfExplosion] = newPlayerExplosion;
                                this.deleteEntity(idOfEntity, entities)
                                delete entities[id];
                                this.gameOver();
                                return entities
                            }
                            else {
                                this.Sounds.playEnemyPlayerCollision();
                                entities[id].health--;
                                this.playerHealth--;
                                let idOfExplosion = this.figureId();
                                let newPlayerCollision = {
                                    name: 'Sprite',
                                    position: [entity.position[0], entity.position[1]],
                                    frameSpawned: this.framesPlayed,
                                    renderer: <PlayerCollision/>
                                }
                                entities[idOfExplosion] = newPlayerCollision;
                                this.deleteEntity(idOfEntity, entities)
                                return entities;
                            }
                    }
                }
                // Enemy, Projectile collision (square collision)
                else if (entity.name === 'PlayerProjectile' && entities[id].name.includes('Enemy')) {
                    if (entities[id].position[0] < entity.position[0] + entity.size[0] &&
                        entities[id].position[0] + entities[id].size[0] > entity.position[0] &&
                        entities[id].position[1] < entity.position[1] + entity.size[1] &&
                        entities[id].position[1] + entities[id].size[1] > entity.position[1]) {
                            this.points += 10;
                            this.enemiesDestroyed++;
                            this.Sounds.playEnemyProjectileCollision();
                            // Has a chance to spawn a collectible at enemy's position
                            this.chanceToSpawnCollectible(entities, entities[id].position);
                            this.spawnEnemyExplosion(entities, entities[id].position);
                            this.deleteEntity(id, entities);
                            this.deleteEntity(idOfEntity, entities);
                            return entities;
                    }
                }
                // Player, Heart Collision
                else if (entity.name.includes('Heart') && entities[id].name === 'Player') {
                    let playerCircle = this.computeCircle(entities[id].circle, entities[id].position);
                    let heartCircle = this.computeCircle(entity.circle, entity.position);
                    if (this.areCirclesColliding(playerCircle, heartCircle)) {
                        this.Sounds.playerPlayerHeartCollision();
                        if (entities[id].health < Config.playerStats.maxHealth) {
                            entities[id].health++;
                            this.playerHealth++;
                        }
                        // Award player for being at full health and picking up a heart
                        else {
                            this.points += 50
                        }
                        this.deleteEntity(idOfEntity, entities);
                        return entities;
                    }
                }
                // Player, Asteroid Collision - asteroid deal 2 damage
                else if (entity.name.includes('Asteroid') && entities[id].name === 'Player') {
                    let asteroidCircle = this.computeCircle(entity.circle, entity.position);
                    let playerCircle = this.computeCircle(entities[id].circle, entities[id].position);
                    if (this.areCirclesColliding(asteroidCircle, playerCircle)) {
                        if (entities[id].health <= 2) {
                            this.Sounds.playPlayerDeath()
                            this.playerHealth = 0;
                            entities[id].health = 0;
                            this.hasGameEnded = true;
                            this.gameOver();
                            let idOfExplosion = this.figureId();
                            let newPlayerExplosion = {
                                name: "PlayerExplosionSprite",
                                position: [entities[id].position[0], entities[id].position[1]],
                                renderer: <PlayerExplosion/>
                            }
                            entities[idOfExplosion] = newPlayerExplosion;
                            this.deleteEntity(idOfEntity, entities);
                            delete entities[id];
                            return entities
                        }
                        else {
                            this.Sounds.playPlayerAsteroidCollision();
                            let idOfCollision = this.figureId();
                            let newPlayerCollision = {
                                name: 'Sprite',
                                position: [entity.position[0], entity.position[1]],
                                frameSpawned: this.framesPlayed,
                                renderer: <PlayerCollision/>
                            }
                            entities[idOfCollision] = newPlayerCollision;
                            this.playerHealth = this.playerHealth - 2;
                            entities[id].health = entities[id].health - 2;
                            this.deleteEntity(idOfEntity, entities);
                            return entities;
                        }
                    }
                }
                // Player, Enemy Projectile Collision - deals 1 damage
                else if (entity.name === 'EProjectile' && entities[id].name === 'Player') {
                    if (entities[id].position[0] < entity.position[0] + entity.size[0] &&
                        entities[id].position[0] + entities[id].size[0] > entity.position[0] &&
                        entities[id].position[1] < entity.position[1] + entity.size[1] &&
                        entities[id].position[1] + entities[id].size[1] > entity.position[1]) {
                            if (entities[id].health <= 1) {
                                this.Sounds.playPlayerDeath();
                                entities[id].health = 0;
                                this.playerHealth = 0;
                                entities[id].health = 0;
                                this.hasGameEnded = true;
                                this.gameOver();
                                let idOfExplosion = this.figureId();
                                let newPlayerExplosion = {
                                    name: "PlayerExplosionSprite",
                                    position: [entities[id].position[0], entities[id].position[1]],
                                    renderer: <PlayerExplosion/>
                                }
                                entities[idOfExplosion] = newPlayerExplosion;
                                this.deleteEntity(idOfEntity, entities);
                                delete entities[id];
                                return entities;
                            }
                            else {
                                this.Sounds.playPlayerEProjectileCollision();
                                let idOfCollision = this.figureId();
                                let newPlayerCollision = {
                                    name: 'Sprite',
                                    position: [entity.position[0], entity.position[1]],
                                    frameSpawned: this.framesPlayed,
                                    renderer: <PlayerCollision/>
                                }
                                entities[idOfCollision] = newPlayerCollision;
                                entities[id].health--;
                                this.playerHealth--;
                                this.deleteEntity(idOfEntity, entities);
                                return entities;
                            }
                    }
                }
            }
        }
        return false;
    }

    setPlayAgain = (playAgain) => {
        this.playAgainFlag = playAgain;
    }

    // deletes entity with given id from our entities and spatial hash map
    deleteEntity = (id, entities) => {
        let index = this.figureSpatialHashMapIndexForEntity(entities[id]);
        delete entities[id];
        // Entity falls into more than one column
        if (index instanceof Array) {
            for (let i = 0; i < index.length; i++) {
                delete this.spatialHashMap[index[i]][id];
            }
        }
        else {
            delete this.spatialHashMap[index][id];
        }
    }

    gameOver = () => {
        this.writePlayerStats();
        this.setState({
            hasGameEnded: true,
            points: this.points,
            playerHealth: this.playerHealth,
            shotsLeft: this.shotsLeft,
            shotsFired: this.shotsFired,
            enemiesDestroyed: this.enemiesDestroyed,
            coinsCollected: this.coinsCollected,
        });
    }

    resumeGame = (idOfGamePausedScreen, entities) => {
        delete entities[idOfGamePausedScreen];
        this.showingGamePausedScreen = false;
        this.gamePaused = false;
    }

    /***********/
    /* Systems */ 
    /***********/
    playAgain = (entities) => {
        if (this.playAgainFlag) {
            let newEntities = this.defaultPlayer();
            this.resetGame();
            this.constructSpatialHashMap();
            this.setState({
                hasGameStarted: true,
                hasGameEnded: false,
                points: Config.gameDefaults.points,
                playerHealth: Config.gameDefaults.playerHealth,
                shotsLeft: Config.gameDefaults.shotsLeft,
            });
            return newEntities;
        }
        return entities;
    }

    gameLoop = (entities) => {
        // If Starting a game, add playerInfo view to entities
        if (this.framesPlayed == 0) {
            entities[2] = {
                name: 'PlayerInfo',
                points: this.points,
                shotsLeft: this.shotsLeft,
                playerHealth: this.playerHealth,
                coinsCollected: this.coinsCollected,
                renderer: <PlayerInfo/>
            }
        }

        if (this.showingGamePausedScreen) {
            return entities;
        }
        else if (this.gamePaused) {
            let idOfGamePausedScreen = this.figureId();
            entities[idOfGamePausedScreen] = {
                name: 'GamePaused',
                resumeGame: () => this.resumeGame(idOfGamePausedScreen, entities),
                renderer: <GamePaused/>
            }
            this.showingGamePausedScreen = true;
            return entities;
        }

        let entityKeys = Object.keys(entities);
        for (let index in entityKeys) {
            let id = entityKeys[index];
            if (this.isValidEntity(entities[id]) && id !== 2) {
                if (entities[id].name === 'PlayerProjectile') {
                    if (this.isEntityInBounds(entities[id])) {
                        entities[id].position = [
                            entities[id].position[0],
                            entities[id].position[1] - 13,
                        ];
                    }
                    // Projectile is outside our screen size, destroy
                    else {
                        this.deleteEntity(id, entities);
                        continue;
                    }
                }
                else if (entities[id].name.includes('Enemy')) {
                    if (this.isEntityInBounds(entities[id])) {
                        entities[id].position = [
                            entities[id].position[0],
                            entities[id].position[1] + 5,
                        ]
                        this.chanceToFireEnemyProjectile(entities, [
                            entities[id].position[0] + 13, 
                            entities[id].position[1] + 25
                        ]);
                    }
                    else {
                        this.deleteEntity(id, entities)
                        continue;
                    }
                }
                else if (entities[id].name === 'CollectibleFalling') {
                    if (this.isEntityInBounds(entities[id])) {
                        entities[id].position = [
                            entities[id].position[0],
                            entities[id].position[1] + 2.5,
                        ]
                    }
                    else {
                        this.deleteEntity(id, entities)
                        continue;
                    }
                }
                else if (entities[id].name === 'HeartFalling') {
                    if (this.isEntityInBounds(entities[id])) {
                        entities[id].position = [
                            entities[id].position[0],
                            entities[id].position[1] + 5,
                        ];
                    }
                    else {
                        this.deleteEntity(id, entities);
                        continue;
                    }
                }
                else if (entities[id].name.includes('Asteroid')) {
                    if (this.isEntityInBounds(entities[id])) {
                        entities[id].position = [
                            entities[id].position[0],
                            entities[id].position[1] + 3,
                        ]
                    }
                    else {
                        this.deleteEntity(id, entities);
                        continue;
                    }
                }
                else if (entities[id].name.includes('Sprite')) {
                    // Delete entity after two seconds to ensure its animation has played out
                    // sprite named entities are not in spatial hash map, just delete
                    if (this.framesPlayed - entities[id].frameSpawned > 120) {
                        delete entities[id];
                        continue;
                    }
                }
                else if (entities[id].name === 'EProjectile') {
                    if (this.isEntityInBounds(entities[id])) {
                        entities[id].position = [
                            entities[id].position[0],
                            entities[id].position[1] + 9,
                        ]
                    }
                    else {
                        this.deleteEntity(id, entities);
                        continue;
                    }
                }
                if (!entities[id].name.includes('Sprite')) {
                    this.checkForCollision(entities, entities[id], id);
                }
            }
        }
        // Update playerInfo entity
        entities[2].playerHealth = this.playerHealth;
        entities[2].points = this.points;
        entities[2].shotsLeft = this.shotsLeft;
        entities[2].coinsCollected = this.coinsCollected;
        this.framesPlayed++;
        return entities;
    }

    // player always has an id of 1
    movePlayer = (entities, { touches }) => {
        if (this.gamePaused) {
            return entities;
        }
        if (!this.hasGameEnded) {
            touches.filter(touch => touch.type === 'move').forEach(touch => {
                let player = entities[1];
                let x = player.position[0];
                let y = player.position[1];
                // Delete player from current spatial hash then re-add after movement
                let currentSpatialHashMapIndex = this.figureSpatialHashMapIndexForEntity(player);
                if (currentSpatialHashMapIndex instanceof Array) {
                    for (let i = 0; i < currentSpatialHashMapIndex.length; i++) {
                        delete this.spatialHashMap[currentSpatialHashMapIndex[i]][1];
                    }
                }
                else {
                    delete this.spatialHashMap[currentSpatialHashMapIndex][1];
                }
                // Ensure player cannot move off the screen
                if (this.isXInBounds(player.position[0] + touch.delta.pageX, player.size)) {
                    x = player.position[0] + touch.delta.pageX;
                }
                if (this.isYInBounds(player.position[1] + touch.delta.pageY, player.size)) {
                    y = player.position[1] + touch.delta.pageY;
                }
                entities[1].position = [x, y];
                this.addEntityToSpatialHashMap(entities, 1);
            });
        }
        return entities;
    }

    chanceToFireEnemyProjectile = (entities, positionToSpawnProjectile) => {
        if (this.gamePaused) {
            return entities;
        }
        let chanceToSpawn = Math.random() * 1000;
        if (chanceToSpawn < 3) {
            this.Sounds.playEnemyProjectile();
            let idOfProjectile = this.figureId();
            let newEnemyProjectile = {
                name: 'EProjectile',
                position: positionToSpawnProjectile,
                size: EntitySizes.PROJECTILE_SIZE,
                renderer: <EnemyProjectile/>
            }
            entities[idOfProjectile] = newEnemyProjectile;
            this.addEntityToSpatialHashMap(entities, idOfProjectile);
        }
    }

    fireProjectile = (entities, { touches }) => {
        if (this.gamePaused) {
            return entities;
        }
        if (!this.hasGameEnded) {
            touches.filter(touch => touch.type === 'press').forEach(() => {
                if (this.shotsLeft <= 0) {
                    this.Sounds.playPlayerOutOfAmmo();
                    return entities;
                }
                this.Sounds.playPlayerProjectile();
                let newProjectile = {
                    name: 'PlayerProjectile',
                    size: EntitySizes.PROJECTILE_SIZE,
                    position: [entities[1].position[0] + 18, entities[1].position[1] - 30],
                    renderer: <PlayerProjectile/>
                }
                let id = this.figureId();
                entities[id] = newProjectile;
                this.addEntityToSpatialHashMap(entities, id);
                this.shotsLeft = this.shotsLeft - 1;
                this.shotsFired++;
            })
        }
        return entities;
    }

    spawnEnemyExplosion = (entities, position) => {
        let newExplosion = {
            name: "Sprite",
            position: position,
            frameSpawned: this.framesPlayed,
            renderer: <EnemyExplosion/>
        }
        let id = this.figureId();
        entities[id] = newExplosion;
        return entities;
    }

    // 5% chance to spawn enemy every frame base + another 1% chance every 30 seconds of game time (3600 frames === 1 minute)
    chanceToSpawnEnemy = (entities) => {
        if (this.gamePaused) {
            return entities;
        }
        let chanceToSpawn = Math.random() * 1000;
        if (chanceToSpawn < 50 + this.framesPlayed / 900) {
            let id = this.figureId();
            let newEnemy = {};
            enemyToSpawn = Math.floor(Math.random() * 2);
            if (enemyToSpawn === 0) {
                let randomX = Math.random() * (this.screenX - EntitySizes.ENEMY_SIZE[0]);
                newEnemy = {
                    name: 'EnemyOne',
                    size: EntitySizes.ENEMY_SIZE,
                    circle: EntitySizes.ENEMY_CIRCLE,
                    position: [randomX, 0],
                    renderer: <EnemyShipOne/>
                };
            }
            else {
                let randomX = Math.random() * (this.screenX - EntitySizes.ENEMY_TWO_SIZE[0]);
                newEnemy = {
                    name: 'EnemyTwo',
                    size: EntitySizes.ENEMY_TWO_SIZE,
                    circle: EntitySizes.ENEMY_TWO_CIRCLE,
                    position: [randomX, 0],
                    renderer: <EnemyShipTwo/>
                };
            }
            entities[id] = newEnemy;
            this.addEntityToSpatialHashMap(entities, id);
        }
        return entities;
    }

    // .7% chance to spawn every frame
    chanceToSpawnFallingCollectible = (entities) => {
        if (this.gamePaused) {
            return entities;
        }
        let chanceToSpawn = Math.random() * 1000;
        if (chanceToSpawn < 7) {
            let id = this.figureId();
            let randomX = Math.random() * (this.screenX - EntitySizes.COLLECTIBLE_SIZE[0]);
            let newCollectible = {
                name: 'CollectibleFalling',
                size: EntitySizes.COLLECTIBLE_SIZE,
                circle: EntitySizes.COLLECTIBLE_CIRCLE,
                position: [randomX, 0],
                renderer: <Collectible/>
            };
            entities[id] = newCollectible;
            this.addEntityToSpatialHashMap(entities, id);
        }
        return entities;
    }

    // .1% chance to spawn every frame
    chanceToSpawnFallingHeart = (entities) => {
        if (this.gamePaused) {
            return entities;
        }
        let chanceToSpawn = Math.random() * 1000;
        if (chanceToSpawn < 1) {
            let id = this.figureId();
            let randomX = Math.random() * (this.screenX - EntitySizes.HEART_SIZE[0]);
            let newHeart = {
                name: 'HeartFalling',
                size: EntitySizes.HEART_SIZE,
                circle: EntitySizes.HEART_CIRCLE,
                position: [randomX, 0],
                renderer: <Heart/>
            };
            entities[id] = newHeart;
            this.addEntityToSpatialHashMap(entities, id);
        }
        return entities;
    }

    // 10% chance to spawn collectible on enemy kill
    chanceToSpawnCollectible = (entities, enemyPosition) => {
        if (this.gamePaused) {
            return entities;
        }
        let chanceToSpawn = Math.random() * 1000;
        if (chanceToSpawn < 100) {
            let id = this.figureId();
            let newCollectible = {
                name: 'Collectible',
                size: EntitySizes.COLLECTIBLE_SIZE,
                circle: EntitySizes.COLLECTIBLE_CIRCLE,
                position: [enemyPosition[0], enemyPosition[1]],
                renderer: <Collectible/>
            }
            entities[id] = newCollectible;
            this.addEntityToSpatialHashMap(entities, id);
        }
        return entities;
    }

    chanceToSpawnAsteroid = (entities) => {
        if (this.gamePaused) {
            return entities;
        }
        let chanceToSpawn = Math.random() * 1000;
        if (chanceToSpawn < 15 + this.framesPlayed / 900) {
            let id = this.figureId();
            let randomX = Math.random() * (this.screenX - EntitySizes.ASTEROID_SIZE[0]);
            // Flip a coin to see which asteroid to spawn, 0 or 1
            let newAsteroid = {};
            let asteroidToSpawn = Math.floor(Math.random() * 2);
            if (asteroidToSpawn === 0) {
                newAsteroid = {
                    name: 'AsteroidOne',
                    size: EntitySizes.ASTEROID_SIZE,
                    circle: EntitySizes.ASTEROID_CIRCLE,
                    position: [randomX, 0],
                    renderer: <AsteroidOne/>
                }
            }
            else {
                newAsteroid = {
                    name: 'AsteroidTwo',
                    size: EntitySizes.ASTEROID_SIZE,
                    circle: EntitySizes.ASTEROID_CIRCLE,
                    position: [randomX, 0],
                    renderer: <AsteroidTwo/>
                }
            }
            entities[id] = newAsteroid;
            this.addEntityToSpatialHashMap(entities, id);
        }
        return entities;
    }
}