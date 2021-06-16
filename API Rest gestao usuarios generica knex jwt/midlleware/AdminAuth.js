const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    const secret = "hnweqr80ugh0q387vh3ug3uvbIUOGBUYG380gh398ghp234gbLJKHVBUYFGV897LJHB976";
    const authToken = req.headers['authorization'];

    if(authToken){
        const bearer = authToken.split(" ");
        const token = bearer[1];

        try {
            const decoded = jwt.verify(token, secret);
            
            if(decoded.role ==1){
                next();
                console.log(decoded);
            }else{
                res.status(403);
                res.send("Você não tem permissão para isso!");
                return;
            }
        } catch (error) {
            res.status(403);
            res.send("Você não está autenticado!");
            return;
        }

    }else{
        res.status(403);
        res.send("Você não está autenticado!");
        return;
    }
}