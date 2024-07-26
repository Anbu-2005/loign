
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { type } = require('os');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const password = encodeURIComponent('Ajithkumar@11');
const mongourl = `mongodb+srv://ajithkumar:${password}@cluster0.mqoxc3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.log('Database connection error:', e);
  });

const itemSchema = new mongoose.Schema({
  itemname: { type: String, required: true },
  numberOfItems: { type: Number, required: true },
  Description: { type: String, required: true },
  imageUrl: { type: String }
});

const Item = mongoose.model('Item', itemSchema);

const Register1=new mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true},
  usertype:{type:String}
});


const Register=mongoose.model('Register',Register1);
const addToCartSchema = new mongoose.Schema({
  itemname: { type: String, required: true },
  numberOfItems: { type: Number, required: true },

  imageUrl: { type: String }
});
const AddToCart = mongoose.model("AddToCart", addToCartSchema);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/register', async (req, res) => {
  const { username, email, password, checked } = req.body;

  try {
    await Register.create({
      username,
      email,
      password,
      usertype: checked
    });
    res.send({ status: 'ok' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ status: 'error', error: error.message });
  }
});

app.post('/AddToCart', async (req, res) => {
  const { itemname, numberOfItems, imageUrl } = req.body;
  try {
    const itemInCart = await AddToCart.findOne({ itemname });

    if (itemInCart) {
      return res.status(400).send({ error: 'Item already in cart' });
    }
    await AddToCart.create({
      itemname,
      numberOfItems,
      imageUrl
    });

    res.send({ status: 'ok' });
  } catch (error) {
    console.error('Error adding item to cart:');
    res.status(500).send({ status: 'error' });
  }
});
app.post('/addItem', upload.single('image'), async (req, res) => {
  const { item, numberOfItems, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newItem = new Item({
      itemname: item,
      numberOfItems: parseInt(numberOfItems, 10),
      Description: description,
      imageUrl
    });

    await newItem.save();
    res.send({ status: 'ok' });
  } catch (error) {
    console.error('Error adding item:', error.message, error.stack);
    res.status(500).send({ status: 'error', error: error.message });
  }
});

app.delete('/deleteItem/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await Item.findByIdAndDelete(itemId);
    if (!result) {
      return res.status(404).send({ status: 'error', error: 'Item not found' });
    }
    res.send({ status: 'ok' });
  } catch (error) {
    console.error('Error deleting item:', error.message, error.stack);
    res.status(500).send({ status: 'error', error: error.message });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Register.findOne({ email, password });
    if (!user) {
      return res.status(400).send({ status: 'error', error: 'User not found ' });
    }
  
    
    res.send({ status: 'ok', usertype: user.usertype });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ status: 'error', error: error.message });
  }
});




app.get("/DisplayAddToCartItem", async (req, res) => {
  try {
      const AddToCartDisplay = await Item.find();
      res.status(200).send({ status: "ok", data: AddToCartDisplay });
  } catch (error) {
      console.log("Error Fetching Add To Cart Item", error);
      res.status(500).send({ status: "error", error });
  }
});

app.get("/DisplayItem", async (req, res) => {
  try {
      const AddToCartDisplay = await AddToCart.find();
      res.status(200).send({ status: "ok", data: AddToCartDisplay });
  } catch (error) {
      console.log("Error Fetching Add To Cart Item", error);
      res.status(500).send({ status: "error", error });
  }
});


app.post('/buyItem', async (req, res) => {
  const { id } = req.body;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).send({ status: 'error', error: 'Item not found' });
    }

    if (item.numberOfItems <= 0) {
      return res.status(400).send({ status: 'error', error: 'Item is out of stock' });
    }

    item.numberOfItems -= 1;
    await item.save();
    res.send({ status: 'ok' });
  } catch (error) {
    console.error('Error buying item:', error.message, error.stack);
    res.status(500).send({ status: 'error', error: error.message });
  }
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
