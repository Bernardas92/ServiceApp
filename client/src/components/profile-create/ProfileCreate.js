import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import React, {useState} from 'react'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

// const userid = 4 // Statinis userio ID

export default ()=>{

    const [profileForm, setProfileForm] = useState({
        name: '',
        surname: '',
        specialization: '',
        profile_image: '',
        service_name: '',
        city: '',
        likes: 0
    })

    const [messages, setMessages] = useState({message: '', status: ''})
    const navigate = useNavigate()

    const handleInputChange = (e) =>{
        setProfileForm({
            ...profileForm,
            [e.target.name]:e.target.value
        })
    }

    const handleFileChange =(e) =>{
        setProfileForm({...profileForm, [e.target.name]: e.target.files[0]})
    }

    const handleValidation = () =>{
        for(let index of Object.keys(profileForm)){
            // if(index === 'hourly_rate' && profileForm[index]< 0)
            //     return false
            if(profileForm[index] === ''){
                return false
            }
        }
        return true    
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        
        if(!handleValidation()){
            setMessages({message: 'Netinkamai užpildyta forma', status: 'danger'})
            return false
        }

        // profileForm.UserId = userid

        const form = new FormData();
        Object.entries(profileForm).map((data) => {
        form.append(data[0], data[1]);
        });

        axios.post('/api/profile/create/', form)
        .then(resp => {
            // console.log(resp.data)
            if(resp.data.status === 'success'){
                setTimeout( ()=> {
                    navigate('/admin-panel')
                }, 2000)
            }else{
                setMessages({message: resp.data.message, status: resp.data.status})
            }
        })
        .catch(()=>{
            setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }

    return(
    <Container>
        <div className="profileCreate">
            <h1>Naujo meistro registravimas</h1>
            {messages.message && (
                <Alert variant={messages.status}>{messages.message}</Alert>
            )}
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Meistro vardas</label>
                {/* <textarea className="form-control" name="description" rows="6" value={profileForm.description} onChange={(e)=>handleInputChange(e)}></textarea> */}
                <input type="text" name="name" className="form-control" value={profileForm.name} onChange={(e)=>handleInputChange(e)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Meistro pavardė</label>
                <input type="text" name="surname" className="form-control" value={profileForm.surname} onChange={(e)=>handleInputChange(e)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Specializacija</label>
                <input type="text" name="specialization" className="form-control" value={profileForm.specialization} onChange={(e)=>handleInputChange(e)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Meistro nuotrauka</label>
                <input type="file" className="form-control" name="profile_image" onChange={(e)=>handleFileChange(e)}/>
            </div>
            <div className="mb-3">
                <label className="form-label">Serviso pavadinimas</label>
                <input type="text" name="service_name" className="form-control" value={profileForm.service_name} onChange={(e)=>handleInputChange(e)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Miestas</label>
                <input type="text" name="city" className="form-control" value={profileForm.city} onChange={(e)=>handleInputChange(e)} />
            </div>
            <Button type="submit" variant="primary">Kurti meistro profilį</Button>
            </form>
        </div>
    </Container>
    )
}