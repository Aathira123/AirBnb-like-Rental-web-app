import React,{useEffect,useState} from 'react'
import {useLocation} from 'react-router-dom';

export default function MyBookings(props) {
    const location = useLocation();
    const [properties,setProperties]=useState([])
    const [cancelled,setCancelled]=useState(false)
    const [cannotcancel,setcannotcancel]=useState(false)
    var data=location.state
    useEffect(()=>{
       async function test(){
        const proplis = await Promise.all(
            data.map(async (d) => {
              const response = await fetch("http://localhost:3000/properties/"+d.property_id);
              return await response.json();
            })
          );
              
   
          
      setProperties(proplis)
       }
      test();
    },[data])
    var refreshMyBooking=()=>{
        fetch("http://localhost:3000/reservations?userId="+sessionStorage.getItem("userId"),{
            method:'GET',
            headers: {
               'Content-Type': 'application/json'
             },
       
         })
         .then((res)=>res.json())
         .then((res)=>
         data=res)
    }
    useEffect(()=>{
refreshMyBooking();
    },[data])
    var cancelDisplay = function () {
        
            setCancelled(false);
        
        
            setcannotcancel(false)
        
      
    };
const cancelBooking=(id,ind)=>{
    const date1=new Date()
    const date2=Date.parse(data[ind].cancellationDateMax)


    const diff=parseInt(date2 - date1)/ 100/60/60
    console.log(diff)
    if(Math.abs(diff)>=2){
        fetch("http://localhost:3000/reservations/"+id,{
            method:'DELETE',
            headers: {
               'Content-Type': 'application/json'
             },
      
         })
         .then((res)=>res.json())
         .then(()=>{
          data.splice(ind,1);
          setCancelled(true);
          setTimeout(cancelDisplay,4000)})
    }
    else{

setcannotcancel(true)
setTimeout(cancelDisplay,2000)

    }
    
}
  return (
    <React.Fragment>
    <div className='myBooking'>My Bookings</div>
    {cancelled && <div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Booking Cancelled</h4>
  <p>Your Booking Is Cancelled</p>
  <hr/>

</div>}
{cannotcancel && <div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Error! Cannot Cancel</h4>
  <p>Cannot Cancel the booking as the checkin date is less than 48 hours</p>
  <hr/>

</div>}
    <ul class="list-group">{
        data.map((d,ind)=>(
            <div style={{marginBottom:"20px"}}>
                 {properties.length!=0 && <div>
        <span className='lisitems'>Property: </span>{properties[ind]?.title}
            <span className="badge bg-warning text-dark" style={{float:'right'}}>
                You can cancel anytime before {d?.cancellationDateMax}</span>
            </div>}
            <li class="list-group-item"><div><span className='lisitems'>Booking Date: </span>{d?.bookingDate}</div>
           
            <div>
            <span className='lisitems'>Check in Date: </span>{d?.checkin}
            </div>
            <div>
            <span className='lisitems'>Check out Date: </span>{d?.checkout}
            </div>
            <div>
            <span className='lisitems'>Total Amount Paid: </span>{d?.totalPrice}$
            </div>
            <div>
            <button type="button" className="btn btn-danger" onClick={()=>cancelBooking(d?._id,ind)}>Cancel Booking</button>
            </div>
            </li>
         
        
         
            </div>
        ))
    }
 
  
</ul>
</React.Fragment>
  )
}
