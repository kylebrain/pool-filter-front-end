import React, { useState, useEffect } from 'react';
import SERVER_NAME from './App'

export const useFetch = <T extends any>(url : string) : [T|null, boolean, {message:string}, () => void] => { 
    const [error, setError] = useState<{message:string}>({message:""});
    const [isLoaded, setIsLoaded] = useState(false);
    const [value, setValue] = useState<T | null>(null);
    
    const reload = () =>
    {
        fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setValue(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    useEffect(() => {
        reload()
    }, [url])

    return [value, isLoaded, error, reload]
}