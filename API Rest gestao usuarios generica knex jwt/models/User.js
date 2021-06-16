const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{

    async findAll (){
        try {
            let result = await knex.select(["id", "name", "email", "role"]).table("users");
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }

    }

    async findById(id){
        try {
            let result = await knex.select(["id", "name", "email", "role"]).where({id:id}).table("users");

            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async findByEmail(email){
        try {
            let result = await knex.select(["id", "name", "email","password", "role"]).where({email: email}).table("users");

            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async new(email, password, name, role){
        try {
            const hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, name, role}).table("users");
        } catch (error) {
            console.log(error);
        }
    }

    async findEmail(email){
        try {
            let result = await knex.select("*").table("users").where({email: email});

            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        } catch (error) {
            console.log(error)
        }
    }

    async update(id, name, email, role){
        let user = await this.findById(id);                                             
        if(user){
            let editUser = {};
            if(email){
                if(email != user.email){ // se o email digitado for diferente do email atual
                    let result = await this.findEmail(email); // email novo digitado
                    if(result == false){
                        editUser.email = email;
                    }else{
                        return {status: false, err:"O e-mail já esta cadastrado!"};
                    }
                } 
            }
            if(name){
                editUser.name = name;
            }

            if(role){
                editUser.role = role; 
            }

            try {
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true};
            } catch (error) {
                return {status: false, err: error};
            }
        }else{
            return {status: false, err:"O usuário não existe"};
        }
    }

    async delete(id){
        let user = await this.findById(id);

        if(user){
            try {
                await knex.delete().where({id: id}).table("users");
                return {status: true};
            } catch (error) {
                return {status: false, err: error};
            }
        }else{
            return {status: false, err:"O usuário não existe, portanto não pode ser deletado"};
        }
    }

    async changePassword(newPassword, id, token){
        const hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users");
       // console.log(token);
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User;