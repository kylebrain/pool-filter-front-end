import React from 'react';
import {View, Button, Text} from 'native-base'

export const Override : React.FC<{onSet: (speed: number) => void, onStop: () => void}> = ({onSet, onStop}) =>
{
    return(
        <View>
            <Button onPress={() => onSet(2)}><Text>Set Speed 2</Text></Button>
            <Button onPress={() => onStop()}><Text>Stop</Text></Button>
        </View>
    );
}