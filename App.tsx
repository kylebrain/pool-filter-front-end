import React, { useState, useEffect } from 'react';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import { View, Linking } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, Grid, Row, Tab, Tabs } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

interface PoolTimer
{
    id: number,
    speed: number,
    start: string,
    summer_duration: string,
    winter_duration: string
}

interface CurrentTimer
{
    speed: number,
    start: string,
    end: string
}

const SERVER_NAME = 'http://192.168.4.32:5000';

const TimerList : React.FC = () => {
    const [error, setError] = useState<{message:string} | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<PoolTimer[]>([]);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch(SERVER_NAME + "/program/all")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    
    if (error) {
        return <Text>Error: {error.message}</Text>;
    } else if (!isLoaded) {
        return <AppLoading/>
    } else {
        return (
            <List>
                {items.map(item =>
                    <ListItem key={item.id.toString()}>
                        <Text>
                            Speed: {item.speed} - {moment(item.start, 'HH:mm:ss').format('h:mma')}
                        </Text>
                    </ListItem>)}
            </List>
        );
    }
}

const CurrentSpeed : React.FC = () => {
    const [error, setError] = useState<{message:string} | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [timer, setTimer] = useState<CurrentTimer | null>(null);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch(SERVER_NAME + "/program/now")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTimer(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    
    if (error) {
        return <Text>Error: {error.message}</Text>;
    } else if (!isLoaded) {
        return <AppLoading/>
    } else if (timer != null) {
        if(timer.speed == 0)
        {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text>OFF</Text>
                    <Text>Next Timer: {moment(timer.end, 'HH:mm:ss').format('h:mma')} </Text>
                </View>
            );
        
        } else {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Speed: {timer.speed}</Text>
                    <Text>Started: {timer.start}, Next Timer: {timer.end}</Text>
                </View>
            );
        }
    } else {
        return <Text>Error loading current timer (logic error)</Text>
    }
}

const App : React.FC = () => {

    let [fontsLoaded] = useFonts({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
        });    

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
                                <CurrentSpeed/>
                            </View>
                            <View style={{margin: 10, alignSelf: 'stretch'}}>
                                <Text>Override</Text>
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