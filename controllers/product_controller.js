const db = require('../db')

class ProductController {
  async createProduct(req, res) {
    try {
      const { name, price, content, img } = req.body
      const newProduct = await db.query(
        'INSERT INTO products(name, price, content, img) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, price, content, img]
      )
      res.json(newProduct.rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Ошибка при создании продукта' })
    }
  }

  async getProducts(req, res) {
    try {
      const products = await db.query('SELECT * FROM products')
      res.json(products.rows)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Ошибка при получении списка продуктов' })
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id
      const product = await db.query('SELECT * FROM products WHERE id = $1', [id])
      if (product.rows.length === 0) {
        return res.status(404).json({ message: 'Продукт не найден' })
      }
      res.json(product.rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Ошибка при получении продукта' })
    }
  }

  async updateProduct(req, res) {
    try {
      const { id, name, price, content, img } = req.body
      const updated = await db.query(
        'UPDATE products SET name = $1, price = $2, content = $3, img = $4 WHERE id = $5 RETURNING *',
        [name, price, content, img, id]
      )
      if (updated.rows.length === 0) {
        return res.status(404).json({ message: 'Продукт не найден' })
      }
      res.json(updated.rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Ошибка при обновлении продукта' })
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id
      const deleted = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])
      if (deleted.rows.length === 0) {
        return res.status(404).json({ message: 'Продукт не найден' })
      }
      res.json({ message: 'Продукт удалён', product: deleted.rows[0] })
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Ошибка при удалении продукта' })
    }
  }
}

module.exports = new ProductController()
