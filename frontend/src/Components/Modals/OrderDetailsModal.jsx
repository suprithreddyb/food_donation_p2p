import { Group, Loader, Modal, Stack, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Service from '../../utils/http';
import {dsiplayLocation} from '../DashboardComponents/LocationComponent.jsx';

export default function OrderDetailsModal( {type, showModal, setShowModal, orderDetails, setOrderDetails} ) {
  const service = new Service();
  const [ ownerDetails, setOwnerDetails ] = useState( null );
  const [ volunteerDetails, setVolunteerDetails ] = useState( null );

  const getProfileDetails = async ( user, userId ) => {
    let profile = ( await service.get( `my/profile/${userId}` ) ).data;
    profile.location = {
      lat : profile.location.coordinates[ 0 ], 
      long : profile.location.coordinates[ 1 ]
    }
    console.log(ownerDetails);
    if ( user === "owner" ){
      setOwnerDetails( profile );
      console.log( "1: " );
      console.log( ownerDetails  );
   }
    else{
      setVolunteerDetails( profile );
    }
  }

  useEffect( () => {
    if ( orderDetails === null ){
      return;
    }
    getProfileDetails( "owner", orderDetails.ownerId );
    if ( type === "application" ){
      getProfileDetails( "volunteer", orderDetails.volunteerId )
    }
    setShowModal( true )
  }, [ orderDetails ] );

  const displayDetails = () => {
    if ( type === "order" ){
      if ( !ownerDetails ){
        return <Loader color="blue"></Loader>
      }
      return (
        <div>
          {console.log( "name: " + JSON.stringify( ownerDetails ) ) }
          <Stack gap="sm" align="center">
            <h3>{orderDetails.type === "donation" ? "Donor" : "Requester"}</h3>
            <Text>name: <strong>{ownerDetails.name}</strong></Text>
            <Text>email: <strong>{ownerDetails.email}</strong></Text>
            <Text>phone: <strong>{ownerDetails.phone}</strong></Text>
            {dsiplayLocation(ownerDetails.location)}
          </Stack>
        </div>
      )
    }
    if ( (!ownerDetails) || (!volunteerDetails) ){
      return <Loader color="blue"></Loader>
    }
    return (

      <div>
        <Group gap="xl">
          <Stack gap="sm" align='center'>
            <h3>{orderDetails.type === "donation" ? "Donor" : "Requester"}</h3>
            <Text>name: <strong>{ownerDetails.name}</strong></Text>
            <Text>email: <strong>{ownerDetails.email}</strong></Text>
            <Text>phone: <strong>{ownerDetails.phone}</strong></Text>
            {dsiplayLocation(ownerDetails.location)}
          </Stack>
          <Stack gap="sm" align='center'>
            <h3>{orderDetails.type === "donation" ? "Requester" : "Donor"}</h3>
            <Text>name: <strong>{volunteerDetails.name}</strong></Text>
            <Text>email: <strong>{volunteerDetails.email}</strong></Text>
            <Text>phone: <strong>{volunteerDetails.phone}</strong></Text>
            {dsiplayLocation(volunteerDetails.location)}
          </Stack>
        </Group>
      </div>
    )
  }

  return (
    <div>
      <Modal
        opened={showModal}
        onClose={(e)=>{ 
          setShowModal( false )
          setOrderDetails( null )  
        }}
        title="Details"
        size="xl"
        radius={20}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        {displayDetails()}
      </Modal>
    </div>
  )
}
