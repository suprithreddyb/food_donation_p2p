import React, { useEffect, useState } from 'react'
import NewDonationComponent from '../Components/DonationComponents/NewDonationComponent.jsx';
import RequestsComponent from '../Components/DonationComponents/RequestsComponent.jsx';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getIsLoggedIn } from '../redux/slices/User.js';

export default function DonatePage() {
  const [ component, setComponent ] = useState( "profile" );
  const isLoggedIn = useSelector( getIsLoggedIn );

  if ( !isLoggedIn ){
    return <Navigate to="/" replace/>
  }

  const [ newDonation, setNewDonation ] = useState( false );

  return (
    <div>
      {
        newDonation ? 
        <NewDonationComponent setNewDonation={setNewDonation}/>
        :
        <RequestsComponent setNewDonation={setNewDonation}/>
      }
    </div>
  )
}
