import React, { useEffect, useState } from 'react'
import Service from '../../utils/http';
import { Button, Card, Container, Group, Loader, MultiSelect, NativeSelect, Text } from '@mantine/core';
import OrderDetailsModal from '../Modals/OrderDetailsModal';
import { notifications } from '@mantine/notifications';

export default function OrdersComponent() {
  const [ orders, setOrders] = useState( null );
  const [ orderDetails, setOrderDetails ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ type, setType ] = useState( [ "donation", "request" ] );
  const [ reRender, setReRender ] = useState( false );
    
  const [ status, setStatus ] = useState( ["Active"] );
  const [ sorter, setSorter ] = useState( {
    sortBy : "Date posted",
    sortType : -1
  })
  const [ sortOptions, setSortOptions ] = useState( [ 
    "Date Posted",
    "Qty",
    "Distance"
  ])
  const service = new Service();

  const getOrderDetails = async () => {
    let url = "my/orders?"
    for ( let t of type ){
      url = url + `types=${t}&`
    }
    for ( let t of status ){
      const temp = {"Active" : true, "Inactive" : false }[ t ];
      url = url + `status=${temp}&`
    }
    url = url + `sortBy=${sorter.sortBy}&sortType=${sorter.sortType}`;
    const data = await service.get( url );
    setOrders( data.data );
  }

  const deleteOrder = async ( orderId ) => {
    const url = `my/order/delete/${orderId}`;
    const data = await service.delete( url );
    notifications.show( {
      title: data.message === "deleted order" ? "Success" : "Failed",
      message : data.message,
      color : data.message === "deleted order" ? "green" : "red"
    })
    setReRender( !reRender );
  }

  const displayOrders = () => {
    if ( !orders ){
      return <Loader c='blue'></Loader>
    }
    console.log( typeof( orders ) );
    return (
      <div>
        { orders.map( (order) => {
          return (
            <div>
              <Card  padding="sm" withBorder orientation="horizontal"
                mt="md"
                style={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "30px",
                  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer"
                }}
                onClick={()=>{
                  setOrderDetails( order )
              }}>
                <Group justify="space-between">
                  <Text fw={500}>Type: <Text span c="#545050">{order.type}</Text></Text>
                  <Text fw={500}>Qty: <Text span c="#545050">{order.qty}</Text></Text>
                  { order.type === "request" ?
                    <Text fw={500}>Urgency: <Text span c="#545050">{ { 0 : "low", 1 : "mid", 2 : "high" }[ order.urgency ]}</Text></Text>
                    :
                    <Text fw={500}>Expiry: <Text span c="#545050">{order.expiresAt.split( "T" )[ 0 ]}</Text></Text>
                  }
                  <Text fw={500}>Distance: <Text span c="#545050">{( order.distance / 1000 ).toFixed( 2 ) } Km</Text></Text>
                  <Text fw={500}>Date Posted: <Text span c="#545050">{order.createdAt.split( "T" )[ 0 ]}</Text></Text>
                  <Text fw={500}>Status: <Text span c="#545050">{{true : "Active", false : "Inactive"}[ order.isActive ]}</Text></Text>
                  { 
                  order.isActive ? 
                  <Button variant="light" color="rgba(255, 0, 0, 1)" radius="xl" onClick={(e)=>{
                    deleteOrder(order._id)}}>Delete</Button> 
                    : <></>}
                </Group>
              </Card>
            </div>
          )
        })}
      </div>
    )
  }

  useEffect( () => {
    getOrderDetails();
  }, [ status, type, sorter, reRender ] )


  
  return (
    <div >
      { orderDetails ? <OrderDetailsModal type="application" showModal={showModal} setShowModal={setShowModal} orderDetails={orderDetails} setOrderDetails={setOrderDetails} /> : <></> }
      <Container>
        <div>
          <Group justify="left" mb="md">
            <NativeSelect size="md" radius="lg" label="Type" data={[ "All", "Request", "Donation" ] } onChange={ (e ) => {
              setType( { "Donation" : "donation", "Request" : "request", "All" : [ "donation", "request" ] }[ e.target.value ] )
              if ( e.target.value === "Request" ){
                setSortOptions( [ "Date Posted", "Qty", "Urgency", "Distance" ] )
              }
              else{
                setSortOptions( [ "Date Posted", "Qty", "Expiry", "Distance"] )
              }
            } } />
            <MultiSelect
              size = "md"
              radius = "lg"
              label="Status"
              data={["Active", "Inactive"]}
              defaultValue={["Active"]}
              value={status}
              onChange={setStatus}
              error={status.length < 1 ? "Select atleast one option" : null }
            />
            <NativeSelect size="md" radius="lg" label="Sort By" data={sortOptions} onChange={ (e ) => {
              setSorter( { ...sorter, sortBy : { "Date Posted" : "createdAt", "Qty" : "qty", "Distance" : "dist", "Urgency" : "urgency", "Expiry" : "expiresAt"}[ e.target.value ] } )
            } } />
            <NativeSelect size="md" radius = "lg" label="Sort Type" data={[ "Decrease", "Increase" ] } onChange={ (e) => {
              setSorter( {...sorter, sortType: { "Increase" : 1, "Decrease" : -1 }[ e.target.value ] } )
            }} />
          </Group>
        </div>
        {displayOrders()}
      </Container>
    </div>
  )
}
