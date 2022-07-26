import React, { useState, useEffect } from "react"
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import ServiceBoxAdmin from '../service-box-admin/ServiceBoxAdmin.js'

export default () => {

    const [services, setServices] = useState([])
    // const [filter, setFilter] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [messages, setMessages] = useState({message: "", status: ""})

    useEffect(()=>{
    axios.get('/api/services/')
        .then(resp => {
            setIsLoading(false)

            if(resp.data.status === 'success')
                setServices(resp.data.message)
        })
        .catch(()=>{
            setIsLoading(false)
            // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }, [])

     const List = () => {
        return services.map((value, index)=>(
            <ServiceBoxAdmin key={index} setMessages={setMessages} service={value}/>
        ))
    }

    const ListContainer = () =>{
        return(
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 pt-5">
             <List />
             </div>
        )
    }

  
    return(
        <Container>
            <h1>Servisų sąrašas:</h1>
            {isLoading ?
             'Duomenys kraunasi...':(
                 <>
                   
                    {messages.message && (
                        <Alert variation={messages.status}>{messages.message}</Alert>
                    )}
                    <ListContainer />
                </>
             )
             }
        </Container>
    )
}