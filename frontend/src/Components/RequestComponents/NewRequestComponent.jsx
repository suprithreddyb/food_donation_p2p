import React, { useState } from 'react'
import { NumberInput, TextInput, Text, Button, Container, NativeSelect } from '@mantine/core'
import Service from '../../utils/http'
import { notifications } from '@mantine/notifications';

export default function NewRequestComponent( { setNewRequest } ) {
  const service = new Service();

  const createRequest = async () => {
    const request = await service.post( "order/new/request/", payload );
    notifications.show( {
      title : "Success",
      message : "Created new request"
    });

    setNewRequest( false );
  }

  const [ payload, setPayload ] = useState( {
    qty : 0,
    urgency : "mid",
    user: {
      id: "6a3e0fbf876ef54ea1bd06f1",
      coordinates: [ 1, 2 ]
    }
  } );
  
  return (
    <div style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #d9afd9 0%, #97d9e1 100%)",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
      <Button variant="filled" top = {10} left = {10} color="red" radius="sm" onClick = { () => { setNewRequest( false )}} >Cancel</Button>
      <Container size = "xs">
        <div style={{margin:20}}>
          <NumberInput
            size="md"
            radius="sm"
            label="Quantity"
            withAsterisk
            placeholder="Enter food quantity"
            onChange = { ( e ) => {
              setPayload( { ...payload, qty: e } )
              console.log( payload )
            }}
          />
        </div>
        <div style={{ margin: 20}}>
          <NativeSelect size="md" radius="lg" label="Urgency" data={[ "low", "mid", "high" ] } onChange={ (e ) => {
            setFilters( { ...filters, sortBy : [ e.target.value ] } )
          } } />
        </div>
        <div style={{ margin: 20}}>
          <Text size = "xl">Location: <Text span c="#545050" size = "lg">Same as in profile</Text></Text>
        </div>
        <div style={{ margin: 20}}> 
          <Button variant="filled" size="md" radius="xl" disabled = { payload.qty <= 0 } onClick = { createRequest }
          style={{
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "30px",
            boxShadow: "0px 8px 40px 0px rgba(0, 0, 0, 0.2)",
          }}>Create</Button>
        </div>
      </Container>
    </div>
  )
}
