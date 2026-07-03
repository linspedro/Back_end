const db = require("../Config/db");

exports.findAll = async () => {
  const result = await db.query("SELECT * FROM users ORDER BY id");

  return result.rows;
};

exports.create = async ({ name, email }) => {
  const result = await db.query(
    `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *
    `,
    [name, email],
  );

  return result.rows[0];
};
