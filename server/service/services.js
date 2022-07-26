import {database} from '../database/connection.js'

export const getAll = async (conditions = {}) =>{
    try{
        return await database.Services.findAll(conditions)
    }catch{
        return false
    }
}

export const getById = async (id) =>{
    try{
        return await database.Services.findByPk(id)
     
    }catch{
        return false
    }
}

export const exists = async (fields = {}) => {
    try{
        const count = await database.Services.count({
            where: fields})
        return count != 0
    }catch(e){
        console.log(e)
        return false
    }
}

export const update = async (id, data)=>{
    try{
        await database.Services.update(data, { where: {id} })
        return true
    }catch{
        return false
    }
}

export const insert = async(data) => {
    try{
        const service = new database.Services(data)
        await service.save()
        return service.dataValues.id
    }catch(e){
        console.log(e)
        return false
    }
}

export const remove = async (id) =>{
    try{
        const service = await getById(id)
        await service.destroy()
        return true
    }catch{
        return false
    }
}