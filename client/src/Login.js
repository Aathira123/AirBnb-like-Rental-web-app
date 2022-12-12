import React from 'react'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
export default function Login(props) {
  const loginSubmit=(e)=>{
  
 e.preventDefault()
    fetch("http://localhost:3000/users/login",
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body:JSON.stringify({

            email:document.getElementById("email").value,
            password:document.getElementById("pass").value
        })
    })
    .then((res)=>res.json())
    .then((res)=>{
      
      if(!res.error){
        props.setLoggedIn(true)
        sessionStorage.setItem("userId",JSON.parse(atob(res.token.split('.')[1])).user_id)
       
        props.setUserIsHost(res.isHost)
        props.setLoginModalOpen(false)
       
      }
      else{
        var sp=document.getElementById('reserror');
        sp.textContent=res.error
        sp.style.color="red"
      }
    
    })
  }

  return (
    
    <Modal show={props.loginModalOpen} onHide={()=>props.setLoginModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" id="email" />

      </Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" id="pass"/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={(e)=>loginSubmit(e)}>
        Submit
      </Button>
      <span id="reserror"></span>
    </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>props.setLoginModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}
