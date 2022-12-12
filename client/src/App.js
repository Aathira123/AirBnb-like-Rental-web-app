import React,{useEffect,useState} from 'react';
import './Main.css';
import Nav from './Nav';
import SideBar from './SideBar';
import Footer from './Footer'
import PropertyList from './PropertyList';
import Login from './Login'
import Signup from './Signup'
import MyProperties from './MyProperties';
import MyBookings from './MyBookings';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import PropDetails from './PropDetails';

function App() {
  const [data, setData] = useState([])
  const [selectedProp,setSelectedProp]=useState([])
  const [isClicked,setClicked]=useState(false)
  const [filterData,setFilterData]=useState([])
  const [loginModalOpen,setLoginModalOpen]=useState(false)
  const [signUpModalOpen,setSignUpModalOpen]=useState(false)
  const [loggedin,setLoggedIn]=useState(false)
  const [userIsHost,setUserIsHost]=useState(false)
  const [addPropsModal,setAddPropsModal]=useState(false)
  const [hostProperties,setHostProperties]=useState()
  const fetchProperties=()=>{
    fetch('http://localhost:3000/properties')
    .then(function(response){
      return response.json();
    
    })
    .then((d)=>{
      setData(d)
      setFilterData(d);
    })
  }
  useEffect(() => {
   fetchProperties();
},[])

const fetchMyProperties=()=>{
  fetch('http://localhost:3000/properties')
  .then(function(response){
    return response.json();
  
  })
  .then((data)=>{
    var proplist=[]
    data.map((d)=>{
      if(d.Host_id==sessionStorage.getItem("userId")){
          proplist.push(d)
      }
    })
    setHostProperties(proplist)
   
  })
}

  return (
    <React.Fragment>
   
    <Router>
    <Nav data={data} setFilterData={setFilterData} filterData={filterData} setUserIsHost={setUserIsHost} userIsHost={userIsHost}
    setLoginModalOpen={setLoginModalOpen}
    fetchProperties={fetchProperties}
    fetchMyProperties={fetchMyProperties}
    addPropsModal={addPropsModal} setAddPropsModal={setAddPropsModal}
    setLoggedIn={setLoggedIn} setSignUpModalOpen={setSignUpModalOpen} loggedin={loggedin}/>
    <Login loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} setLoggedIn={setLoggedIn} setUserIsHost={setUserIsHost}/>
    <Signup signUpModalOpen={signUpModalOpen} setSignUpModalOpen={setSignUpModalOpen}/>
    <div className="container-fluid">
      <div className="row">
        
        <SideBar/>
         <div className="col-md-10">
            
              <div className="row">
                  <div className="jumbotron">
                  <h1 className='centered' style={{fontSize:"5rem", fontFamily:"Baskerville"}}>RAS VILLAS
                  </h1>
                  </div>
             
              
               
            </div>
           <Routes>
           <Route exact path="/myProperties" element={<MyProperties hostProperties={hostProperties} fetchMyProperties={fetchMyProperties}/>}/>
         <Route path="/" element={ <PropertyList fetchProperties={fetchProperties} data={filterData} setClicked={setClicked} setSelectedProp={setSelectedProp}/>}/>
         {isClicked && <Route path="details/:prop" element={<PropDetails selectedProp={selectedProp} loggedin={loggedin} userIsHost={userIsHost}/>}/>}
        <Route path="/myBookings" element={<MyBookings/>}/>
          </Routes> 
         </div>
      </div>
   </div>
 
      
    
          
       
          <Footer/>
    </Router>
   
    </React.Fragment>
   
  );
}

export default App;
