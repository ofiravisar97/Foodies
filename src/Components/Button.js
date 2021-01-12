import React from 'react'
import { Platform, TouchableOpacity, TouchableNativeFeedback, Text } from 'react-native'
import { COLORS } from '../Colors.js'
import { LinearGradient } from 'expo-linear-gradient';

/******************************************************
 ---------------- BUTTON COMPONENT --------------------
 *******************************************************/


const Button = ({ title, btnStyle, textStyle, onSignUp, ...props }) => {
    return (
        Platform.OS === 'android' ?
            <TouchableNativeFeedback useForeground={true}
                onPress={onSignUp}
                background={TouchableNativeFeedback.Ripple(COLORS.primaryOpacity)}
                style={btnStyle}>
                <LinearGradient colors={[COLORS.primary, COLORS.accent]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: -1, y: -2.5 }}
                    style={{
                        width: props.width,
                        height: 45
                        , borderRadius: 5,
                        padding: 4,
                        justifyContent: 'center',
                        marginTop: 16,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }}
                >
                    <Text style={textStyle}> {title} </Text>
                </LinearGradient>
            </TouchableNativeFeedback>
            :
            <TouchableOpacity activeOpacity={0.5}
                onPress={onSignUp}
                style={btnStyle}>
                <LinearGradient colors={[COLORS.primary, COLORS.accent]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: -1, y: -2.5 }}
                    style={{
                        width: "100%",
                        height: 45
                        , borderRadius: 5,
                        padding: 4,
                        justifyContent: 'center',
                    }}
                >
                    <Text style={textStyle}> {title} </Text>
                </LinearGradient>
            </TouchableOpacity>
    )
}

export default Button;