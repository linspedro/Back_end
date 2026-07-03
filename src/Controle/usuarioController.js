const userService = require("../Servicos/userService");

exports.findAll = async (req, res) => {
  try {
    const users = await userService.findAll();

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await userService.create({
      name,
      email,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
