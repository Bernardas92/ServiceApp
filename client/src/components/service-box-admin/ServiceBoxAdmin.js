import React from 'react'
import axios from "axios"
import {Link} from 'react-router-dom'

export default (props) =>{
    const date = new Date(props.service.createdAt)


    const handleDelete = async () => {
        await axios.delete(`/api/services/delete/${props.service.id}`)
        .then((resp)=>{
            if(resp.data.status === "success"){
                props.setMessages({
                    message: resp.data.message,
                    status: resp.data.status
                })
                setTimeout(()=>{
                    window.location.reload()
                }, 1000)
                }
            })
        .catch(()=>{
            props.setMessages({
                message: "Serviso nepavyko ištrinti",
                status: "danger"
            })
        })
    }

    return(
        <div className="col">
            <div className="card shadow-sm">
                <div className="card-body">
                    <p className="card-text h5 text-center">Servisas: {props.service.service_name}</p>
                    <p className="card-text h5 text-center">{props.service.city}</p>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-danger m-2' onClick={handleDelete}>Ištrinti</button>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                        <small className="text-muted">{date.toLocaleDateString('lt-LT')}</small>
                    </div>
                </div>
            </div>
        </div>
    )
}