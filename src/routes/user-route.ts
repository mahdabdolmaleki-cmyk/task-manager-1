import express from 'express'
import {createUser, deleteUser, getAll, updateUser} from '../controllers/use-controller'

const router = express.Router()

router.get('/',getAll)
router.post('/',createUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)

export default router