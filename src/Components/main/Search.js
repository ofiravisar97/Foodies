import React, { useState } from 'react'
import { View, FlatList, Dimensions, Text, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import firebase from 'firebase'
import Input from '../Input';
import { COLORS } from '../../Colors';
require('firebase/firestore')

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function Search({ navigation }) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users').where('lower_name', '>=', search.toString().toLowerCase())
            .get()
            .then((snapshot) => {
                let usersArray = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;

                    return { id, ...data }
                })
                setUsers(usersArray)
                console.log(usersArray);
            })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                height: height / 6.5,
                backgroundColor: COLORS.primary,
                width: width,
                alignItems: 'center',
                justifyContent: 'flex-end',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.39,
                shadowRadius: 8.30,

                elevation: 13,
            }}>
                <Input onChange={(search) => fetchUsers(search)} placeholder="Search Users..." icon="md-search" windowStyle={{
                    color: '#fefefe',
                    borderColor: "#bebebe",
                    borderRadius: 5,
                    padding: 4,
                    width: width / 1.05,
                    backgroundColor: "rgba(140, 187, 250, 0.48)",
                    marginBottom: 16,
                    elevation: 0,
                    shadowOpacity: 0
                }} iconColor={'white'} style={{ color: 'white' }} placeholderTextColor={'#efefef'} />
            </View>
            <FlatList numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    Platform.OS === 'android' ?
                        <TouchableNativeFeedback
                            onPress={() => navigation.navigate("Profile", { uid: item.id })}
                            background={TouchableNativeFeedback.Ripple(COLORS.primaryOpacity)}>
                            <View style={{ padding: 8, justifyContent: 'center', height: 50 }}>
                                <Text style={{ marginStart: 8, color: COLORS.primary }}>{item.nickname}</Text>
                            </View>
                        </TouchableNativeFeedback>
                        :
                        <TouchableOpacity activeOpacity={0.5}
                            onPress={() => navigation.navigate("Profile", { uid: item.id })}>
                            <View style={{ padding: 8, justifyContent: 'center', height: 50 }}>
                                <Text style={{ marginStart: 8, color: COLORS.primary }}>{item.nickname}</Text>
                            </View>
                        </TouchableOpacity>
                )}
            />
        </View>
    )
}
