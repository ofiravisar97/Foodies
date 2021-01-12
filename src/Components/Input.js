import React from 'react';
import { TextInput, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../Colors';

/******************************************************
 ---------------- INPUT COMPONENT --------------------
 *******************************************************/

const Input = ({ placeholder, style, onChange, children, icon, windowStyle, ...props }) => {
    return (
        <View>
            <View style={{

                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: props.multiline ? 'flex-start' : 'center',
                backgroundColor: 'white',
                borderRadius: 10,
                marginVertical: 8,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
                ...windowStyle
            }}>
                <TextInput placeholder={placeholder}
                    style={{ flex: 1, color: 'black', textAlignVertical: 'top', padding: 8, ...style }}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    {...props}
                />
                <Ionicons name={icon} size={20} style={{ padding: 8 }} color={props.iconColor} />
            </View>
            { children}
        </View >
    );
}

export default Input;