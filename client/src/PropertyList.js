import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import {Carousel} from 'react-bootstrap'
export default function PropertyList(props) {
const navigate=useNavigate();
var data=props.data
const onClickHandler=(d)=>{
props.setSelectedProp(d);
props.setClicked(true)
var x= d.title.replaceAll(' ','')
navigate(`/details/${x}`);
}
useEffect(()=>{
   props.fetchProperties();
},[])
  return (
    <div className="row">
                  <div className="col-md-12 col-sm-12">
                     <div className="properties">
                        {data.map((d,key)=>(
                                 <div className="card card-css col-xs-12 col-md-6 col-lg-3 property-width" key={key}>
                             <Carousel className="property-width">
                              {d.images.map(d1 => (
                                 <Carousel.Item key={d1}>
                                    <img
                                    className="testimonialImages d-block w-100 carousal-image"
                                    src={`http://localhost:3000/${d1}`}
                                    />
                           
                                 </Carousel.Item>
                              ))}
                                 </Carousel>
                                 
                                
                                 <div className="card-body" onClick={()=>onClickHandler(d)}>
                                 <h4 className="card-title font-fam">{d.title}</h4>
                                    <h5 className="card-title Baskerville ">{d.city.toUpperCase()+","+d.state.toUpperCase()}</h5>
                                    <p className='font-fam'><strong>{"$"+d.price}</strong>/night</p>
                                    {d.rating.length>0 && <i className="bi bi-star-fill"></i>}{d.rating.length>0 && (((d.rating.reduce((partialSum, a) => partialSum + parseInt(a), 0)))/d.rating.length).toFixed(1)}
                                    
                                  
                                 </div>
                               
                              </div>
                        ))
                        }
                      


                     </div>
                  </div>
               </div>
  )
}
