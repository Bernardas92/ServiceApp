import {database} from '../database/connection.js'

export const getAll = async (conditions = {}) =>{
    try{
        return await database.Profile.findAll(conditions)
    }catch{
        return false
    }
}

export const getApproved = async () =>{
    try{
        return await database.Profile.findAll({where:{approved: 1}}, {raw: true})
    }catch{
        return false
    }
}

export const getById = async (id) =>{
    try{
        return await database.Profile.findByPk(id)
        // return await database.Profile.findByPk(id, {raw: true})
    }catch{
        return false
    }
}

export const getByUserId = async (id) =>{
    try{
        return await database.Profile.findOne({where:{UserId: id}}, {raw: true})
    }catch{
        return false
    }
}

export const exists = async (fields = {}) => {
    try{
        const count = await database.Profile.count({
            where: fields})
        return count != 0
    }catch(e){
        console.log(e)
        return false
    }
}

export const update = async (id, data)=>{
    try{
        await database.Profile.update(data, { where: {id} })
        return true
    }catch{
        return false
    }
}

export const insert = async(data) => {
    try{
        const profile = new database.Profile(data)
        await profile.save()
        return profile.dataValues.id
    }catch(e){
        console.log(e)
        return false
    }
}

export const insertDonation = async(data) => {
    try{
        const donation = new database.Donations(data)
        await donation.save()

    }catch(e){
        console.log(e)
        return false
    }
}

export const remove = async (id) =>{
    try{
        const profile = await getById(id)
        await profile.destroy()
        return true
    }catch{
        return false
    }
}