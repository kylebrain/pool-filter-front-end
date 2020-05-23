import React from 'react';
import {Text} from 'native-base';
import moment from 'moment';

export interface CurrentTimer
{
    speed: number,
    start: string,
    end: string
}

interface DashboardInfo
{
    timer: CurrentTimer | null,
    error: {message:string}
}

export const CurrentSpeed : React.FC<{info : DashboardInfo}> = ({info}) => {    
    if (info.error.message != "") {
        return <Text>Error: {info.error.message}</Text>;
    } else if (info.timer != null) {
        if(info.timer.speed == 0)
        {
            return (
                <>
                    <Text>OFF</Text>
                    <Text>Next Timer: {moment(info.timer.end, 'HH:mm:ss').format('h:mma')} </Text>
                </>
            );
        
        } else {
            return (
                <>
                    <Text>Speed: {info.timer.speed}</Text>
                    <Text>Started: {moment(info.timer.start, 'HH:mm:ss').format('h:mma')}, Ends: {moment(info.timer.end, 'HH:mm:ss').format('h:mma')}</Text>
                </>
            );
        }
    } else {
        return <Text>Error loading current timer (logic error)</Text>
    }
}