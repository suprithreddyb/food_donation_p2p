import { Box, Flex, Group, Loader, Modal, Stack, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Service from '../../utils/http';
import {dsiplayLocation} from '../DashboardComponents/LocationComponent.jsx';

export default function OrderDetailsModal( {type, showModal, setShowModal, orderDetails, setOrderDetails} ) {
  const service = new Service();
  const [ ownerDetails, setOwnerDetails ] = useState( null );
  const [ volunteerDetails, setVolunteerDetails ] = useState( null );

  const getProfileDetails = async ( user, userId ) => {
    if ( !userId ){
      user === "owner" ? setOwnerDetails(  ) : setVolunteerDetails( null );
      return;
    }
    let profile = ( await service.get( `my/profile/${userId}` ) ).data;
    profile.location = {
      lat : profile.location.coordinates[ 0 ], 
      long : profile.location.coordinates[ 1 ]
    }
    if ( user === "owner" ){
      setOwnerDetails( profile );
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
    return (

      <div>
        <Flex>
          <Box flex={1}>
            { ownerDetails ? 
              <Stack gap="sm" align='center'>
                <h3>{orderDetails.type === "donation" ? "Donor" : "Requester"}</h3>
                <Text>name: <strong>{ownerDetails.name}</strong></Text>
                <Text>email: <strong>{ownerDetails.email}</strong></Text>
                <Text>phone: <strong>{ownerDetails.phone}</strong></Text>
                {dsiplayLocation(ownerDetails.location)}
              </Stack>
            : 
              <Stack gap="sm" align='center' justify="center">
                <h3>{orderDetails.type === "donation" ? "Requester" : "Donor"}</h3>
              </Stack>
            }
          </Box>
          <Box flex={1}>
            {
              volunteerDetails ? 
                <Stack gap="sm" align='center'>
                <h3>{orderDetails.type === "donation" ? "Requester" : "Donor"}</h3>
                <Text>name: <strong>{volunteerDetails.name}</strong></Text>
                <Text>email: <strong>{volunteerDetails.email}</strong></Text>
                <Text>phone: <strong>{volunteerDetails.phone}</strong></Text>
                {dsiplayLocation(volunteerDetails.location)}
              </Stack>
              :
              <Stack gap="xl" align='center' justify='center'>
                <h3>{orderDetails.type === "donation" ? "Requester" : "Donor"}</h3>
                <Text size="lg" c="dimmed">Null</Text>
              </Stack>
            }
          </Box>
        </Flex>
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
