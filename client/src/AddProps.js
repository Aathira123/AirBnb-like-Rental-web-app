import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
export default function AddProps(props) {
    const addPropFetch=()=>{
        var imgfiles=document.querySelector('input[type="file"]').files;
        imgfiles=[...imgfiles]
      

        let bedBathGuest={
            'beds':document.getElementById("bed").value,
            'baths':document.getElementById("bath").value,
            'guests':document.getElementById("guest").value
        
      }
        let formdata=new FormData();
        formdata.append("title",document.getElementById("title").value);
        formdata.append("city",document.getElementById("citystate").value.split(",")[0]);
        formdata.append("state", document.getElementById("citystate").value.split(",")[1]);
        formdata.append("zipcode",document.getElementById("zip").value);
        formdata.append("cleaningFee",document.getElementById("cleaningfee").value);
        formdata.append("description",document.getElementById("desc").value);
        formdata.append("price",document.getElementById("price").value);
        formdata.append("amenities",document.getElementById("amenities").value);
        formdata.append("Host_id",sessionStorage.getItem("userId"))
        for ( var key in bedBathGuest ) {
            formdata.append(key, bedBathGuest[key]);
        }
        
        
        for (const file of imgfiles)
            formdata.append('files', file)
           

       fetch("http://localhost:3000/properties",{
        method:'POST',
      
        body:formdata
   
      })
      .then((res)=>res.files)
      .then((res)=>{
        props.setAddPropsModal(false)
        props.fetchProperties();
      })
    }

      
    
  return (
    <Modal show={props.addPropsModal} size="lg" onHide={()=>props.setAddPropsModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Add Property</Modal.Title>
    </Modal.Header>
    <Modal.Body>

    <Form id="test" enctype="multipart/form-data">
      <Form.Group className="mb-4">
        <Form.Label>Property Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Title for Property" id="title" />
</Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>City,State</Form.Label>
        <Form.Control type="text" placeholder="Enter City,State" id="citystate"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Zipcode</Form.Label>
        <Form.Control type="number" placeholder="Enter Zipcode" id="zip"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Cleaning Fee</Form.Label>
        <Form.Control type="number" placeholder="Cleaning Fee" id="cleaningfee"/>
      </Form.Group>
      <Form.Group className="mb-3 input-lg" >
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" placeholder="Description of the property" id="desc"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Property Price</Form.Label>
        <Form.Control type="number" placeholder="Enter price of property" id="price"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Amenities</Form.Label>
        <Form.Control type="text" placeholder="Enter Amenities(Comma Separated)" id="amenities"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>No Of Beds</Form.Label>
        <Form.Control type="number" placeholder="No of Beds" id="bed"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>No Of Baths</Form.Label>
        <Form.Control type="number" placeholder="No of Baths" id="bath"/>
      </Form.Group>
  
    <Form.Group className="mb-3" >
        <Form.Label>No Of Guests</Form.Label>
        <Form.Control type="number" placeholder="No of Guests" id="guest"/>
      </Form.Group>
      <Form.Group controlId="formFileMultiple" className="mb-3" id="imagesfile">
        <Form.Label>Upload Atleast 3 Images of Property</Form.Label>
        <Form.Control type="file" multiple name="files"/>
      </Form.Group>
    </Form>
 
 
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={()=>props.setAddPropsModal(false)}>
        Close
      </Button>
      <Button variant="primary" onClick={addPropFetch}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
  )
}
