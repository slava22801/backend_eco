const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_ACCESS_SECRET = 'your_access_secret'
const JWT_REFRESH_SECRET = 'your_refresh_secret'

class UserController{
    async register(req,res){

        const{name,surname,email,password} = req.body
        
        const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email])
        if(checkUser.rows.length > 0){
            return res.status[400].json({message: 'Пользователь уже существует'})
        }
        const hashPassword = await bcrypt.hash(password,5)
        const newUser = await db.query('INSERT INTO users(name,surname,email,password,role) values ($1,$2,$3,$4,user) RETURNING *',
            [name,surname,email,hashPassword]
        )
        const accessToken = jwt.sign({id: newUser.rows[0].id}, JWT_ACCESS_SECRET, {expiresIn:'15m'})
        const refreshToken = jwt.sign({ id: newUser.rows[0].id }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
        res.json({
            user: newUser.rows[0],
            accessToken,
            refreshToken
          })
    }
    async login(req,res){
        const{email,password} = req.body
        const user = await db.query('SELECT * FROM users WHERE email = $1',[email])
        if(user.rows.length===0){
            return res.status(400).json({message:'Пользователь не найден'})
        }
        const validPassword = await bcrypt.compare(password,user.rows[0].password)
        if(!validPassword){
            return res.status(401).json({ message: 'Неверный пароль' })
        }
        const accessToken = jwt.sign({ id: user.rows[0].id }, JWT_ACCESS_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ id: user.rows[0].id }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
    
        res.json({
          user: user.rows[0],
          accessToken,
          refreshToken
        })
    }
    async updateUser(req, res) {
        const { id } = req.user; 
        const { name, surname, email } = req.body;
      
        const updatedUser = await db.query(
          'UPDATE users SET name = $1, surname = $2, email = $3 WHERE id = $4 RETURNING *',
          [name, surname, email, id]
        );
        
        res.json(updatedUser.rows[0]);
      }
    async getUsers(req,res){
        const users = await db.query('SELECT * FROM users')
        res.json(users.rows)    
    }

    async getOneUser(req,res){
        const id = req.params.id
        const user = await db.query('SELECT * FROM users where id = $1', [id])
        res.json(user.rows[0])
    }


    async deleteUser(req,res){
        const id = req.params.id
        const user = await db.query('DELETE FROM users where id = $1', [id])
        res.json(user.rows[0])
    }
    async refreshToken(req, res) {
        const { refreshToken } = req.body;
      
        
        if (!refreshToken) {
          return res.status(401).json({ message: 'Токен отсутствует' });
        }
      
        try {
          
          const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
          
          
          const user = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
          if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
          }
      
          
          const newAccessToken = jwt.sign(
            { id: user.rows[0].id }, 
            JWT_ACCESS_SECRET, 
            { expiresIn: '15m' }
          );
      
          
          res.json({ accessToken: newAccessToken });
      
        } catch (e) {
          
          res.status(403).json({ message: 'Недействительный токен' });
        }
      }
    async logout(req, res) {
        const { refreshToken } = req.body;
      
        
        if (!refreshToken) {
          return res.status(400).json({ message: 'Токен отсутствует' });
        }
      
        try {
         
          await db.query(
            'INSERT INTO revoked_tokens (token) VALUES ($1)',
            [refreshToken]
          );
          res.status(204).send(); 
      
        } catch (e) {
         
          res.status(400).json({ message: 'Токен уже отозван' });
        }
      }
      
}

module.exports = new UserController()