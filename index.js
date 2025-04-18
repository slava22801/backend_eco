const express = require('express')
const userRouter = require('./routes/user_routes')
const productRouter = require('./routes/product_routes')
const cors = require('cors')
const PORT = process.env.PORT || 8080

const app = express()

app.use( express.json())
app.use('/user',userRouter)
app.use('/product', productRouter)
app.use(cors({
    origin: "http://5.129.197.80"
}))

app.listen(PORT,()=> console.log("server started on post", PORT))

