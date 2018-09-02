export default EntitySizes = {
    // Used for square collision testing and spatial hashing
    PLAYER_SIZE: [45, 30],
    ENEMY_SIZE: [45, 45],
    ENEMY_TWO_SIZE: [40, 40],
    ASTEROID_SIZE: [64, 64],
    PROJECTILE_SIZE: [25, 25],
    COLLECTIBLE_SIZE: [25, 24],
    HEART_SIZE: [32, 32],

    // Used for Circle collision testing
    PLAYER_CIRCLE: { 
        radius: 26.87, 
        width: 19,
        height: 19,
    },
    ASTEROID_CIRCLE: {
        radius: 26.87,
        width: 19,
        height: 19,
    },
    HEART_CIRCLE: {
        radius: 19.8,
        width: 14,
        height: 14,
    },
    ENEMY_CIRCLE: {
        radius: 19.09,
        width: 13.5,
        height: 13.5,
    },
    ENEMY_TWO_CIRCLE: {
        radius: 16.97,
        width: 12,
        height: 12,
    },
    COLLECTIBLE_CIRCLE : {
        radius: 19.8,
        width: 14,
        height: 14,
    }
}