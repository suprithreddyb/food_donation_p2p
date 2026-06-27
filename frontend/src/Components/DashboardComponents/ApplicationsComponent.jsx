import { Button, Container, Group, MultiSelect, NativeSelect } from '@mantine/core'
import React, { useState } from 'react'
import Service from '../../utils/http';

export default function ApplicationsComponent() {
  const [ type, setType ] = useState( "incoming" );
  const [ filters, setFilters ] = useState( "all" );
  const [ status, setStatus ] = useState( [ "pending" ] );
  const [ sorter, setSorter ] = useState( {
    sortBy : "createdAt",
    sortType : -1
  });
  const userBody = {
    user : { 
      id : "6a3e0fbf876ef54ea1bd06f1",
      coordinates : [ 1, 2 ]
    }
  }

  const [ sortOptions, setSortOptions ] = useState( [ 
    "Date Posted",
    "Qty",
    "Distance"
  ])

  const service = new Service()

  const getApplications = async () => {
    if ( status.length === 0 ) return []
    var url = `my/applications/${type}?filters=${filters}&sortBy=${sorter.sortBy}&sortType=${sorter.sortType}`;
    for ( var key of status ){
      url = url + `&status=${key}`
    }
    const applications = await service.patch( url, userBody );
    return applications.data;
  }

  const displayApplications = () => {
    const applications = getApplications();
    return <div>displaying</div>
  }

  return (
    <div >
      <Group justify="center" mt={20} mb={20}>
        <Button variant={type==="incoming"? "filled" : "light" } radius="xl" onClick={(e)=>{setType( "incoming")}}>Incoming</Button>
        <Button variant={type==="outgoing"? "filled" : "light" } radius="xl" onClick={(e)=>{setType( "outgoing")}}>Outgoing</Button>
      </Group>
      <Container>
        <div>
          <Group justify="left" mb="md">
            <NativeSelect size="md" radius="lg" label="Type" data={[ "all", "Request", "Donation" ] } onChange={ (e ) => {
              setFilters( e.target.value )
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
              data={["accepted", "rejected", "pending"]}
              defaultValue={["pending"]}
              value={status}
              onChange={setStatus}
              error={status.length < 1 ? "Select atleast one option" : null }
            />
            <NativeSelect size="md" radius="lg" label="Sort By" data={sortOptions} onChange={ (e ) => {
              setSorter( { ...sorter, sortBy : { "Date Posted" : "createdAt", "Qty" : "qty", "Distance" : "dist", "Urgency" : "urgency"}[ e.target.value ] } )
            } } />
            <NativeSelect size="md" radius = "lg" label="Sort Type" data={[ "Increase", "Decrease" ] } onChange={ (e) => {
              setSorter( {...sorter, sortType: { "Increase" : 1, "Decrease" : -1 }[ e.target.value ] } )
            }} />
          </Group>
        </div>
        {
          displayApplications()
        }
      </Container>
    </div>
  )
}
