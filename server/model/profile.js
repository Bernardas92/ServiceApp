import {DataTypes} from 'sequelize'
import {users} from './users.js'

export const profile = (sequelize) => {
    const schema = {
        name: {type: DataTypes.STRING, allowNull: false},
        surname: {type: DataTypes.STRING, allowNull: false},
        specialization: {type: DataTypes.STRING, allowNull: false},
        profile_image: {type: DataTypes.STRING, allowNull: false},
        service_name: {type: DataTypes.STRING, allowNull: false},
        city: {type: DataTypes.STRING, allowNull: false},
        likes: {type: DataTypes.INTEGER}
    }

    const Profile = sequelize.define('Profile', schema)

    return Profile
}