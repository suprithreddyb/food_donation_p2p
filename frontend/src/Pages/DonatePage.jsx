import React, { useEffect, useState } from 'react'
import NewDonationComponent from '../Components/DonationComponents/NewDonationComponent.jsx';
import RequestsComponent from '../Components/DonationComponents/RequestsComponent.jsx';

export default function DonatePage() {
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
