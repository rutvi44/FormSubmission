

const express = require('express');
const { check, validationResult } = require('express-validator');
const app = express();
const path = require('path');

// Serve static files from the Public folder
app.use(express.static(path.join(__dirname, 'Public')));

// EJS view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// The homepage route
app.get('/', function (req, res) {
  // Render the main form with potential errors
  res.render('main', { errors: [] });
});

// The receipt route that handles form submission

app.post(
  '/reciept',[
    // Express validator checks for form input validation
    check('name', 'Name is required (in format Chris Mihalski)').notEmpty().matches(/^[a-zA-Z\s]+$/),
    check('address', 'Address is required').notEmpty(),
    check('city', 'City is required').notEmpty(),
    check('province', 'Please select Province').notEmpty(),
    check('phone', 'Phone number is required').notEmpty(),
    check('phone', 'Phone number should be in format 123-123-1234').matches( /^\d{3}-\d{3}-\d{4}$/),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Invalid email format (test@test.com)').matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/),
    check('product1', 'Please enter a valid quantity for Maple Syrup').isInt({ min: 0 }),
    check('product2', 'Please enter a valid quantity for Honey').isInt({ min: 0 }),
  ],
  function (req, res) {

    // Get any validation errors from the form submission
    const errors = validationResult(req).array();

    
    // Extract data from the form submission
    var name = req.body.name;
    var address = req.body.address;
    var city = req.body.city;
    var province = req.body.province;
    var phone = req.body.phone;
    var email = req.body.email;
    var product1 = parseInt(req.body.product1) || 0; 
    var product2 = parseInt(req.body.product2) || 0;


    let tax;

    if (errors.length > 0) {
      console.log(errors);
      res.render('main', { errors });
    } else {
      switch (province) {
        case 'Ontario':
          tax = 13;
          break;
        case 'Alberta':
          tax = 5;
          break;
        case 'BritishColumbia':
          tax = 12;
          break;
        case 'Manitoba':
          tax = 13;
          break;
        case 'NewBrunswick':
          tax = 15;
          break;
        case 'NewfoundlandandLabrador':
          tax = 15;
          break;
        case 'NovaScotia':
          tax = 15;
          break;
        case 'PrinceEdwardIsland':
          tax = 15;
          break;
        case 'Quebec':
          tax = 14.98;
          break;
        case 'Saskatchewan':
          tax = 11;
          break;
        case 'NorthwestTerritories':
          tax = 5;
          break;
        case 'Nunavut':
          tax = 5;
          break;
        case 'Yukon':
          tax = 5;
          break;
        default:
          tax = 5;
      }

      // Calculate TotalCost with grossamount and tax of the selected and number of items
      const item1 = 18;
      const item2 = 8;
      const item1Quantity = parseInt(product1);
      const item2Quantity = parseInt(product2);
      const grossAmount = (item1Quantity * item1) + (item2Quantity * item2);
      const taxAmount = grossAmount * tax / 100;
      const totalCost = grossAmount + taxAmount;

      // Prepare the data to be displayed on the receipt
      const finalData = {
        name: name,
        address: address,
        city: city,
        province: province,
        phone: phone,
        email: email,
        product1: product1,
        product2: product2,
        grossAmount: grossAmount,
        taxAmount: taxAmount,
        totalCost: totalCost,
      };

      // Render the receipt page with the calculated data
      if (grossAmount >= 10) {
        res.render('reciept', finalData);
      } else {
        // Display errors for order amount less than $10
        const errors = [{ msg: 'Please buy products worth $10 or more' }];
        res.render('main', { errors });
      }
    }
  }
);

const port = 4499;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
