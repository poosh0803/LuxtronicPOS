const express = require("express");
const cors = require("cors");
const mysql = require("mysql2"); // Use mysql2 library for database connectivity
const fileUpload = require("express-fileupload");
const path = require("path");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hostaddress = 'http://dkpoosh.ddns.net:8000';

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
const bodyParser = require('body-parser');

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'PXProject',
  database: 'ERPSystem'
});

// Middleware
app.use(bodyParser.json());

// Image upload endpoint
app.post("/upload-image", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const image = req.files.file;
  const uploadPath = path.join(__dirname, 'uploads', image.name);

  image.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send(err);
    }

    const imageUrl = `/uploads/${image.name}`;
    res.send({ imageUrl });
  });
});

// Endpoint to handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  pool.query(
    'SELECT * FROM User WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
    
      console.log('Query results:', results); // Log query results
    
      if (results.length > 0) {
        // User found, send success response
        res.status(200).json({ message: 'Login successful', user: results[0] });
      } else {
        // User not found or invalid credentials
        res.status(401).json({ error: 'Invalid email or password' });
      }
    }
  );
});

app.post("/bookings", (req, res) => {
  const { firstName, lastName, email, phoneNumber, additionalMessage, studentDiscount, serviceType, bookingDate } = req.body;
  
 
  const sql = 'INSERT INTO Booking (first_name, last_name, email, phone_number, additional_message, student_discount, service_type, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  pool.query(sql, [firstName, lastName, email, phoneNumber, additionalMessage, studentDiscount, serviceType, bookingDate], (err, results) => {
      if (err) {
          console.error('Error inserting new booking', err);
          res.status(500).send('Failed to add booking');
          return;
      }
      res.status(201).send({ message: 'Booking added successfully', bookingId: results.insertId });
  });
});


app.put("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const { firstName, lastName, email, phoneNumber, additionalMessage, studentDiscount, serviceType, bookingDate } = req.body;

  const sql = 'UPDATE Booking SET first_name = ?, last_name = ?, email = ?, phone_number = ?, additional_message = ?, student_discount = ?,  service_type = ?, date = ? WHERE id = ?';
  pool.query(sql, [ firstName, lastName, email, phoneNumber, additionalMessage, studentDiscount, serviceType, bookingDate, bookingId], (err, results) => {
      if (err) {
          console.error('Error updating booking:', err);
          return res.status(500).send({ message: 'Failed to update booking', error: err.sqlMessage });
      }
      if (results.affectedRows === 0) {
          return res.status(404).send({ message: 'Booking not found' });
      }
      res.send({ message: 'Booking updated successfully' });
  });
});


app.get("/bookings", (req, res) => {
  pool.query('SELECT * FROM Booking', (err, results) => {
      if (err) {
          console.error('Error fetching bookings:', err);
          res.status(500).send('Failed to retrieve bookings');
          return;
      }
      
      res.json(results);
  });
});

app.post("/client", (req, res) => {
 
  const { companyName, clientName, ABN, telephone, emailAddress } = req.body;

  if (!companyName || !clientName || !ABN || !telephone || !emailAddress) {
      return res.status(400).send({ message: 'All fields must be provided and valid.' });
  }
  const sql = 'INSERT INTO Clients (company_name, client_name, abn, telephone, email) VALUES (?, ?, ?, ?, ?)';
  pool.query(sql, [companyName, clientName, ABN, telephone, emailAddress], (err, results) => {
      if (err) {
          console.error('Error inserting new client:', err);
          res.status(500).send({ message: 'Failed to add client', error: err.sqlMessage });
          return;
      }
      res.status(201).send({ message: 'Client added successfully', clientId: results.insertId });
  });
});


app.get("/client", (req, res) => {
  pool.query('SELECT * FROM Clients', (err, results) => {
      if (err) {
          console.error('Error fetching clients:', err);
          res.status(500).send('Failed to retrieve clients');
          return;
      }
      res.json(results);  // Ensure to send back the results to the client
  });
});

