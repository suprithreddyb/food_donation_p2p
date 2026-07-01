import { Button, Card, Container, Group, Loader, MultiSelect, NativeSelect, Stack, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Service from '../../utils/http';
import { dsiplayLocation } from './LocationComponent';
import { notifications } from '@mantine/notifications';
import OrderDetailsModal from '../Modals/OrderDetailsModal';

export default function ApplicationsComponent() {
  const [ type, setType ] = useState( "outgoing" );
  const [ filters, setFilters ] = useState( "all" );
  const [ status, setStatus ] = useState( [ "pending" ] );
  const [ applications, setApplications ] = useState( null );
  const [ orderDetails, setOrderDetails ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ reRender, setReRender ] = useState( false );
  const [ sorter, setSorter ] = useState( {
    sortBy : "createdAt",
    sortType : -1
  });

  const [ sortOptions, setSortOptions ] = useState( [ 
    "Date Posted",
    "Qty",
    "Distance"
  ])

  const service = new Service()

  const performTask = async ( task, applicationId )=> {
    if ( task === "approve" ){
      const data = await service.patch( `application/task/${applicationId}`, { ...userBody, task : "approved" });
      notifications.show( {
        title : data.message==="task performed on application" ? "Success" : "Failed",
        message : data.message==="task performed on application" ? "Approved application" : data.message,
        color : data.message === "task performed on application" ? "Blue" : "Red"
      })
    }
    else if ( type === "incoming" ){
      const data = await service.patch ( `application/task/${applicationId}`, { ...userBody, task : "rejected"});
      notifications.show( {
        title : data.message === "task performed on application" ? "Success" : "Failed",
        message : data.message === "task performed on application" ? "Rejected application" : data.message,
        color : data.message === "task performed on application" ? "blue" : "red"
      })
    }
    else{
      const data = await service.delete( `application/withdraw/${applicationId}`, userBody );
      notifications.show( {
        title : data.message === "deleted application" ? "Success" : "Failed",
        message : data.message === "deleted application" ? "Application withdrawn" : data.message,
        color : data.message === "deleted application" ? "blue" : "red"
      })
    }
    setReRender( !reRender );
  }

  const getApplications = async () => {
    if ( status.length === 0 ) return []
    console.log( filters );
    let url = `my/applications/${type}?filters=${filters}&sortBy=${sorter.sortBy}&sortType=${sorter.sortType}`;
    for ( let key of status ){
      url = url + `&status=${key}`
    }
    const data = ( await service.get( url ) ).data;
    setApplications( data )
  }

  useEffect( ()=> {
    getApplications();
  }, [ type, status, sorter, filters, reRender ])

  const dsiplayApplications = () => {
    if ( !applications ){
      return <Loader c='blue'></Loader>
    }
    return (
      <div>
        { applications.map( (order) => {
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
                  <Text fw={500}>Type: <Text span c="#545050">{order.order.type}</Text></Text>
                  <Text fw={500}>Qty: <Text span c="#545050">{order.order.qty}</Text></Text>
                  { order.order.type === "request" ?
                    <Text fw={500}>Urgency: <Text span c="#545050">{ { 0 : "low", 1 : "mid", 2 : "high" }[ order.order.urgency ]}</Text></Text>
                    :
                    <Text fw={500}>Expiry: <Text span c="#545050">{order.order.expiresAt.split( "T" )[ 0 ]}</Text></Text>
                  }
                  <Text fw={500}>Distance: <Text span c="#545050">{( order.distance / 1000 ).toFixed( 2 ) } Km</Text></Text>
                  <Text fw={500}>Status: <Text span c="#545050">{order.status}</Text></Text>
                  {
                    type === "incoming" && order.status === "pending" ? 
                    <Button variant="light" color="blue" radius="xl" onClick={(e)=>{performTask("approve", order._id)}}>Approve</Button>
                    :
                    <></>
                  }
                  {order.status === "pending" ? <Button variant="light" color="rgba(255, 0, 0, 1)" radius="xl" onClick={(e)=>{performTask("reject", order._id)}}>{type==="incoming"?"Reject"  :  "Withdraw"}</Button> : <></>}
                </Group>
              </Card>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div >
      <Group justify="center" mt={20} mb={20}>
        <Button variant={type==="incoming"? "filled" : "light" } radius="xl" onClick={(e)=>{setType( "incoming")}}>Incoming</Button>
        <Button variant={type==="outgoing"? "filled" : "light" } radius="xl" onClick={(e)=>{setType( "outgoing")}}>Outgoing</Button>
      </Group>
      { orderDetails ? <OrderDetailsModal type="application" showModal={showModal} setShowModal={setShowModal} orderDetails={orderDetails} setOrderDetails={setOrderDetails} /> : <></> }
      <Container>
        <div>
          <Group justify="left" mb="md">
            <NativeSelect size="md" radius="lg" label="Type" data={[ "all", "Request", "Donation" ] } onChange={ (e ) => {
              setFilters( { "Donation" : "donation", "Request" : "request", "All" : "all" }[ e.target.value ] )
              if ( e.target.value === "Donation" ){
                setSortOptions( [ "Date Posted", "Qty", "Urgency", "Distance" ] )
              }
              else{
                setSortOptions( [ "Date Posted", "Qty", "Distance"] )
              }
            } } />
            <MultiSelect
              size = "md"
              radius = "lg"
              label="Status"
              data={["approved", "rejected", "pending"]}
              defaultValue={["pending"]}
              value={status}
              onChange={setStatus}
              error={status.length < 1 ? "Select atleast one option" : null }
            />
            <NativeSelect size="md" radius="lg" label="Sort By" data={sortOptions} onChange={ (e ) => {
              setSorter( { ...sorter, sortBy : { "Date Posted" : "createdAt", "Qty" : "qty", "Distance" : "dist", "Urgency" : "urgency"}[ e.target.value ] } )
            } } />
            <NativeSelect size="md" radius = "lg" label="Sort Type" data={[ "Decrease", "Increase" ] } onChange={ (e) => {
              setSorter( {...sorter, sortType: { "Increase" : 1, "Decrease" : -1 }[ e.target.value ] } )
            }} />
          </Group>
        </div>
        {dsiplayApplications()}
      </Container>
    </div>
  )
}
