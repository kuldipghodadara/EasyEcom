const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();

// Middleware
app.use(cors({ origin: true })); // Allows communication from your Next.js panels
app.use(express.json());

/* ==========================================================================
   👥 CUSTOMER / USER ENDPOINTS
   ========================================================================== */

/**
 * @route   POST /api/orders/place
 * @desc    Places an order, validates and decrements product inventory, and yields a token.
 */
app.post('/api/orders/place', async (req, res) => {
  try {
    const { items, totalAmount, mobileNumber } = req.body;

    if (!mobileNumber || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing required checkout parameters." });
    }

    // Generate readable order token format: ORD-YYYYMMDD-5RANDOMCHARS
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderToken = `ORD-${dateStr}-${randomSuffix}`;

    // Execute an atomic transaction to ensure safe inventory deductions
    const orderResult = await db.runTransaction(async (transaction) => {
      const productRefs = [];
      const productDocs = [];

      // 1. Read all product states first inside the transaction
      for (const item of items) {
        const ref = db.collection('products').doc(item.productId);
        productRefs.push({ ref, item });
        productDocs.push(await transaction.get(ref));
      }

      // 2. Validate current stock allocations
      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        const { item } = productRefs[i];

        if (!doc.exists) {
          throw new Error(`Product reference ${item.productId} does not exist.`);
        }

        const currentStock = doc.data().inventoryQty || 0;
        if (currentStock < item.qty) {
          throw new Error(`Insufficient stock for item: ${item.title}. Available: ${currentStock}`);
        }
      }

      // 3. Apply changes and mutations
      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        const { ref, item } = productRefs[i];
        const currentStock = doc.data().inventoryQty;

        transaction.update(ref, {
          inventoryQty: currentStock - item.qty
        });
      }

      // 4. Stage order profile record data
      const orderRef = db.collection('orders').doc();
      const orderPayload = {
        orderToken,
        items,
        totalAmount: Number(totalAmount),
        mobileNumber,
        status: 'placed', // status cycle: placed -> processing -> shipped -> delivered
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.set(orderRef, orderPayload);
      return { orderToken, orderId: orderRef.id };
    });

    return res.status(201).json({ success: true, ...orderResult });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});


/* ==========================================================================
   Storefront Seller Operations
   ========================================================================== */

/**
 * @route   POST /api/sellers/register
 * @desc    Registers a merchant profile into system auth security rings and sets status to pending.
 */
app.post('/api/sellers/register', async (req, res) => {
  try {
    const { email, password, storeName, mobile, gstNumber } = req.body;

    if (!email || !password || !storeName || !gstNumber || !mobile) {
      return res.status(400).json({ success: false, error: "All profile properties are mandatory." });
    }

    // Provision Identity Credential Mapping within Firebase Core Auth Node
    const userRecord = await auth.createUser({
      email,
      password,
      phoneNumber: mobile.startsWith('+') ? mobile : `+91${mobile}`,
      displayName: storeName
    });

    // Save corresponding business details to the sellers collection
    await db.collection('sellers').doc(userRecord.uid).set({
      sellerId: userRecord.uid,
      storeName,
      email,
      mobile,
      gstNumber,
      isVerified: false,
      status: 'pending', // internal state rules: pending, approved, rejected
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({ 
      success: true, 
      sellerId: userRecord.uid, 
      message: "Merchant credentials generated. Awaiting administrative clearance." 
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/products/add
 * @desc    Allows verified sellers to push catalog updates onto client listings.
 */
app.post('/api/products/add', async (req, res) => {
  try {
    const { sellerId, title, description, price, inventoryQty, images } = req.body;

    if (!sellerId || !title || !price || inventoryQty === undefined) {
      return res.status(400).json({ success: false, error: "Missing required fields to map catalog definitions." });
    }

    // Verify verification access flags before catalog mutation
    const sellerDoc = await db.collection('sellers').doc(sellerId).get();
    if (!sellerDoc.exists || sellerDoc.data().status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        error: "Access Denied. Your account verification status is not currently set to approved." 
      });
    }

    const productRef = db.collection('products').doc();
    const productPayload = {
      productId: productRef.id,
      sellerId,
      title,
      description: description || "",
      price: Number(price),
      inventoryQty: Number(inventoryQty),
      images: images || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await productRef.set(productPayload);
    return res.status(201).json({ success: true, productId: productRef.id, message: "Item cataloged." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/products/seller/:sellerId
 * @desc    Fetches specific merchant product groupings for dashboard inventory tracking tables.
 */
app.get('/api/products/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const snapshot = await db.collection('products').where('sellerId', '==', sellerId).get();
    
    const inventory = [];
    snapshot.forEach(doc => inventory.push(doc.data()));
    
    return res.status(200).json({ success: true, products: inventory });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});


/* ==========================================================================
   🛡️ ADMIN DASHBOARD OPERATIONS
   ========================================================================== */

/**
 * @route   GET /api/admin/sellers
 * @desc    Retrieves all registered merchants to evaluate platform access request records.
 */
app.get('/api/admin/sellers', async (req, res) => {
  try {
    const snapshot = await db.collection('sellers').orderBy('createdAt', 'desc').get();
    const sellers = [];
    snapshot.forEach(doc => sellers.push(doc.data()));
    return res.status(200).json({ success: true, sellers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PATCH /api/admin/sellers/:id/verify
 * @desc    Sets administrative authorization modifiers for dynamic seller profile verification.
 */
app.patch('/api/admin/sellers/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected flags: 'approved' | 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: "Provided target parameter status payload is invalid." });
    }

    await db.collection('sellers').doc(id).update({
      status: status,
      isVerified: status === 'approved'
    });

    return res.status(200).json({ success: true, message: `Merchant node evaluation complete. Status set to: ${status}` });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/admin/orders
 * @desc    Renders all system distribution records for admin logs.
 */
app.get('/api/admin/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Resource route endpoint map not found." });
});

// Run Core API Engine
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API System running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});