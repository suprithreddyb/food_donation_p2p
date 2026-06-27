import { Button, Modal, TextInput } from '@mantine/core'
import React from 'react'
import { dsiplayLocation } from '../DashboardComponents/LocationComponent';
import Service from '../../utils/http';

export default function EditProfileModal( { setEdit, edit, profile, setProfile }) {
  const service = new Service();
  
  const editProfile = async() => {
    const profileData = await service.patch( "my/profile/edit", { 
      user : { 
        id : "6a3e0fbf876ef54ea1bd06f1",
        coordinates : [ 1, 2 ]
      },
      data : {...profile, location : {
        type: "Point",
        coordinates: [ profile.location.lat, profile.location.long ]
      }}
    } );
    return profileData;
  }


  return (
    <div>
      <Modal
        opened={edit === true}
        onClose={(e)=>{setEdit( false) }}
        title="Profile"
        size="xl"
        radius={20}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <TextInput
          size="md"
          radius="sm"
          label="Name"
          placeholder={profile.name}
          onChange={ (e) => {
            setProfile( {...profile, name : e.target.value} );
          }}
        />
        <TextInput
          size="md"
          radius="sm"
          label="Email"
          placeholder={profile.email}
          onChange={ (e) => {
            setProfile( {...profile, name : e.target.value} );
          }}
        />
        <TextInput
          size="md"
          radius="sm"
          label="Phone"
          placeholder={profile.phone}
          onChange={ (e) => {
            setProfile( {...profile, name : e.target.value} );
          }}
        />
        {dsiplayLocation( profile.location )}
        <Button size="sm" radius={20} onClick={(e)=>{
          navigator.geolocation.getCurrentPosition(
            ( position )=> {
              const lat = position.coords.latitude;
              const long = position.coords.longitude;
              setProfile( { ...profile, location : {
                lat: lat,
                long: long
              } } );
            }
          )
        }}>Update Location</Button>
        <div style={{
          display:"flex",
          justifyContent:"center",
        }}>
          <Button onClick={(e)=>{
            editProfile()
            setEdit( false )
          }}>Edit</Button>
        </div>
      </Modal>
    </div>
  )
}
