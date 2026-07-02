import { Button, Card, Container, Loader, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react'

export function dsiplayLocation( location ) {
  return (
  <div>
    <Text fw={600}>Location</Text>
      {location ?
      <iframe
        width="100%"
        height="250"
        frameBorder="0"
        scrolling="no"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
          location.long - 0.01
        },${location.lat - 0.01},${
          location.long + 0.01
        },${location.lat + 0.01}&marker=${location.lat},${location.long}`}
      />  
      :
      <Loader color="blue" />
      }

      {location && (
        <>
          <Text mt="md">
            Latitude: <strong>{location.lat.toFixed( 3 )}</strong>
          </Text>
          <Text>
            Longitude: <strong>{location.long.toFixed( 3 )}</strong> 
          </Text>
        </>
      )}
  </div>
  )
}

export default function LocationComponent() {
  const [ location, setLocation ] = useState( null );

  useEffect( () => {
    navigator.geolocation.getCurrentPosition(
      ( position )=> {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setLocation( {
          lat: lat,
          long: long
        } );
      },
      ( err )=>{
        console.log( "error: " + err );
      });
    }, [] ); 

  return (
    <div>
      <Container size="xs">
        <Card shadow="sm" p="md" top={50} radius="md">
        {dsiplayLocation( location )}
      <Button mt="md" radius="md">
        Confirm Location
      </Button>
    </Card>
    </Container>
  </div>
  )
}
