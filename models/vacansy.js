module.exports = (sequelize, DataTypes) => {
    const Vacancy = sequelize.define('Vacancy', {
        'header': DataTypes.STRING,
        'body': DataTypes.TEXT,
        'link': DataTypes.STRING
    });

    return Vacancy;
};