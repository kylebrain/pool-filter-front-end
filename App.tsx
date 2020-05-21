import React, { useState, useEffect } from 'react';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import { View, Linking } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, List, ListItem, Grid, Row, Tab, Tabs } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

interface PoolTimer
{
    id: number,
    speed: number,
    start: string,
    summer_duration: string,
    winter_duration: string
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
                {items.map(item => <ListItem key={item.id.toString()}><Text>{item.speed} - {item.start}</Text></ListItem>)}
            </List>
        );
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
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF'}}>
                            <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', backgroundColor:'#F5FCFF'}}>
                                <Text>Section 1</Text>
                                <TimerList/>
                            </View>
                            <View style={{flex:1, alignSelf: 'stretch', backgroundColor:'#F5FCFF'}}>
                                <Text>Section 2</Text>
                                <TimerList/>
                            </View>
                        </View>
                    </Tab>
                    <Tab heading="Timers">
                        <Text>Welcome to Timers!</Text>
                    </Tab>
                    <Tab heading="Settings">
                    <Text>Welcome to Settings!</Text>
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