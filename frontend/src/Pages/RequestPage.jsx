import React, { useState } from 'react'
import DonationsComponent from '../Components/RequestComponents/DonationsComponent';
import NewRequestComponent from '../Components/RequestComponents/NewRequestComponent';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../redux/slices/User';
import { Navigate } from 'react-router-dom';

export default function RequestPage() {
  const [ component, setComponent ] = useState( "profile" );
  const isLoggedIn = useSelector( getIsLoggedIn );

  if ( !isLoggedIn ){
    return <Navigate to="/" replace />
  }

  const [ newRequest, setNewRequest ] = useState( false );


  return (
    <div>
      {newRequest ? 
      <NewRequestComponent setNewRequest={setNewRequest}/>
      :
      <DonationsComponent setNewRequest={setNewRequest}/>
      }
    </div>
  )
}
