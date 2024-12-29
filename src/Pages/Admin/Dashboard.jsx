import React,{ useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
useEffect(()=>{
  let admin = sessionStorage.getItem("admin");
if(!admin){
  navigate("/admin-panel/login")
}
},[sessionStorage])

  return (
    <div>
    
      <h1>Dashboard</h1>
    </div>
  );
}
