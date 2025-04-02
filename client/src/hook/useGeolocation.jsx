import {useEffect, useState} from "react";

export default function useGeolocation() {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: 0, lng: 0 }
    });

    const onSuccess = (info) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: info.coords.latitude,
                lng: info.coords.longitude
            }
        })
    };

    const onError = (error) => {
        setLocation({
            loaded: false,
            error
        })
    };

    useEffect(() => {
        if(!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: 'Geolocation Information is not exists'
            })
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return location;
}