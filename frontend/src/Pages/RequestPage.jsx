import React, { useState } from 'react'
import DonationsComponent from '../Components/RequestComponents/DonationsComponent';
import NewRequestComponent from '../Components/RequestComponents/NewRequestComponent';

export default function RequestPage() {
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