// delete client 
app.delete("/client/:clientId", (req, res) => {
  const { clientId } = req.params; 

  const sql = 'DELETE FROM Clients WHERE client_id = ?'; 
  pool.query(sql, [clientId], (err, results) => {
      if (err) {
          console.error('Error deleting client:', err);
          return res.status(500).send({ message: 'Failed to delete client', error: err.sqlMessage });
      }
      if (results.affectedRows === 0) {
          return res.status(404).send({ message: 'Client not found' }); 
      }
      res.send({ message: 'Client deleted successfully' });
  });
});

// delete booking
app.delete("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params; 

  const sql = 'DELETE FROM Booking WHERE id = ?'; 
  pool.query(sql, [bookingId], (err, results) => {
      if (err) {
          console.error('Error deleting booking:', err);
          return res.status(500).send({ message: 'Failed to delete booking', error: err.sqlMessage });
      }
      if (results.affectedRows === 0) {
          return res.status(404).send({ message: 'Booking not found' }); 
      }
      res.send({ message: 'Booking deleted successfully' });
  });
});

// edit client
app.put("/client/:clientId", (req, res) => {
  const { clientId } = req.params;
  const { companyName, clientName, ABN, telephone, emailAddress } = req.body;

  const sql = 'UPDATE Clients SET company_name = ?, client_name = ?, abn = ?, telephone = ?, email = ? WHERE client_id = ?';
  pool.query(sql, [companyName, clientName, ABN, telephone, emailAddress, clientId], (err, result) => {
      if (err) {
          console.error('Error updating client:', err);
          return res.status(500).send({ message: 'Failed to update client', error: err.sqlMessage });
      }
      if (result.affectedRows === 0) {
          return res.status(404).send({ message: 'Client not found' });
      }
      res.send({ message: 'Client updated successfully' });
  });
});


// Route to handle adding a new user
app.post("/users", async (req, res) => {
  let userData = req.body;

  try {
   

    // Insert user data into the User table with the hashed password
    pool.query('INSERT INTO User SET ?', userData, (error, results) => {
      if (error) {
        console.error('Error inserting user into database:', error);
        return res.status(500).json({ message: 'Error inserting user into database' });
      }
      console.log('User inserted into database with ID:', results.insertId);
      res.status(200).json({ message: 'User inserted successfully', userId: results.insertId });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Inventory insertion endpoint
app.post("/inventory", (req, res) => {
  const { item, price_from_supplier, retail_price, barcode, model, brand, brief_description, image_url, supplier_name, supplier_email} = req.body;

  if (!item || !price_from_supplier || !retail_price || !supplier_name || !supplier_email || !barcode || !model || !brand || !brief_description || !image_url) {
    return res.status(400).send({ message: 'All fields must be provided and valid.' });
  }

  const sql = 'INSERT INTO inventory (item, price_from_supplier, retail_price, supplier_name, supplier_email, barcode, model, brand, brief_description, image_url) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  pool.query(sql, [item, price_from_supplier, retail_price, supplier_name,supplier_email, barcode, model, brand, brief_description, image_url  ], (err, results) => {
    if (err) {
      console.error('Error inserting new inventory:', err);
      res.status(500).send({ message: 'Failed to add inventory', error: err.sqlMessage });
      return;
    }
    res.status(201).send({ message: 'Inventory added successfully', inventoryId: results.insertId });
  });
});


// Endpoint to get all inventory items with their image URLs
app.get('/inventory', (req, res) => {
  const inventoryQuery = 'SELECT * FROM inventory';
  pool.query(inventoryQuery, (err, inventoryResults) => {
    if (err) {
      console.error('Error fetching inventory details:', err);
      return res.status(500).send('Failed to fetch inventory details');
    }

    // Append the image URL to each inventory item
    const inventoryWithImages = inventoryResults.map(item => ({
      ...item,
      image_url: `${hostaddress}${item.image_url}`
    }));

    res.status(200).json(inventoryWithImages);
  });
});

// Endpoint to get inventory item details along with its products and image URL
app.get('/inventory/:itemId', (req, res) => {
  const { itemId } = req.params;

  const inventoryQuery = 'SELECT * FROM inventory WHERE inventory_id = ?';
  const productsQuery = 'SELECT * FROM inventory_products WHERE inventory_id = ?';

  pool.query(inventoryQuery, [itemId], (err, inventoryResults) => {
    if (err) {
      console.error('Error fetching inventory details:', err);
      return res.status(500).send('Failed to fetch inventory details');
    }

    if (inventoryResults.length === 0) {
      return res.status(404).send('Inventory item not found');
    }

    const itemDetails = inventoryResults[0];

    const imageUrl = `${hostaddress}${itemDetails.image_url}`; // Assuming localhost:8000 is your server address

    pool.query(productsQuery, [itemId], (err, productsResults) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).send('Failed to fetch products');
      }

      // Append the image URL to the item details
      const itemWithImage = { ...itemDetails, image_url: imageUrl };

      const response = {
        ...itemWithImage,
        products: productsResults,
      };

      res.status(200).json(response);
    });
  });
});



