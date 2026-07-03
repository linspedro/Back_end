const userRepository = require("../Repositorio/userRepository");

exports.findAll = async () => {
  return await userRepository.findAll();
};

exports.create = async (data) => {
  return await userRepository.create(data);
};
