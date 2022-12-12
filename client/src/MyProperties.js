import React,{useEffect,useState} from 'react'
import Button from 'react-bootstrap/Button';
export default function MyProperties(props) {
    const [data,setData]=useState()
    useEffect(()=>{
setData(props.hostProperties)
    },[props.hostProperties])
    var refreshMyProperties=()=>{
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
          setData(proplist)
        
        })

    }

    const markForDelete=(id)=>{
        fetch("http://localhost:3000/properties/"+id,{
      method:'PUT',
      headers: {
         'Content-Type': 'application/json'
         // 'Content-Type': 'application/x-www-form-urlencoded',
       },
      body:JSON.stringify({
         isAvailable:false
      })

   })
   .then((res)=>res.json())
   .then(()=>refreshMyProperties())
    }
    const markForUnDelete=(id)=>{
        fetch("http://localhost:3000/properties/"+id,{
      method:'PUT',
      headers: {
         'Content-Type': 'application/json'
       },
      body:JSON.stringify({
         isAvailable:true
      })

   })
   .then((res)=>res.json())
   .then(()=>refreshMyProperties())
    }

    useEffect(()=>{
        refreshMyProperties();
            },[data])
  return (
    <div className="row">
        <h3 className='myBooking'>My Properties</h3>
            {data?.map((d)=>(<React.Fragment> <div className="col-md-12 col-sm-12">
                <div style={{ marginTop: "20px" }}>
                    <div className="row">

                        <div style={{ marginLeft: "10px" }}>
                            <div style={{float:"right"}}>
                            {d.isAvailable?<button type="button" className="btn btn-danger" 
                            onClick={()=>markForDelete(d?._id)}>Mark This Property to Delete(Unavailable)</button>:
                            <button type="button" className="btn btn-info" 
                            onClick={()=>markForUnDelete(d?._id)}>Mark This Property As Available</button>}
                            </div>
                            <h5><strong>Title: &emsp;</strong>{d.title}</h5>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                            <h5><strong>City: &emsp;{d?.city.toUpperCase()}</strong></h5>
                            <h5><strong>State: &emsp;{d?.state.toUpperCase()}</strong></h5>
                            <h5><strong>Beds: &emsp;{d?.beds}</strong></h5>
                            <h5><strong>Baths: &emsp;{d?.baths}</strong></h5>
                            <h5><strong>Guests: &emsp;{d?.guests}</strong></h5>
                        
                        </div>

                        <div className='col-md-12'>
             {
                d.images.map((img)=>(
                    <img className="property-width1" src={`http://localhost:3000/${img}`} />
                ))
             }
    

                        </div>

                        <div className='col-md-4 amenities' >
                            <h5>{`Price/night: $${d?.price}`}</h5>
                            <h5>{`Cleaning Fee: $${d?.cleaningFee}`}</h5>
                        </div>

                        <div className="row">
                            <div className='col-md-4' >
                                <h4>What this place offers</h4>
                                <ul className="list-group">
                                    {d?.amenities.map((x, key) => {

                                        return <li className="list-group-item list-group-item-secondary" key={key} style={{ marginBottom: "10px" }}>{x}</li>
                                    })}
                                </ul>
                               
                            </div>
                          
                            
                        </div>


                    </div>
                </div>
            </div> <hr style={{height:'10px'}}/></React.Fragment>))}
            
        </div>
  )
}