// delete inventory 
app.delete("/inventory/:inventoryId", (req, res) => {
  const { inventoryId } = req.params; 
  const sql1 = 'DELETE FROM inventory_products WHERE inventory_id = ?';
  const sql = 'DELETE FROM inventory WHERE inventory_id = ?';
  pool.query(sql1, [inventoryId], (err, results) => {});
  pool.query(sql, [inventoryId], (err, results) => {
      if (err) {
          console.error('Error deleting inventory:', err);
          return res.status(500).send({ message: 'Failed to delete inventory', error: err.sqlMessage });
      }
      if (results.affectedRows === 0) {
          return res.status(404).send({ message: 'inventory not found' }); 
      }
      res.send({ message: 'inventory deleted successfully' });
  });
});


// Endpoint to get inventory item details along with its products
app.get('/inventory/:itemId/products', (req, res) => {
  const { itemId } = req.params;
  const productsQuery = "SELECT serial_number, status FROM inventory_products WHERE inventory_id = ? AND status = 'In Stock'";

  pool.query(productsQuery, [itemId], (err, productsResults) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).send('Failed to fetch products');
    }
    res.status(200).json(productsResults);
    
  });
});




app.put('/update-product-status', (req, res) => {
  const { serialNumbers, status } = req.body;

  if (!Array.isArray(serialNumbers) || serialNumbers.length === 0) {
    return res.status(400).send({ message: 'Invalid serial numbers' });
  }

  const formattedSerialNumbers = serialNumbers.map(sn => `'${sn}'`).join(',');

  const sql = `UPDATE inventory_products SET status = ? WHERE serial_number IN (${formattedSerialNumbers})`;

  pool.query(sql, [status], (err, results) => {
    if (err) {
      console.error('Error updating product status:', err);
      return res.status(500).send({ message: 'Failed to update product status' });
    }
    res.send({ message: 'Product status updated successfully' });
  });
});

app.get('/inventory/:itemId/products', (req, res) => {
  const { itemId } = req.params;
  const productsQuery = "SELECT serial_number, status FROM inventory_products WHERE inventory_id = ? AND status = 'In Stock'";

  pool.query(productsQuery, [itemId], (err, productsResults) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).send('Failed to fetch products');
    }
    res.status(200).json(productsResults);
  });
});












/*app.get('/inventory/:inventory_id', (req, res) => {
  const inventoryId = req.params.inventory_id;
  const sqlQuery = `
      SELECT i.*, ip.serial_number, ip.status AS product_status
      FROM inventory i
      LEFT JOIN inventory_products ip ON i.inventory_id = ip.inventory_id
      WHERE i.inventory_id = ?;
  `;
  pool.query(sqlQuery, [inventoryId], (error, results) => {
      if (error) {
          console.error('Error fetching inventory details:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json(results);
  });
});*/

