import React, { useState, useEffect } from 'react';
import {SERVER_NAME} from './App';
import { AppLoading } from 'expo';
import {Text, List, ListItem} from 'native-base';
import moment from 'moment';

interface PoolTimer
{
    id: number,
    speed: number,
    start: string,
    summer_duration: string,
    winter_duration: string
}

export const TimerList : React.FC = () => {
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