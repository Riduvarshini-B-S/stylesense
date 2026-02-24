// Basic Express server setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// In-memory orders array
const orders = [];

// Setup multer for uploads
const uploadDir = path.join(__dirname, 'public', 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${ts}_${safe}`);
  }
});
const upload = multer({ storage });

// Demo: Product recommendations endpoint (simulate AI output)
app.get('/recommend-products', (req, res) => {
  // Example products
  const products = [
    {
      _id: '1',
      name: 'Classic White Shirt',
      price: 799,
      description: 'A timeless white shirt for all occasions.',
      image: '/public/products/white-shirt.jpg'
    },
    {
      _id: '2',
      name: 'Denim Jeans',
      price: 1299,
      description: 'Comfortable and stylish blue jeans.',
      image: '/public/products/denim-jeans.jpg'
    },
    {
      _id: '3',
      name: 'Leather Jacket',
      price: 3499,
      description: 'Premium quality black leather jacket.',
      image: '/public/products/leather-jacket.jpg'
    }
  ];
  res.json(products);
});

// Place order endpoint (in-memory)
app.post('/place-order', (req, res) => {
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) {
    return res.status(400).json({ message: 'Missing user_id or product_id' });
  }
  const order = {
    order_id: (orders.length + 1).toString(),
    user_id,
    product_id,
    order_date: new Date(),
    status: 'Placed'
  };
  orders.push(order);
  res.json({ message: 'Order Placed Successfully', order_id: order.order_id });
});

// View orders endpoint (in-memory)
app.get('/orders', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'Missing user_id' });
  const userOrders = orders.filter(order => order.user_id === user_id);
  // Attach product info
  const products = [
    {
      _id: '1',
      name: 'Classic White Shirt',
      price: 799,
      description: 'A timeless white shirt for all occasions.',
      image: '/public/products/white-shirt.jpg'
    },
    {
      _id: '2',
      name: 'Denim Jeans',
      price: 1299,
      description: 'Comfortable and stylish blue jeans.',
      image: '/public/products/denim-jeans.jpg'
    },
    {
      _id: '3',
      name: 'Leather Jacket',
      price: 3499,
      description: 'Premium quality black leather jacket.',
      image: '/public/products/leather-jacket.jpg'
    }
  ];
  const ordersWithProduct = userOrders.map(order => ({
    ...order,
    product: products.find(p => p._id === order.product_id)
  }));
  res.json(ordersWithProduct);
});

app.listen(5000, () => {
  const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
});
