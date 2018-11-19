
module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        token: {
            type: type.STRING,
            allowNull: true
        },
        username: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        bio: {
            type: type.STRING
        },
        image: {
            type: type.STRING,
            validate: {
                isUrl: true,
                allowNull: true
            }
        },
        hash: {
            type: type.TEXT
        },
        salt: {
            type: type.STRING
        }
    })
};