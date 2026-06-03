const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '20mb' })); 
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Initialize Firebase Admin
try {
  const serviceAccount = require('./firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin SDK Initialized Successfully");
} catch (err) {
  console.error("❌ Firebase Initialization Failed:", err.message);
}

const db = admin.firestore();
const auth = admin.auth();

/* ==========================================================================
   SELLER AUTHENTICATION
   ========================================================================== */

app.post('/api/sellers/register', async (req, res) => {
  try {
    const { email, password, storeName, mobile, gstNumber } = req.body;
    if (!email || !password || !storeName || !mobile || !gstNumber) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }
    const userRecord = await auth.createUser({
      email, password,
      phoneNumber: mobile.startsWith('+') ? mobile : `+91${mobile}`,
      displayName: storeName,
    });
    await db.collection('sellers').doc(userRecord.uid).set({
      sellerId: userRecord.uid, storeName, email, mobile, gstNumber, status: 'approved', createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return res.status(201).json({ success: true, sellerId: userRecord.uid, message: "Registration successful!" });
  } catch (error) { return res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/sellers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: "Email and password required" });
    const userRecord = await auth.getUserByEmail(email);
    const sellerDoc = await db.collection('sellers').doc(userRecord.uid).get();
    if (!sellerDoc.exists) return res.status(404).json({ success: false, error: "Seller account not found" });
    return res.status(200).json({ success: true, sellerId: userRecord.uid, storeName: sellerDoc.data().storeName, email: sellerDoc.data().email, status: sellerDoc.data().status });
  } catch (error) { return res.status(401).json({ success: false, error: "Invalid credentials" }); }
});

/* ==========================================================================
   PRODUCT MANAGEMENT ENDPOINTS (UPDATED)
   ========================================================================== */

app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = [];
    snapshot.forEach(doc => products.push(doc.data()));
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return res.status(404).json({ success: false, error: "Product not found." });
    return res.status(200).json({ success: true, product: docSnap.data() });
  } catch (error) { return res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/products/seller/:sellerId', async (req, res) => {
  try {
    const snapshot = await db.collection('products').where('sellerId', '==', req.params.sellerId).get();
    const products = [];
    snapshot.forEach(doc => products.push(doc.data()));
    return res.status(200).json({ success: true, products });
  } catch (error) { return res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/products/add', async (req, res) => {
  try {
    const { sellerId, title, description, price, inventoryQty, images, category } = req.body;
    if (!sellerId || !title || !price || inventoryQty === undefined || !category) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const productRef = db.collection('products').doc();
    await productRef.set({
      productId: productRef.id, sellerId, title, description: description || "",
      price: Number(price), inventoryQty: Number(inventoryQty),
      images: images || [], // Multiple Base64 Image Array
      category: category || "General",
      status: 'active', // Default status is active
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return res.status(201).json({ success: true, message: "Product listed successfully" });
  } catch (error) { return res.status(500).json({ success: false, error: error.message }); }
});

app.patch('/api/products/:id', async (req, res) => {
  try {
    const { inventoryQty, status, price } = req.body;
    const updateData = {};
    if (inventoryQty !== undefined) updateData.inventoryQty = Number(inventoryQty);
    if (status !== undefined) updateData.status = status;
    if (price !== undefined) updateData.price = Number(price);

    await db.collection('products').doc(req.params.id).update(updateData);
    return res.status(200).json({ success: true, message: "Product updated successfully!" });
  } catch (error) { return res.status(500).json({ success: false, error: error.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    return res.status(200).json({ success: true, message: "Product deleted from database!" });
  } catch (error) { return res.status(500).json({ success: false, error: error.message }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Central Server running on http://localhost:${PORT}`));