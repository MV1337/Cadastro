const express = require('express')
const router = express.Router()
const AuthController = require('../Controller/AuthController')

router.get('/home', AuthController.home)
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/logout', AuthController.logout)



module.exports = router