// Add a new product to a specific inventory item
app.post('/inventory/:inventory_id', (req, res) => {
  const inventoryId = req.params.inventory_id;
  const { serial_number, status } = req.body;
  const sqlInsert = `
      INSERT INTO inventory_products (inventory_id, serial_number, status)
      VALUES (?, ?, ?);
  `;
  pool.query(sqlInsert, [inventoryId, serial_number, status], (error, results) => {
      if (error) {
          console.error('Error adding product:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.status(201).json({ message: 'Product added successfully', product_id: results.insertId });
  });
});
// //Update inventory item
// app.mod('/inventory/:inventory_id', (req, res) => {
//   const inventoryId = req.params.inventory_id;
//   const sqlUpdate = `
//       UPDATE inventory_products
//       SET status = ?
//       WHERE inventory_id = ? AND serial_number = ?;
//   `;
//   pool.query(sqlUpdate, [status, inventoryId, serial_number], (error, results) => {
//       if (error) {
//           console.error('Error updating product:', error);
//           res.status(500).json({ error: 'Internal Server Error' });
//           return;
//       }
//       res.status(200).json({ message: 'Product updated successfully' });
//   });
// });

// Update a product within a specific inventory item
app.put('/inventory/:inventory_id', (req, res) => {
  const inventoryId = req.params.inventory_id;
  const { serial_number, status } = req.body;
  const sqlUpdate = `
      UPDATE inventory_products
      SET status = ?
      WHERE inventory_id = ? AND serial_number = ?;
  `;
  pool.query(sqlUpdate, [status, inventoryId, serial_number], (error, results) => {
      if (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.status(200).json({ message: 'Product updated successfully' });
  });
});


// Delete a product within a specific inventory item
app.delete('/inventory/:inventory_id/products/:serial_number', (req, res) => {
  const inventoryId = req.params.inventory_id;
  const serialNumber = req.params.serial_number;
  
  // Delete the product from inventory_products table
  const sqlDeleteProduct = `
      DELETE FROM inventory_products
      WHERE inventory_id = ? AND serial_number = ?;
  `;
  pool.query(sqlDeleteProduct, [inventoryId, serialNumber], (error, results) => {
      if (error) {
          console.error('Error deleting product:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      
      if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Product not found in inventory' });
          return;
      }

      res.status(200).json({ message: 'Product deleted successfully' });
  });
});


// Route to fetch users from the database
app.get("/users", (req, res) => {
  pool.query('SELECT * FROM User', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Failed to retrieve users' });
    } else {
      res.status(200).json(results); // Send fetched users as JSON response
    }
  });
});

// Route to delete a user by ID
app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;

  // Delete user from the User table based on userID
  pool.query('DELETE FROM User WHERE userID = ?', userId, (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error deleting user' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// Route to update a user by ID
app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  pool.query('UPDATE User SET ? WHERE userID = ?', [updatedUserData, userId], (error, results) => {
    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

app.put("/users/:userId/reset-password", async(req, res) => {
  const userId = req.params.userId;
  const newPassword = req.body.newPassword; // Make sure the new password is being sent in the request body


  pool.query('UPDATE User SET password = ? WHERE userID = ?', [newPassword, userId], (error, results) => {
    if (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Failed to update password' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});



app.get('/top-inventory-purchases', (req, res) => {
  const sql = `
    SELECT i.item, COUNT(ip.product_id) AS total_purchased
    FROM inventory_products ip
    JOIN inventory i ON ip.inventory_id = i.inventory_id
    WHERE ip.status = 'Purchased'
    GROUP BY ip.inventory_id
    ORDER BY total_purchased DESC
    LIMIT 3;
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching top inventory purchases:', err);
      return res.status(500).send({ message: 'Failed to retrieve top inventory purchases', error: err.message });
    }
    res.json(results);
  });
});

app.get('/top-damaged-inventory', (req, res) => {
  const sql = `
    SELECT i.item, COUNT(ip.product_id) AS total_damaged
    FROM inventory_products ip
    JOIN inventory i ON ip.inventory_id = i.inventory_id
    WHERE ip.status = 'Damaged'
    GROUP BY ip.inventory_id
    ORDER BY total_damaged DESC
    LIMIT 3;
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching top damaged inventory:', err);
      return res.status(500).send({ message: 'Failed to retrieve top damaged inventory', error: err.message });
    }
    res.json(results);
  });
});

app.get('/top-instock-inventory', (req, res) => {
  const sql = `
    SELECT i.item, COUNT(ip.product_id) AS total_instock
    FROM inventory_products ip
    JOIN inventory i ON ip.inventory_id = i.inventory_id
    WHERE ip.status = 'In Stock'
    GROUP BY ip.inventory_id
    ORDER BY total_instock DESC
    LIMIT 3;
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching top In Stock inventory:', err);
      return res.status(500).send({ message: 'Failed to retrieve top in stock inventory', error: err.message });
    }
    res.json(results);
  });
});

// Endpoint to get data about purchased inventory items for the pie chart
app.get('/purchased-inventory-products', (req, res) => {
    const query = `
        SELECT i.item, COUNT(*) AS total_purchased
        FROM inventory_products ip
        JOIN inventory i ON ip.inventory_id = i.inventory_id
        WHERE ip.status = 'Purchased'
        GROUP BY i.item
        ORDER BY total_purchased DESC;
    `;
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Failed to fetch purchased inventory product data:', error);
            res.status(500).send({ message: 'Failed to fetch purchased inventory product data', error: error });
            return;
        }
        res.json(results);
    });
});

app.post('/orders', (req, res) => {
  const {
      invoiceNo,
      companyName,
      clientName,
      telephone,
      email,
      dueDate,
      discount,
      paymentMethod,
      totalAmount,
      cart
  } = req.body;

  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          return res.status(500).json({ error: 'Failed to get database connection' });
      }

      connection.beginTransaction(err => {
          if (err) {
              console.error('Error starting transaction:', err);
              connection.release();
              return res.status(500).json({ error: 'Failed to start transaction' });
          }

          const orderQuery = 'INSERT INTO orders (invoice_no, company_name, client_name, telephone, email, due_date, discount, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
          connection.query(orderQuery, [invoiceNo, companyName, clientName, telephone, email, dueDate, discount, paymentMethod, totalAmount], (err, results) => {
              if (err) {
                  console.error('Error inserting order:', err);
                  connection.rollback(() => {
                      connection.release();
                      return res.status(500).json({ error: 'Failed to insert order' });
                  });
              } else {
                  const orderId = results.insertId;
                  const orderDetailsQuery = 'INSERT INTO order_details (order_id, inventory_id, item, quantity, serial_number, price) VALUES ?';
                  const orderDetailsValues = cart.flatMap(item => 
                      item.selectedSerialNumbers.map(serialNumber => 
                          [orderId, item.inventory_id, item.item, item.quantity, serialNumber, item.retail_price]
                      )
                  );

                  connection.query(orderDetailsQuery, [orderDetailsValues], (err, results) => {
                      if (err) {
                          console.error('Error inserting order details:', err);
                          connection.rollback(() => {
                              connection.release();
                              return res.status(500).json({ error: 'Failed to insert order details' });
                          });
                      } else {
                          connection.commit(err => {
                              if (err) {
                                  console.error('Error committing transaction:', err);
                                  connection.rollback(() => {
                                      connection.release();
                                      return res.status(500).json({ error: 'Failed to commit transaction' });
                                  });
                              } else {
                                  connection.release();
                                  return res.status(201).json({ message: 'Order created successfully', orderId });
                              }
                          });
                      }
                  });
              }
          });
      });
  });
});

/*app.get('/orders', (req, res) => {
  const sql = `
      SELECT 
          
          o.invoice_no,
          o.company_name,
          o.client_name,
          o.telephone,
          o.email,
          o.due_date,
          o.discount,
          o.payment_method,
          o.total_amount,
          od.inventory_id,
          od.item,
          od.quantity,
          od.serial_number,
          od.price
      FROM orders o
      LEFT JOIN order_details od ON o.order_id = od.order_id
  `;

  pool.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching orders:', err);
          return res.status(500).json({ error: 'Failed to fetch orders' });
      }

      const orders = results.reduce((acc, row) => {
          const order = acc.find(o => o.order_id === row.order_id);

          const orderDetail = {
              inventory_id: row.inventory_id,
              item: row.item,
              quantity: row.quantity,
              serial_number: row.serial_number,
              price: row.price
          };

          if (order) {
              order.items.push(orderDetail);
          } else {
              acc.push({
                  
                  invoice_no: row.invoice_no,
                  company_name: row.company_name,
                  client_name: row.client_name,
                  telephone: row.telephone,
                  email: row.email,
                  due_date: row.due_date,
                  discount: row.discount,
                  payment_method: row.payment_method,
                  total_amount: row.total_amount,
                  items: [orderDetail]
              });
          }

          return acc;
      }, []);

      res.json(orders);
  });
});*/

// Route to fetch orders and their details
/*app.get('/orders', (req, res) => {
  const query = `
    SELECT o.*, od.*
    FROM orders o
    JOIN order_details od ON o.id = od.order_id
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching orders and details:', error);
      return res.status(500).json({ error: 'Failed to fetch orders and details' });
    }
    res.status(200).json(results);
  });
});*/

// delete orders
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params; 
  const sql1 = 'DELETE FROM order_details WHERE order_id = ?';
  const sql = 'DELETE FROM orders WHERE id = ?';
  pool.query(sql1, [id], (err, results) => {
    // if (err) {
    //     console.error('Error deleting order:', err);
    //     return res.status(500).send({ message: 'Failed to delete order', error: err.sqlMessage });
    // }
    // if (results.affectedRows === 0) {
    //     return res.status(404).send({ message: 'Order not found' }); 
    // }
    // res.send({ message: 'Order deleted successfully' });
});
  pool.query(sql, [id], (err, results) => {
      if (err) {
          console.error('Error deleting order:', err);
          return res.status(500).send({ message: 'Failed to delete order', error: err.sqlMessage });
      }
      if (results.affectedRows === 0) {
          return res.status(404).send({ message: 'Order not found' }); 
      }
      res.send({ message: 'Order deleted successfully' });
  });
});

app.get('/orders', (req, res) => {
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          return res.status(500).json({ error: 'Failed to get database connection' });
      }

      const query = `
          SELECT o.*, od.* 
          FROM orders o 
          JOIN order_details od ON o.id = od.order_id
      `;

      connection.query(query, (err, results) => {
          connection.release();

          if (err) {
              console.error('Error fetching orders:', err);
              return res.status(500).json({ error: 'Failed to fetch orders' });
          }

          // Organize the data into a structured format (e.g., group orders with their respective details)
          const orders = {};
          results.forEach(row => {
              const orderId = row.order_id;
              if (!orders[orderId]) {
                  orders[orderId] = {
                      id: orderId,
                      invoiceNo: row.invoice_no,
                      companyName: row.company_name,
                      clientName: row.client_name,
                      telephone: row.telephone,
                      email: row.email,
                      dueDate: row.due_date,
                      discount: row.discount,
                      paymentMethod: row.payment_method,
                      totalAmount: row.total_amount,
                      // Add other fields from the orders table as needed
                      details: []
                  };
              }
              orders[orderId].details.push({
                  inventoryId: row.inventory_id,
                  item: row.item,
                  quantity: row.quantity,
                  serialNumber: row.serial_number,
                  price: row.price
              });
          });

          // Convert the object into an array of orders
          const ordersArray = Object.values(orders);

          return res.status(200).json(ordersArray);
      });
  });
});



const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});