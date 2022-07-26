import express from 'express'
import Joi from 'joi'
import validator from '../middleware/validator.js'
import auth from '../middleware/authentication.js'
import { exists, insert, getAll, getById, update, remove } from '../service/services.js'
import {Op} from 'sequelize'

const Router = express.Router()

const servicesSchema = (req, res, next) =>{
    const schema = Joi.object({
        service_name: Joi.string().required(),
        city: Joi.string().required()
    })

    validator(req, next, schema)
}

Router.get('/', async(req,res)=>{
    const services = await getAll()
    if(services){
        res.json({message: services, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.post('/create', servicesSchema, async (req, res) =>{
    // console.log(req.body)

    if(await exists({
        UserId: req.body.UserId
    })){
        res.json({status: 'danger', message: 'Servisas šiam vartotojui jau sukurtas'})
        // return
    }else{
       
        let ServiceId = false
        if(ServiceId = await insert(req.body)){
            
            res.json({status: 'success', message: 'Servisas sėkmingai sukurtas'})
        }else{
            res.json({status: 'danger', message: 'Įvyko klaida'})
        }
    } 
})

Router.put('/update/:id', servicesSchema, async (req, res)=>{
    const id = req.params.id
    const service = req.body
    try{
        await update(id, service)
        res.json({message: "Servisas sėkmingai atnaujintas", status: 'success'})
    }catch{
        res.json({message: 'Servisas nebuvo atnaujintas', status: 'danger'})
    }
})

Router.delete('/delete/:id', async (req, res)=>{
    const id = req.params.id
    try{
        await remove(id)
        res.json({message: "Servisas sėkmingai ištrintas", status: 'success'})
    }catch{
        res.json({message: 'Servisas nebuvo ištrintas', status: 'danger'})
    }
})

export default Router