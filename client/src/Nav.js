import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import AddProps from './AddProps';
import {useNavigate} from 'react-router-dom';
import {
   Link
 } from "react-router-dom";
function Nav(props) {
   const [data, setData] = useState([])
   const [hostOpen,setHostOpen]=useState(false)
   const { filterData, setFilterData } = props;
   const navigate=useNavigate();
   useEffect(() => {
      setData(props.data);
   }, [props.data])
   const onSearchBoxChange = (e) => {
      var { value } = e.target;
      if (value == "") {

         setFilterData(data);
      } else {

         var x = props.data.filter((d) => d.title.toLowerCase().includes(value) || d.city.toLowerCase().includes(value))
         setFilterData(x)
      }

   }
const setHostFn=()=>{
   fetch("http://localhost:3000/users/becomehost",{
      method:'PUT',
      headers: {
         'Content-Type': 'application/json'
         // 'Content-Type': 'application/x-www-form-urlencoded',
       },
      body:JSON.stringify({
         id:sessionStorage.getItem("userId")
      })

   })
   .then((res)=>res.json())
   .then(()=>{props.setUserIsHost(true); setHostOpen(false)})
}

const seeMyBooking=()=>{
   fetch("http://localhost:3000/reservations?userId="+sessionStorage.getItem("userId"),{
      method:'GET',
      headers: {
         'Content-Type': 'application/json'
       },
 
   })
   .then((res)=>res.json())
   .then((res)=>{
      navigate('/myBookings',{state:res})
   })
 }

   return (
      <nav className="navbar navbar-expand-lg navbar-light navbar-color">
          <Modal show={hostOpen} onHide={()=>setHostOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm and Proceed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to proceed and be a host on RAS Villas?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setHostOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={setHostFn}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <AddProps addPropsModal={props.addPropsModal} setAddPropsModal={props.setAddPropsModal} fetchProperties={props.fetchProperties}/>
      <div className="container-fluid">
         <Link to="/" className="navbar-brand"> <img src="logo.png" width="110" height="90"
                style={{ marginLeft: "20px" }}/></Link>
         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
         </button>
         <div className="collapse navbar-collapse justify-content-end entire-nav" id="navbarNav">

            <ul className="navbar-nav">
               <li className="nav-item d-flex centered1">
           
                  <div className="test">
                     <div className="input-group">
                     <input type="text" className="form-control" placeholder="search ..." onChange={(e) => onSearchBoxChange(e)} />
                    
                     </div>
                     <div className="input-group">
                     <input className="form-control date-custom1" type="date" placeholder="mm-dd-yyyy" name="check-in" />
                     </div>
                     <div className="input-group">
                     <input className="form-control" type="date" placeholder="mm-dd-yyyy" name="check-out" />
                     </div>
                     <div className="input-group">
                  <div className="dropdown">
                      <button className="btn btn-secondary dropdown-toggle guests-button"
                           type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                           Guests
                        </button>
                        <ul className="dropdown-menu dropdown-custom" aria-labelledby="dropdownMenuButton1">
                           <li className="li_class">
                              <div className="flex-check" >
                                 <div>
                                    <p className="text-dark">Adults</p>
                                 </div>
                                 <div className="input-group" >
                                    <input type="number" min="1" defaultValue={1} name="quantity"
                                       className="quantity-field border-3 text-center w-75" />
                                 </div>
                              </div>
                           </li>
                           <li className="li_class">
                              <div className="d-flex">
                                 <div>
                                    <p className="text-dark">Children</p>
                                 </div>
                                 <div className="input-group">
                                    <input type="number" min="1" defaultValue={1} name="quantity"
                                       className="quantity-field border-3 text-center w-75" />
                                 </div>
                              </div>
                           </li>
                           <li className="li_class">
                              <div className="d-flex">
                                 <div>
                                    <p className="text-dark">Infants</p>
                                 </div>
                                 <div className="input-group">
                                    <input type="number" min="1" defaultValue={1} name="quantity"
                                       className="quantity-field border-3 text-center w-75" />

                                 </div>
                              </div>
                           </li>
                        </ul>
                     </div>
                     
                  </div>
                  
                  </div>
                 
                  </li>
                  {props.loggedin && !props.userIsHost && <li className="nav-item">
                  <button type="button" class="btn btn-warning" onClick={()=>setHostOpen(true)}>Become a Host</button>
         </li>}
      {props.userIsHost && <li className="nav-item">
                  <button type="button" class="btn btn-warning" onClick={()=>props.setAddPropsModal(true)}>Add Properties</button>
         </li>}
                  <li className="nav-item">
            <Link to="/" className="nav-link active nav-style" aria-current="page">Home</Link>

         </li>
         <li className="nav-item">
            <a className="nav-link nav-style">About</a>
         </li>
         <div className="dropdown ">
  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
   <i className="bi bi-person-circle"></i>
   </button>
   <ul className="dropdown-menu dropdown-menu-end " aria-labelledby="dropdownMenuButton1">
   {props.loggedin ?
      props.userIsHost?  <Link to="/myProperties" className="dropdown-item" onClick={props.fetchMyProperties}>My Properties</Link>:  
      <React.Fragment>
      <li><a className="dropdown-item" onClick={seeMyBooking}>Manage my Booking</a></li>
      </React.Fragment>
      :null

     }
     {
     !props.loggedin?<React.Fragment><li><a className="dropdown-item" onClick={()=>props.setLoginModalOpen(true)}>Login</a></li>
     <li><a className="dropdown-item" onClick={()=>props.setSignUpModalOpen(true)}>Signup</a></li> </React.Fragment>:
     <li><a className="dropdown-item" onClick={()=>{sessionStorage.clear(); props.setLoggedIn(false);props.setUserIsHost(false)}}>Logout</a></li>
     }
     
    
   </ul>
 </div>
         </ul>
         </div>
</div>
      
   </nav>

               
                   
      
   )
}
export default Nav;
