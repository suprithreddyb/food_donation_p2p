import React, { useEffect, useState } from 'react'
import Service from '../../utils/http';
import { Avatar, Button, Container, Group, Modal, Stack, Text } from '@mantine/core';
import {dsiplayLocation} from './LocationComponent.jsx';
import EditProfileModal from '../Modals/EditProfileModal.jsx';

export default function ProfileComponent({ editState }) {
  const [ profile, setProfile ] = useState( [] );
  const [ edit, setEdit ] = useState( false );
  const service = new Service();
  const [ reRender, setReRender ] = useState( false );

  const toReact = ( profileData ) =>{
    const arr = []
    for ( var key in profileData ){
      const value = profileData[ key ]
      if ( key === "location" ){
        arr.push(
          <div>
            <Container size ="xs" >
              {dsiplayLocation( value )}  
            </Container>
          </div>
        )
        continue;
      }
      arr.push(
        <div>
          <Container size ="xs" >
            <Text>{key.slice( 0, 1).toUpperCase() + key.slice( 1 )}: <strong>{value}</strong></Text>
          </Container>
        </div>
      )
    }
    return arr;
  }
  
  useEffect( ()=> {
    const loadData = async () => {
      const data = await service.get( `my/profile` );
      const profileData = {
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        location: {
          lat: data.data.location?.coordinates[ 0 ],
          long: data.data.location?.coordinates[ 1 ]
        }
      };
      setProfile( profileData );
    }
    loadData();
  }, [edit, reRender ] )
  return (
    <div>
      {
        edit &&
        <EditProfileModal setEdit={setEdit} edit={edit} profile={profile} setProfile={setProfile} reRender={reRender} setReRender={setReRender}/>
      }
      <Container size="xs" mt={50}style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "30px",
            padding: "3rem 2rem",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
        <Stack align="center" gap="xl">
          { toReact( profile ) }
          <Button size="md" variant="filled" color="blue" onClick={(e)=>{ setEdit( true ) }}>Edit</Button>
        </Stack>
        </div>
      </Container>
    </div>
  )
}

