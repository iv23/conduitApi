module.exports = (sequelize, type) => {
    return sequelize.define('article', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
          type: type.STRING,
          unique: true,
          validate: {
              isLowercase: true
          }
        },
        title: {
            type: type.STRING
        },
        description: {
            type: type.STRING
        },
        body: {
            type: type.STRING
        },
        createdAt: {
            type: type.DATE,
        },
        updatedAt: {
            type: type.DATE,
        }
    })
};