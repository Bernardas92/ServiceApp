import {DataTypes} from 'sequelize'
import {users} from './users.js'

export const services = (sequelize) => {
    const schema = {
        service_name: {type: DataTypes.STRING, allowNull: false},
        city: {type: DataTypes.STRING, allowNull: false}
    }

    const Services = sequelize.define('Services', schema)

    return Services
}