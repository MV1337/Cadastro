const User = require('../Models/User')

const bcrypt = require('bcryptjs')
const flash = require('express-flash')

module.exports = class AuthController {

    static home(req, res) {
        res.render('auth/home')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const { name, email, password, confirmpassword } = req.body

        if (password.length < 8) {
            req.flash('message', 'Sua senha é muito curta!')
            res.render('auth/register')
            return
        }

        
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        
        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash("message", 'E-mail já existente no banco!')
            res.render('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            req.flash('message', 'Registration successful')

            req.session.save(() => {
                res.redirect('/home')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        const { email, password } = req.body

        
        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return
        }

        
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')

            return
        }
        
        req.session.userid = user.id 
        
        
        req.session.save(() => {
            res.redirect('/home')
            req.flash('message', '')
        })
    }

    static async logout(req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}