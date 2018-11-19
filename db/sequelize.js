const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const ArticleModel = require('./models/article');
// const ProfileModel = require('./models/comment');

const sequelize = new Sequelize('conduit', 'root', 'root', {
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const User = UserModel(sequelize, Sequelize);
const Article = ArticleModel(sequelize, Sequelize);

Article.belongsTo(User);

sequelize.sync()
    .then(() => {
        console.log('woooohooooo');
    });

module.exports = {
    User,
    Article
};