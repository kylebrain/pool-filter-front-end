import React, { Component, useState, useEffect } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    FlatList,
} from 'react-native'

interface PoolTimer
{
    "id": number,
    "speed": number,
    "start": string,
    "summer_duration": string,
    "winter_duration": string
}

const TimerList : React.FC = () => {
    const [error, setError] = useState<{message:string} | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<PoolTimer[]>([]);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch("http://localhost:5000/program/all")
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
        return <Text>Loading...</Text>;
    } else {
        return (
            <FlatList
                data={items}
                renderItem={({item}) => <Text>{item.speed} - {item.start}</Text>}>
            </FlatList>
        );
    }
}

const App : React.FC = () => {
    return <View style={[styles.center, {top: 50}]}><TimerList/></View>
}

const styles = StyleSheet.create({
    center: {
      alignItems: 'center'
    }
  })
  

export default App;