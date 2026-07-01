import React, { useEffect, useState } from 'react'
import Service from '../../utils/http';
import { Button, Card, Container, Group, NativeSelect, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import OrderDetailsModal from '../Modals/orderDetailsModal';

export default function DonationsComponent( { setNewRequest } ) {
  const [ donations, setDonations ] = useState( null );
  const [ orderDetails, setOrderDetails ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const service = new Service();
  const [ filters, setFilters ] = useState( {
    sortBy: "createdAt",
    sortType:1
  });


  const getData = async () => {
    const data = await service.get( `order/orders?type=donation&sortBy=${filters.sortBy}&sortType=${filters.sortType}` );
    return data.data;
  }

  const apply = async (orderId, dist) => {
    try{
      const application = await service.post( `application/apply/${orderId}`, { ...userBody, distance : dist } );
      notifications.show( {
        title : ( application.message === "created new application" ? "Success" : "Failed" ),
        message : application.message === "created new application" ? "Sent request" : application.message,
        color : application.message === "created new application" ? "blue" : "red"
      })
    }
    catch ( err ){
      notifications.show( {
        title : "Failed",
        message : "Something went wrong",
        color : "red"
      })
    }
  }

  useEffect( () => {
    const loadData = async () => {
      let data = await getData();
      data = data.map( ( order ) => {
        return (
        <div>
          <Card  padding="sm" withBorder orientation="horizontal" key={ order._id }
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "30px",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
            cursor:"pointer",
          }}
          onClick={()=>{
            setOrderDetails( order )
          }}>
            <Group justify="space-between">
              <Text fw={500}>Qty: <Text span c="#545050">{order.qty}</Text></Text>
              <Text fw={500}>Expiry: <Text span c="#545050">{ order.expiresAt }</Text></Text>
              <Text fw={500}>Location: <Text span c="#545050">{order.ownerLocation.coordinates[ 0 ] + ", " + order.ownerLocation.coordinates[ 1 ]}</Text></Text>
              <Text fw={500}>Date Posted: <Text span c="#545050">{order.createdAt.split( "T" )[ 0 ]}</Text></Text>
              <Text fw={500}>Distance: <Text span c="#545050">{( order.dist / 1000 ).toFixed( 2 ) } Km</Text></Text>
              
              <Button variant="filled" size="xs" radius="lg" onClick = {() => apply( order._id, order.dist)}>Request</Button>
            </Group>
          </Card>
        </div> 
        )
      })
      setDonations( data );
    }
    loadData();
  }, [ filters] );

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
      <div>
        <Button variant="filled" top={10} left={10} onClick ={() => {
          setNewRequest( true )
        } }>New</Button>
      </div>
      <Container>
        <div>
          {orderDetails !== null ? <OrderDetailsModal type="order" showModal={showModal} setShowModal={setShowModal} orderDetails={orderDetails} setOrderDetails={setOrderDetails} /> : <></> }
          <Group justify="left">
            <NativeSelect size="md" radius="lg" label="Sort By" data={[ "Date Posted", "Qty", "Distance", "Urgency" ] } onChange={ (e ) => {
              setFilters( { ...filters, sortBy : { "Date Posted" : "createdAt", "Qty" : "qty", "Distance" : "dist", "Urgency" : "urgency"}[ e.target.value ] } )
            } } />
            <NativeSelect size="md" radius = "lg" label="Sort Type" data={[ "Increase", "Decrease" ] } onChange={ (e) => {
              setFilters( {...filters, sortType: { "Increase" : 1, "Decrease" : -1 }[ e.target.value ] } )
            }} />
          </Group>
        </div>
        <div>
          <h2>Available Donations</h2>
        </div>
        <div>
          <Stack>
            {donations}
          </Stack>
        </div>
      </Container>
    </div>
  )
}
