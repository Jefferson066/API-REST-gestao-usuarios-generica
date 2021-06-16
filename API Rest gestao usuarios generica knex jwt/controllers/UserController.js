const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = "hnweqr80ugh0q387vh3ug3uvbIUOGBUYG380gh398ghp234gbLJKHVBUYFGV897LJHB976";

class UserController{

    async index(req,res){
        let users = await User.findAll();
        res.json(users);
    };

    async findUser(req, res){
        let id = req.params.id;
        let user = await User.findById(id);

        if(user == undefined){
            res.status(404);
            res.json({err:"Usuário não encontrado"});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res){
        let {name, email, password, role = 0} = req.body;

        
        if(password === undefined || password ==="" || password.length < 2){
            res.status(400);
            res.json({err:"Senha invalida!"});
            return;
        }


        if(email === undefined || email ==="" || email.length < 2){
            res.status(400);
            res.json({err:"O email é invalido!"});
            return;
        }

        let emailExists = await User.findEmail(email);
      
        if(emailExists){
            res.status(406);
            res.json({err: "O email já esta cadastrado!"});
            return;
        }

        await User.new(email, password, name, role);
        
        res.status(200);
        res.send("tudo ok");
       
    }

    async edit(req, res){
        let {id, name, email, role = 0} = req.body;
        let result = await User.update(id, name, email, role);
        if(result){
            if(result.status){
                res.status(200);
                res.send("tudo ok");    
            }else{
                res.status(406);
                res.json(result.err);
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res){
        let id = req.params.id;
        let result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("usuário deletado");
        }else{
            res.status(406);
            res.json(result.err);
        }
    }

    async recoverPassword(req, res){
        let email = req.body.email;
        let result = await PasswordToken.create(email);

        if(result){
            res.status(200);
            res.send("" + result.token);
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async changePassword(req, res){
        let token = req.body.token;
        let password = req.body.password;
        let isTokenValid = await PasswordToken.validate(token);  //  return {status: true, token: tk};
        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido");
        }
    }

    async login(req, res){
        let {email, password} = req.body;
        let user = await User.findByEmail(email);

        if(user){
            let result = await bcrypt.compare(password, user.password);

            if(result){
                let token = jwt.sign({email:user.email, role: user.role}, secret);
                res.status(200);
                res.json({token: token});
            }else{
                res.status(406);
                res.send("Senha incorreta!")
            }
        }else{
            res.json({status: false});
        }
    }
}


module.exports = new UserController;