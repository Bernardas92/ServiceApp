import express from 'express'
import Joi from 'joi'
import multer from 'multer'
import{access, mkdir} from 'fs/promises'
import validator from '../middleware/validator.js'
import auth from '../middleware/authentication.js'
import { exists, insert, getAll, getById, getByUserId, update, getApproved, remove, insertDonation } from '../service/profile.js'
import {Op} from 'sequelize'

const Router = express.Router()

const diskStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const path = './uploads/' //+ req.body.UserId
        try{
            await access(path)
        }catch{
            await mkdir(path, {recursive: true})
        }
        cb(null, path)      
    },
    filename: (req, file, callback) => {
        const ext = file.originalname.split('.')
 
        callback(null, Date.now() + '.' + ext[1])
    }
  })

  const upload = multer({
    storage: diskStorage,
    fileFilter: (req, file, callback) => {
        //Atliekamas failu formato tikrinimas
        if(
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif'
        ) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }
})


const profileSchema = (req, res, next) =>{
    const schema = Joi.object({
        name: Joi.string().required(),
        surname: Joi.string().required(),
        specialization: Joi.string().required(),
        service_name: Joi.string().required(),
        city: Joi.string().required(),
        likes: Joi.number()
    })

    validator(req, next, schema)
}

const donationSchema = (req, res, next) =>{
    const schema = Joi.object({
        donator: Joi.string(),
        donation: Joi.number()
    })

    validator(req, next, schema)
}

Router.get('/', async(req,res)=>{
    const profiles = await getAll()
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/approved', async(req,res)=>{
    const profiles = await getApproved()
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get("/history/:id", async (req, res) =>{
    const id = req.params.id; // Ar nereiks splitinti, kad panaikinti ":"
    let entries = await getById(id);
    if(entries){
        const history = await profileHistory(entries.id);
        res.json({status: "success", message: history});
    }else{
        res.json({status: "danger", message: "Nepavyko surasti profilio"})
    }
})

Router.get('/sort/asc', async(req,res)=>{
    const profiles = await getAll({
        order: [
            ['headline', 'ASC']
        ]
    })
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/sort/desc', async(req,res)=>{
    const profiles = await getAll({
        order: [
            ['headline', 'DESC']
        ]
    })
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/filter/specialization/:specialization', async(req,res)=>{
    const specialization = req.params.specialization
    const like_string = '%' + specialization + '%'
    const profiles = await getAll({
        where: {
            specialization:
            {
                [Op.like]: like_string
            }
        }
    })
    if(profiles){
        res.json({message: profiles, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.get('/single/:id', async (req, res)=>{
    const id = req.params.id
    const profile = await getById(id)
    if(profile){

        res.json({message: profile, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

const profileFileFields = upload.fields([
    {name: 'profile_image', maxCount: 1}

]) 

Router.post('/create', profileFileFields, profileSchema, async (req, res) =>{

    if(await exists({
        UserId: req.body.UserId
    })){
        res.json({status: 'danger', message: 'Profilis šiam vartotojui jau sukurtas'})
        // return
    }else{
        if(req.files.profile_image){
            let image = req.files.profile_image[0]
            let path = image.path.replaceAll('\\', '/') 
            req.body.profile_image = path
        }
        let ProfileId = false
        if(ProfileId = await insert(req.body)){
          
            res.json({status: 'success', message: 'Profilis sėkmingai sukurtas'})
        }else{
            res.json({status: 'danger', message: 'Įvyko klaida'})
        }
    } 
})

Router.post('/donate/:id', donationSchema, async (req, res) =>{

    const profileId = req.params.id
    const splitProfileId = profileId.split(":")
    console.log("splitProfileId: ", splitProfileId)
    console.log("ProfileID: ", profileId)
    console.log("req.body: ", await req.body)
    const data = await req.body
    data.ProfileId = splitProfileId[1]
    console.log("DATA: ", data)
 
        try{
            await insertDonation(data)
            
            res.json({status: 'success', message: 'Auka sėkmingai priskirta'})
        }catch{
            res.json({status: 'danger', message: 'Įvyko klaida'})
        } 
})

Router.get('/edit/:user_id', auth, async (req, res)=>{
    const user_id = req.params.user_id
    const profile = await getByUserId(user_id)
    if(profile){
        const portfolio = await portfolioItems(profile.id)
        if(portfolio)
            profile.portfolio = portfolio
        res.json({message: profile, status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})

Router.put('/update/:id', profileSchema, async (req, res)=>{
    const id = req.params.id
    const profile = req.body
    try{
        await update(id, profile)
        res.json({message: "Profilis sėkmingai atnaujintas", status: 'success'})
    }catch{
        res.json({message: 'Profilis nebuvo atnaujintas', status: 'danger'})
    }
})

Router.delete('/delete/:id', async (req, res)=>{
    const id = req.params.id

    try{
        await remove(id)

        res.json({message: "Profilis sėkmingai ištrintas", status: 'success'})
    }catch{
        res.json({message: 'Profilis nebuvo ištrintas', status: 'danger'})
    }
})

Router.put('/update/', auth, profileSchema, async (req, res)=>{
    // const user_id = req.body.UserId  //Paimame userio id is perduodamos informacijos
    const id = req.body.id
    // const profile = await getById(id) //susirandam profilio informacija pagal userio id

    if(await update(id, req.body)){
        res.json({message: 'Profilis sėkmingai atnaujintas', status: 'success'})
    }else{
        res.json({message: 'Įvyko klaida', status: 'danger'})
    }
})



export default Router