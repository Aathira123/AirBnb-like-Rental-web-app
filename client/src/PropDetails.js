import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import { Button } from 'react-bootstrap';
export default function PropDetails(props) {
   
    const navigate=useNavigate();
    var d = props.selectedProp
    const [host, setHost] = useState("")
   const [diffDays,setDiffDays]=useState(1)
   const [showRating,setShowRating]=useState(false)
   const [booked,setBooked]=useState(false)
   const [heartFilled,setHeartFilled]=useState(false)
   const [error,setError]=useState(false)
   const [comment,setComment]=useState()
    useEffect(() => {
        fetch(`http://localhost:3000/users/${props.selectedProp.Host_id}`)
            .then(function (response) {
                return response.json();

            })
            .then((d) => setHost(d))
           
    }, [props.selectedProp])
    const fetchThisProp=()=>{
        fetch('http://localhost:3000/properties/'+props.selectedProp._id)
        .then(function(response){
          return response.json();
        
        })
        .then((da)=>{
         d=da
        })
    }
 const calcTotal=()=>{
    var checkin=document.getElementById("checkindate").value
    var checkout=document.getElementById("checkoutdate").value
    if(checkin!=NaN && checkout!=NaN && checkin && checkout ){
        checkin=new Date(checkin)

        checkout=new Date(checkout)
        const diffTime = Math.abs(checkout - checkin);
        const diffdays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        setDiffDays(diffdays)
    }
   
   
    else{
        setDiffDays(1)
    }
   
 }
 var logMe = function () {
    navigate(`/`);
};
 const reserveBooking=()=>{
    if(d.isAvailable){
        setError(false)
        var nowDate = new Date(); 
        var checkindate =new Date(document.getElementById("checkindate").value )
        checkindate=checkindate.setHours(11,0,0)
        var todaydate = (nowDate.getMonth()+1)+'-'+nowDate.getDate() +"-"+nowDate.getFullYear() ; 
        var twodaysbefore = new Date(checkindate - (1 * 24 * 60 * 60 * 1000));
        var twodaysbefore1=(twodaysbefore.getMonth()+1)+'-'+twodaysbefore.getDate() +"-"+twodaysbefore.getFullYear() ; 
        fetch('http://localhost:3000/reservations',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({
                checkin: document.getElementById("checkindate").value,
                checkout:document.getElementById("checkoutdate").value,
                bookingDate: todaydate,
                adultCount: document.getElementById("adultc").value,
                childrenCount:document.getElementById("childrenc").value,
                infantCount:document.getElementById("infantc").value,
                cancellationDateMax:twodaysbefore1,
                property_id:d._id,
                guest_id: sessionStorage.getItem("userId"),
                paymentMode:'Credit/Debit',
                totalPrice: d.price+d.cleaningFee
    
            })
        })
        .then((res)=>res.json())
        .then(()=>{
            setBooked(true)
            setTimeout(logMe,4000)
            
          
        })
    }
    else{
setError(true)
    }
    

 }
 const addToFavourites=()=>{
    setHeartFilled(true)
    fetch("http://localhost:3000/favourites?userId="+sessionStorage.getItem("userId"),{
       method:'POST',
       headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          userId:sessionStorage.getItem("userId"),
          property:props.selectedProp._id
        })
  
    })
    .then((res)=>res.json())
 }
 
 const removeFromFavourites=()=>{
    setHeartFilled(false)
 
    fetch("http://localhost:3000/favourites/"+d._id,{
       method:'DELETE',
       headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          userId:sessionStorage.getItem("userId"),
          property:props.selectedProp._id
        })
  
    })
    .then((res)=>res.json())

 }
 const addRating=()=>{
    fetch("http://localhost:3000/properties/"+d._id,{
        method:'PUT',
        headers: {
           'Content-Type': 'application/json'
         },
       body:JSON.stringify({
        rating:[...d.rating,document.getElementById("customRange1").value],
        comments:[...d.comments,comment]
       })
  
     })
     .then((res)=>res.json())
     .then(()=>{
        setShowRating(false);
        fetchThisProp();
     })
   
 }
    return (
        <div className="row">
            <div className="col-md-12 col-sm-12">
                <div style={{ marginTop: "20px" }}>
                    <div className="row">
                    {booked && <div class="alert alert-success" role="alert">
  <h4 class="alert-heading">Booking Confirmed</h4>
  <p>Your Booking Is Confirmed at {d.title}</p>
  <hr/>

</div>}
                        <div style={{ marginLeft: "10px" }}>
                            <h3>{d.title}</h3>
                            <i class="fa-solid fa-heart"></i>
                            {!heartFilled && <div style={{float:"right"}}>Click the Heart to add to Favourites<i className="bi bi-heart" onClick={addToFavourites}></i></div>}
                            {heartFilled && <div style={{float:"right"}}>Click the Heart to remove from Favourites<i className="bi bi-heart-fill" onClick={removeFromFavourites}></i></div>}
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                            <h5>{d.city.toUpperCase() + "," + d.state.toUpperCase()}</h5>
                            {d.rating.length>0 && <i className="bi bi-star-fill"></i>}{d.rating.length>0 && (((d.rating.reduce((partialSum, a) => partialSum + parseInt(a), 0)))/d.rating.length).toFixed(1)}
                        </div>

                        <div className='col-md-12'>

                        {
                d.images.map((img)=>(
                    <img className="property-width1" src={`http://localhost:3000/${img}`} />
                ))
             }
                     


                        </div>
                        <div className='col-md-12 prop-desc'>
                            <h4> {`Hosted By ${host.first_name + " " + host.last_name}`}</h4>
                            {!props.userIsHost?!showRating ? <Button style={{float:"right"}} onClick={()=>setShowRating(true)}>Rate This Property</Button>
                            :<div style={{float:"right"}}>
                            <input type="range" id="customRange1" min="0"  max="5" step="0.5"  onChange={(e)=>e.target.nextSibling.textContent=e.target.value}/>
                            <span>5</span>
                            <div>
                            <p><label for="story">Add Comments:</label></p>

<textarea id="story" name="story" rows="5" cols="33" onChange={(e)=>setComment(e.target.value)}> </textarea>
                            </div>
                            <Button style={{marginLeft:'2px'}} onClick={addRating}>Click to Submit</Button>
                            </div>: null}
                        </div>
                         <p> {`${d.beds} Beds. ${d.baths} Bath. ${d.guests} Guests`}</p> 


                        <div className='col-md-8'>
                            <p style={{ fontFamily: "Baskerville " }}>{d.description}</p>
                        </div>

                        <div className='col-md-4 amenities' >
                            <h5>{`Price/night: $${d.price}`}</h5>
                            <h5>{`Cleaning Fee: $${d.cleaningFee}`}</h5>
                        </div>

                        <div className="row">
                            <div className='col-md-4' >
                                <h4>What this place offers</h4>
                                <ul className="list-group">
                                    {d.amenities.map((x, key) => {

                                        return <li className="list-group-item list-group-item-secondary" key={key} style={{ marginBottom: "10px" }}>{x}</li>
                                    })}
                                </ul>
                                <div className='ContactDiv'>
                                    <h3>Contact Details</h3>
                                    <h5>Email id: {host.email}</h5>
                                    <h5>Phone no: {host.phone_no}</h5>
                                </div>
                            </div>
                            <div className="col-md-3"></div>
                            {props.loggedin && <div className="col-md-5">
                                <div className="bookingBoxClass">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Check-in</label>
                                            <input className="form-control" type="date" id="checkindate" onChange={calcTotal} placeholder="mm-dd-yyyy" name="check-in" />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Check-out</label>
                                            <input className="form-control" type="date" id="checkoutdate" onChange={calcTotal} placeholder="mm-dd-yyyy" name="check-out" />
                                        </div>
                                    </div>

                                    <div className="dropdown col-md-12 btn-group btn-block" style={{ marginTop: "20px" }}>
                                        <button className="btn btn-secondary dropdown-toggle btn-block"
                                            type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            Guests
                                        </button>
                                        <ul className="dropdown-menu dropdown-custom btn-block" aria-labelledby="dropdownMenuButton1">
                                            <li className="li_class flex-check">
                                               
                                                    <div>
                                                        <p className="text-dark">Adults</p>
                                                    </div>
                                                    <div class="form-outline" style={{marginLeft:"10px"}}>
                                                        <input type="number" id="adultc" class="form-control" min="0" defaultValue={1}/>
                                                    </div>
                                              
                                            </li>
                                            <li className="li_class">
                                                <div className="d-flex">
                                                    <div>
                                                        <p className="text-dark">Children</p>
                                                    </div>
                                                    <div class="form-outline" style={{marginLeft:"10px"}}>
                                                        <input type="number" id="childrenc" class="form-control" min="0" defaultValue={1}/>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="li_class">
                                                <div className="d-flex">
                                                    <div>
                                                        <p className="text-dark">Infants</p>
                                                    </div>
                                                   
                                                    <div class="form-outline" style={{marginLeft:"10px"}}>
                                                        <input type="number" id="infantc" class="form-control" min="0" defaultValue={1}/>
                                                    </div>

                                                </div>
                                            </li>
                                        </ul>

                                    </div>

                                    <button type="button " className="btn btn-danger w-100" style={{marginTop:"20px"}} onClick={reserveBooking}>Reserve</button>
                                    <h5 style={{marginTop:"20px"}}>Cleaning Fee: ${d.cleaningFee}</h5>
                                    <h5 style={{marginTop:"20px"}}>Price for {diffDays} night/s: ${diffDays*d.price}</h5>
                                    {error && <div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Error! Cannot Book</h4>
  <p>This property is Unavailable</p>
  <hr/>
</div>}

                                </div>

                            </div>}
                        </div>







                    </div>
                </div>
            </div>
        </div>
    )
}
