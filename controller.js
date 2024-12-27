// controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Middleware to check token
function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}

// Controller methods
const AuthController = {
    welcome(req, res) {
        res.status(200).json({ msg: 'Bem-vindo à API' });
    },

    async getUser(req, res) {
        const id = req.params.id;
        const user = await User.findById(id, "-password");

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        res.status(200).json({ user });
    },

    async registerUser(req, res) {
        const { name, email, password, confirmepassword } = req.body;

        if (!name || !email || !password || !confirmepassword) {
            return res.status(422).json({ msg: 'Todos os campos são obrigatórios' });
        }

        if (password !== confirmepassword) {
            return res.status(422).json({ msg: 'As senhas não são iguais' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(422).json({ msg: 'O email já foi utilizado' });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: passwordHash });

        try {
            await user.save();
            res.status(201).json({ msg: 'Usuário criado com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao registrar usuário' });
        }
    },

    async loginUser(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ msg: 'Todos os campos são obrigatórios' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(422).json({ msg: 'Senha inválida' });
        }

        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({ id: user._id, name: user.name }, secret);
            res.status(200).json({ msg: 'Autenticação realizada com sucesso', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao autenticar usuário' });
        }
    }
};

module.exports = { AuthController, checkToken };

