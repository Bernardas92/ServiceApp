import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default (props)=>{
    return(
            <div className="header mb-5">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
 
                <div className="collapse navbar-collapse" id="navbarsExample07">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Titulinis</Link>
                        </li>
                        {props.loggedIn === false && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Prisijungti</Link>
                        </li>
                        )}
                        {props.loggedIn === false && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/registration">Registracija</Link>
                            </li>
                        )}
                        {props.loggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/create-profile">Sukurti meistro profilį</Link>
                            </li>
                        )}
                        {props.loggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/create-service">Sukurti serviso profilį</Link>
                            </li>
                        )}
                        {/* {props.loggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/edit">Redaguoti profilį</Link>
                        </li>
                        )} */}
                        {props.loggedIn && (
                        <li className="nav-item">
                            <Link className='nav-link' to="/admin-panel">Meistrų sąrašas</Link>
                        </li>
                        )}
                         {props.loggedIn && (
                        <li className="nav-item">
                            <Link className='nav-link' to="/services">Servisų sąrašas</Link>
                        </li>
                        )}
                    </ul>
                </div>
                </div>
            </nav>
        </div>
    )
}