import React, { PureComponent } from 'react'
import { Image } from 'react-native'

export default class Heart extends PureComponent {
    render() {
        return (
            <Image
                source={require('../assets/heart.png')}
                style={{width: 32, height: 32, position: 'absolute', left: this.props.position[0], top: this.props.position[1]}}
            /> 
        )
    }
}