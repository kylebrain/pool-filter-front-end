import React, { useState, useEffect } from 'react';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import { View, Linking } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, Grid, Row, Tab, Tabs } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useFetch } from './useFetch';
import { Override } from './Override';
import { TimerList } from './TimerList';
import { CurrentSpeed, CurrentTimer } from './CurrentSpeed';

export const SERVER_NAME = 'http://192.168.4.32:5000';

const App : React.FC = () => {

    let [fontsLoaded] = useFonts({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
        });

    const [timer, isLoaded, error, reload] = useFetch<CurrentTimer>(SERVER_NAME + "/program/now")

    const handleSet = (speed: number) => {
        fetch(SERVER_NAME + "/override?speed=" + speed.toString() + "&duration=00:00:20", {method: "PUT"})
            .then(res => res.json())
            .then(
                (result) =>
                {
                    console.log(result.message)
                    // API should change the speed before serving
                    setTimeout(() => reload(), 1000)
                },
                (error) => {
                    console.error("Override error: " + error.message)
                }
            )
    }

    const handleStop = () => {
        fetch(SERVER_NAME + "/override?speed=0", {method: "PUT"})
            .then(res => res.json())
            .then(
                (result) =>
                {
                    console.log(result.message)
                    // API should change the speed before serving
                    setTimeout(() => reload(), 1000)
                },
                (error) => {
                    console.error("Override error: " + error.message)
                }
            )
    }

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return(
            <Container>
                <Header hasTabs>
                <Left>
                    <Button transparent>
                        <Icon name='cup' type='MaterialCommunityIcons' style={{color: 'white'}}/>
                    </Button>
                </Left>
                <Body>
                    <Title>Pool Slick</Title>
                </Body>
                <Right />
                </Header>
                <Tabs>
                    <Tab heading="Dashboard">
                        <View style={{flex: 1, margin: 10}}>
                            <View style={{margin: 10, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                {isLoaded && <CurrentSpeed info={{timer:timer, error:error}}/>}
                            </View>
                            <View style={{margin: 10, alignSelf: 'stretch'}}>
                                <Override onSet={handleSet} onStop={handleStop}/>
                            </View>
                        </View>
                    </Tab>
                    <Tab heading="Timers">
                        <View style={{flex: 1, margin: 10}}>
                            <Text>Welcome to Timers!</Text>
                            <TimerList/>
                        </View>
                    </Tab>
                    <Tab heading="Settings">
                        <View style={{flex: 1, margin: 10}}>
                            <Text>Welcome to Settings!</Text>
                        </View>
                    </Tab>
                </Tabs>
                <Footer>
                <FooterTab>
                    <Button full onPress={ ()=>{ Linking.openURL('https://github.com/kylebrain')}}>
                    <Text>By Kyle Brainard</Text>
                    </Button>
                </FooterTab>
                </Footer>
            </Container>
        );
    }
} 

export default App;