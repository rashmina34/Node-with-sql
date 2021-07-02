'use strict';
module.exports = (sequelize, DataTypes) => {
  const Signup = sequelize.define('Signup', {
    full_name: DataTypes.STRING,
    company_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.INTEGER,
    discovery_data: DataTypes.DATE,
    added_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {});
  Signup.associate = function(models) {
    // associations can be defined here
  };
  return Signup;
};