import React, { useState } from 'react'
import LocationComponent from '../Components/DashboardComponents/LocationComponent'
import { Button, Container, Group } from '@mantine/core'
import ProfileComponent from '../Components/DashboardComponents/ProfileComponent';
import ApplicationsComponent from '../Components/DashboardComponents/ApplicationsComponent';
import OrdersComponent from '../Components/DashboardComponents/OrdersComponent';
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../redux/slices/User";
import { Navigate } from 'react-router-dom';


export default function DashboardPage() {
  const [ component, setComponent ] = useState( "profile" );
  const isLoggedIn = useSelector(getIsLoggedIn);

  if ( !isLoggedIn ){
    return <Navigate to="/" replace/>
  }

  return (
    <div style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #d9afd9 0%, #97d9e1 100%)",
        position: "relative",
        // alignItems: "center",
        // justifyContent: "center",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        <Container size="sm" mt="sm" mb="sm">
        <Group>
          <Button variant={component==="profile" ? "filled" : "light"} onClick={()=>{setComponent("profile")}}>Profile</Button>
          <Button variant={component==="applications" ? "filled" : "light"} onClick={()=>{setComponent("applications")}}>Applications</Button>
          <Button variant={component==="orders" ? "filled" : "light"} onClick={()=>{setComponent("orders")}}>Orders</Button>
        </Group>
        </Container>
      <div>
      {/* <LocationComponent/> */}
      { component === "profile" && <ProfileComponent/>}
      { component === "applications" && <ApplicationsComponent/>}
      { component === "orders" && <OrdersComponent/>}
      </div>
    </div>
  )
}
