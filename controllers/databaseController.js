import UserModel from '../models/UserModel.js';

export async function getDatabaseUsers(req, res) {
  try {
    const users = await UserModel.find({}, { name: 1, email: 1, age: 1, _id: 0 });

    res.render('ejs/databaseUsers.ejs', {
      title: 'MongoDB Users',
      users,
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
}

export async function insertOneUser(req, res) {
  try {
    const user = await UserModel.create(req.body);
    res.send(`User created: ${user.name}`);
  } catch (error) {
    res.status(500).send('Error creating user');
  }
}

export async function insertManyUsers(req, res) {
  try {
    const users = await UserModel.insertMany(req.body);
    res.send(`Users created: ${users.length}`);
  } catch (error) {
    res.status(500).send('Error creating users');
  }
}

export async function updateOneUser(req, res) {
  try {
    const result = await UserModel.updateOne(
      { email: req.body.email },
      { $set: req.body.update }
    );

    res.send(`Updated users: ${result.modifiedCount}`);
  } catch (error) {
    res.status(500).send('Error updating user');
  }
}

export async function updateManyUsers(req, res) {
  try {
    const result = await UserModel.updateMany(
      { age: { $lt: req.body.age } },
      { $set: req.body.update }
    );

    res.send(`Updated users: ${result.modifiedCount}`);
  } catch (error) {
    res.status(500).send('Error updating users');
  }
}

export async function replaceOneUser(req, res) {
  try {
    const result = await UserModel.replaceOne(
      { email: req.body.email },
      req.body.newUser
    );

    res.send(`Replaced users: ${result.modifiedCount}`);
  } catch (error) {
    res.status(500).send('Error replacing user');
  }
}

export async function deleteOneUser(req, res) {
  try {
    const result = await UserModel.deleteOne({ email: req.body.email });

    res.send(`Deleted users: ${result.deletedCount}`);
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
}

export async function deleteManyUsers(req, res) {
  try {
    const result = await UserModel.deleteMany({ age: { $lt: req.body.age } });

    res.send(`Deleted users: ${result.deletedCount}`);
  } catch (error) {
    res.status(500).send('Error deleting users');
  }
}