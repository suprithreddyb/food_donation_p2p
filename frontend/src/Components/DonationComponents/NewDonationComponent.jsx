import React, { useState } from 'react'
import { NumberInput, TextInput, Text, Button, Container } from '@mantine/core'
import Service from '../../utils/http'
import { notifications } from '@mantine/notifications';

export default function NewDonationComponent( { setNewDonation } ) {
  const service = new Service();
  const createDonation = async () => {
    const donation = await service.post( "order/new/donation/", payload );
    notifications.show( {
      title : "Success",
      message : "Created new donation"
    });

    setNewDonation( false );

  }

  const setExpiry = () => {
    let cur = new Date();
    cur.setDate( cur.getDate() + 7 );
    return cur.toISOString().split("T")[0];
  }

  const [ payload, setPayload ] = useState( {
    qty : 0,
    expiresAt : setExpiry(),
    user: {
      id: "6a2a5f14a62527eabb79755c",
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
      <Button variant="filled" top = {10} left = {10} color="red" radius="sm" onClick = { () => { setNewDonation( false )}} >Cancel</Button>
      <Container size = "xs">
        <div style={{margin:20}}>
          <NumberInput
            size="md"
            radius="md"
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
          <TextInput
            type = "date"
            size="md"
            label="Expires At"
            radius="md"
            placeholder="Enter expiry date"
            min={new Date().toISOString().split("T")[0]}
            onChange = { ( e ) => {
              setPayload( { ...payload, expiresAt : e.target.value} )
            }}
          />
        </div>
        <div style={{ margin: 20}}>
          <Text size = "xl">Location: <Text span c="#545050" size = "lg">Same as in profile</Text></Text>
        </div>
        <div style={{ margin: 20}}> 
          <Button variant="filled" size="md" radius="xl" disabled = { payload.qty <= 0 } onClick = { createDonation }
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
