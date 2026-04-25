import { Router } from 'express';
import {
  getDatabaseUsers,
  insertOneUser,
  insertManyUsers,
  updateOneUser,
  updateManyUsers,
  replaceOneUser,
  deleteOneUser,
  deleteManyUsers,
} from '../controllers/databaseController.js';

const router = Router();

router.get('/users', getDatabaseUsers);

router.post('/users/insert-one', insertOneUser);
router.post('/users/insert-many', insertManyUsers);

router.put('/users/update-one', updateOneUser);
router.put('/users/update-many', updateManyUsers);
router.put('/users/replace-one', replaceOneUser);

router.delete('/users/delete-one', deleteOneUser);
router.delete('/users/delete-many', deleteManyUsers);

export default router;