import React from 'react'
import axios from "axios"
import {Link, Navigate, useNavigate} from 'react-router-dom'

export default (props) =>{
    const date = new Date(props.profile.createdAt)

    const navigate = useNavigate()

    const handleApprove = async () => {
        const form = props.profile;
        form.approved = 1;
        await axios.put(`/api/profile/update/${props.profile.id}`, form)
        .then((resp)=>{
            if(resp.data.status === "success"){
                props.setMessages({
                    message: resp.data.message,
                    status: resp.data.status
                })
            }
        })
        .catch(()=>{
            props.setMessages({
                message: "Profilis nepatvirtintas",
                status: "danger"
            })
        })
    }

    const handleDelete = async () => {
        await axios.delete(`/api/profile/delete/${props.profile.id}`)
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
                message: "Profilio nepavyko ištrinti",
                status: "danger"
            })
        })
    }

    const handleEdit = () => {
        navigate(`/edit/${props.profile.id}`)
    }

    return(
        <div className="col">
            <div className="card shadow-sm">
                {/* <Link to={"/profile/" + props.profile.id}> */}
                <img className="bd-placeholder-img card-img-top"
                src={props.profile.profile_image}
                alt='Profilio nuotrauka'
                />
                {/* </Link> */}
                <div className="card-body">
                <p className="card-text h3 text-center">{props.profile.name}</p>
                    <p className="card-text h3 text-center">{props.profile.surname}</p>
                    <p className="card-text h4 text-center">Specializacija:</p>
                    <p className="card-text h4 text-center">{props.profile.specialization}</p>
                    <p className="card-text h5 text-center">Servisas: {props.profile.service_name}</p>
                    <p className="card-text h5 text-center">{props.profile.city}</p>
                    <p className="card-text h5 d-flex justify-content-end">Patinka: {props.profile.likes}</p>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-info m-2' onClick={handleEdit}>Redaguoti</button>
                        <button className='btn btn-danger m-2' onClick={handleDelete}>Ištrinti</button>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                        <small className="text-muted">{date.toLocaleDateString('lt-LT')}</small>
                    </div>
                    {/* <button className='btn btn-info m-2' onClick={handleApprove}>Patvirtinti</button> */}
                    
                </div>
            </div>
        </div>
    )
}