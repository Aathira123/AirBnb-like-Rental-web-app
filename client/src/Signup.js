import React,{useState} from 'react'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
export default function Signup(props) {
    const [error,setError]=useState(false)
    const showError = (input, message) => {
        
        var span1 = input.nextElementSibling
        span1.classList.add('error');
        span1.textContent = message;
    };
    const removeError=(input)=>{
        var span1 = input.nextElementSibling
        span1.textContent=""
    }
    const checkPasswordStrength = () => {
        const password = document.getElementById("password").value;
        let strengthBadge = document.getElementById('StrengthDisp');
        var strongPassword = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumPassword = new RegExp("^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        if (password == "") {
            strengthBadge.textContent = 'Password cannot be empty';
            setError(true)
            strengthBadge.style.color="red";
            strengthBadge.style.backgroundColor="transparent";
        }
        else if (strongPassword.test(password)) {
            strengthBadge.style.backgroundColor = "green";
            strengthBadge.textContent = 'Strong';
        } else if (mediumPassword.test(password)) {
            strengthBadge.style.backgroundColor = 'skyblue';
            strengthBadge.textContent = 'Medium';
        } else {
            strengthBadge.style.backgroundColor = 'red';
            strengthBadge.style.color="white";
            strengthBadge.textContent = 'Weak';
        }
    }
    const onSignUpSubmit = (e) => {
        e.preventDefault();
        const firstname = document.getElementById("firstname");
        const lastname = document.getElementById("lastname");
        const email = document.getElementById("email");
        const phoneno = document.getElementById("contact");
        var pass=document.getElementById("password")
   
        if (firstname.value == "") {
        showError(firstname,"Firstname is mandatory")
            setError(true)
        }
        else{
           removeError(firstname)
           setError(false)
        }
        if (lastname.value == "") {
            showError(lastname,"Lastname is mandatory")
            setError(true)
            
        }
        else{
            removeError(lastname)
            setError(false)
        }
        if (pass.value == "") {
            showError(pass,"Password is mandatory")
            setError(true)
          
        }
        else{
            removeError(pass)
            setError(false)
        }
        if (email.value == "") {

            showError(email,"EmailId is mandatory")
            setError(true)
        }
        else{
            removeError(email)
            setError(false)
        }
        if (phoneno.value == "") {
            showError(phoneno,"Phone no is mandatory")
            setError(true)
           
        }
        else{
            removeError(phoneno)
            setError(false)
        }
        if(phoneno.value.match(/\d/g).length!=10){
            showError(phoneno,"Phone number should be 10 digits")
            setError(true)
        }
        else{
            removeError(phoneno)
            setError(false)
        }
      if(!error){
        fetch("http://localhost:3000/users/register",
        {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body:JSON.stringify({
                first_name: firstname.value,
                last_name:lastname.value,
                phone_no:phoneno.value,
                email:email.value,
                password:pass.value
            })
        })
        .then((res)=>res.json())
        .then((res)=>{
            if(res.error){
                var sp=document.getElementById('reserror');
                sp.textContent=res.error
                sp.style.color="red"
            }
            else{
                props.setSignUpModalOpen(false)
            }
          }
            )
      }

        
    }
    return (

        <Modal show={props.signUpModalOpen} onHide={() => props.setSignUpModalOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>SignUp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" >
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" id="firstname"  />
<span></span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" id="lastname" />
                        <span></span>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Contact No</Form.Label>
                        <Form.Control type="tel" placeholder="123-45-678" id="contact" />
                        <span></span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" id="email" />
                        <span></span>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" id="password" onChange={checkPasswordStrength} />
                        <span id="StrengthDisp" class="badge displayBadge" style={{ display: "block", color:"red", marginTop: "10px" }}>Password Cannot be Empty</span>
                        <span></span>
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e)=>onSignUpSubmit(e)} >
                        Submit
                    </Button>
                    <span id="reserror"></span>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.setSignUpModalOpen(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
