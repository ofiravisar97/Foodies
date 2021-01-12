import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../Button.js';
import Input from '../Input.js';

import firebase from 'firebase'

import { COLORS } from '../../Colors.js';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);


export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.Login = this.Login.bind(this)

    }

    Login() {
        const { email, password, nickname } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
            }).catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.background}
                behavior={"postion"}
            >
                <LinearGradient
                    colors={[COLORS.primary, COLORS.accent]}
                    style={styles.background}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', textShadowColor: '#111', textShadowRadius: 10, textShadowOffset: { width: 1, height: 2 } }}> Foodies </Text>
                    </View>
                    <View style={styles.modal}>
                        <Text></Text>
                        <Input placeholder="Email:" windowStyle={styles.textInput}
                            icon="at"
                            onChange={email => this.setState({ email })}>
                        </Input>
                        <Input placeholder="Password:" windowStyle={styles.textInput}
                            icon="lock-closed"
                            onChange={password => this.setState({ password })} secureTextEntry={true}>
                        </Input>
                        <Button title="Login" btnStyle={styles.button} textStyle={styles.buttonText} onPress={Login} />
                        <TouchableOpacity style={{ marginTop: 8, justifyContent: 'center' }} onPress={() => this.props.navigation.navigate("Register")}>
                            <Text style={{ color: COLORS.primary, fontSize: 16 }}>Not signed yet ? Register here.</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        )
    }
}


const styles = StyleSheet.create({
    background: {
        justifyContent: "flex-end",
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    modal: {
        padding: 16,
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        backgroundColor: '#f8f8f8',
        width: screenWidth,
        height: screenHeight / 1.4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    button: {
        borderWidth: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    buttonText: {
        textAlign: "center",
        color: 'white',
        fontWeight: '300',
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        color: '#fefefe',
        borderColor: "#bebebe",
        borderRadius: 5,
        padding: 4,
        height: 50,
    },
    errText: {
        color: "#D44C4A",
        padding: 4,
    }
})

export default Login;
