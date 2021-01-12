import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../Button.js';
import Input from '../Input.js';

import firebase from 'firebase'
import 'firebase/firestore';

import { COLORS } from '../../Colors.js';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);


export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            nickname: '',
            emailErr: "Invalid Email.",
            passwordErr: "Password must contain atleast 6 characters.",
            nicknameErr: "Please insert a nickname.",
            validEmail: true,
            validPass: true,
            validNick: true,
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        if (!this.Validation()) {
            return
        }

        const { email, password, nickname } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                    nickname: nickname,
                    email: email,
                    lower_name: nickname.toLowerCase(),
                });
            }).catch((error) => {
                console.log(error)
            })
    }

    Validation() {
        // Email
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email)) {
            this.setState({ validEmail: true })
        } else {
            this.setState({ validEmail: false })
        }
        // Password
        if (this.state.password.length < 6) {
            this.setState({ validPass: false })
        } else {
            this.setState({ validPass: true })
        }
        // Nickname
        if (this.state.nickname == "") {
            this.setState({ validNick: false })
        } else {
            this.setState({ validNick: true })
        }

        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email) && this.state.password.length >= 6 && this.state.nickname.length > 0) {
            return true;
        } else { return false; }
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
                            {this.state.validEmail ? null : <Text style={styles.errText}>{this.state.emailErr}</Text>}
                        </Input>
                        <Input placeholder="Password:" windowStyle={styles.textInput}
                            icon="lock-closed"
                            onChange={password => this.setState({ password })} secureTextEntry={true}>
                            {this.state.validPass ? null : <Text style={styles.errText}>{this.state.passwordErr}</Text>}
                        </Input>
                        <Input placeholder="Nickname:" windowStyle={styles.textInput}
                            icon="person-circle"
                            onChange={nickname => this.setState({ nickname })}>
                            {this.state.validNick ? null : <Text style={styles.errText}>{this.state.nicknameErr}</Text>}
                        </Input>
                        <Button title="Register" btnStyle={styles.button} textStyle={styles.buttonText} onSignUp={this.onSignUp} />
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

export default Register;
