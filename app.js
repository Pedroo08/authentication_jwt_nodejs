require(`dotenv`).config()

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()

//config JSON 
app.use(express.json())

//Crendeciais
const dbuser = process.env.DB_USER;
const dbpass= process.env.DB_PASS;
const linkConnect = `mongodb+srv://${dbuser}:${dbpass}@authcluster.zg0ujac.mongodb.net/?retryWrites=true&w=majority&appName=AuthCluster`;

// models 
const User = require('./models/User')

mongoose.connect(linkConnect)   
    .then((err) => {
        console.log('Conectou ao Banco');
        app.listen(8080);
    })
    .catch((err)=>{console.log(err)})


    //public route
app.get('/',(req ,res) => {  
    res.status(200).json({msg: 'Bem- vindo a API'})
})

//private route
app.get("/user/:id",checkToken,async (req ,res) => {  

    const id = req.params.id;
    const user = await User.findById(id, "-password");

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
      }

    res.status(200).json({ user });
})


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





//register User
app.post('/auth/register',async(req,res) =>{
    const {name,email,password,confirmepassword} = req.body

    //validation
    if(!name){
        return res.status(422).json({msg:'o nome é obrigatório'})
    }

    if(!email){
        return res.status(422).json({msg:'o email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg:'o password é obrigatório'})
    }

    if(!confirmepassword){
        return res.status(422).json({msg:'o confirmpassword é obrigatório'})
    }

    if(password != confirmepassword ){
        return res.status(422).json({msg:'As senhas não são igauis'})
    }

    const userEXists = await User.findOne({email : email})

    if(userEXists){
        return res.status(422).json({msg:'O email já foi utilizado'})
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password,salt)


    //create user
    const user = User({
        name,
        email,
        password : passwordHash
    })

    try{

        await user.save();
        res.status(201).json({msg: 'Usuário criado com sucesso'})

    }catch(error){
        console.log(error)
        res.status(500).json({msg:'A conteceu um erro no servidor'})
    }


})


//Login
app.post("/auth/login",async (req,res)=>{
    const {email,password} = req.body

    //validations
    if(!email){
        return res.status(422).json({msg:'o email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg:'o password é obrigatório'})
    }

    //Check if user exist
    const user = await User.findOne({email : email})

    if(!user){
        return res.status(404).json({msg:'Usuario não encontrado'})
    }

    // check if passeord match
    const checkPassword = await bcrypt.compare(password,user.password)

    if(!checkPassword){
        return res.status(422).json({msg:'Senha inválida'})
    }

    try{
        const secret = process.env.SECRET
        const token  = jwt.sign({
            id:user._id,
            name: user.name
            },
        secret,
        )

        res.status(200).json({msg:"Autenticação relaizada com sucesso",token})

    }catch(error){
        console.log(error)
        res.status(500).json({msg:'A conteceu um erro no servidor'})
    }
})