if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
  
const config = require('../config');
const mongoose = require('mongoose');
let { CronJob } = require('cron');
const sendEmail = require('../api/helpers/email');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.connectionString, { useMongoClient: true });

const User = require('../api/models/User');
const Order = require('../api/models/order');

let recipient, totalPrice = 0;
let newCron = new CronJob({
    cronTime: '00 00 08 * * *', // Runs every weekday (Monday through Friday) at 08:00 AM.
    // cronTime: '01 * * * * *',
    onTick: () => {
        console.log('Running cron at ', new Date())

        User.findOne({ role: 1 }).select('email').exec()
            .then(admin => {
                if (admin) {
                    recipient = admin.email;
                    return Order.find({}, { __v: false, _id: false, salt: false, hashedPassword: false, created: false });
                }

                return Promise.reject(new Error('Not found Admin'));
            })
            .then(orders => {
                if (orders.length > 0) {
                    let products = orders.map(o => {
                        totalPrice += parseInt(o.product.price);
                        return o.product.name;
                    })

                    let params = {
                        to: recipient,
                        from: 'noreply@test.com',
                        subject: 'Report for products',
                        text: 'Please take a look!',
                        html: `Hi, Admin!
                               Number of sold products: ${products.length}
                               Total money: ${totalPrice}
                               product list: ${products.toString()}`
                    }

                    return sendEmail(params);
                }
                return Promise.reject(new Error('Empty orders'));
            })
            .then(data => console.log('----------- Email is sent to Admin --------------'))
            .catch(error => {
                console.log('------------------------ Error Message ---------------------------')
                console.log(error.message);
            })
    },
    start: false,
    timeZone: 'Europe/Warsaw' // CEST Timezone
})

// Starting the task
newCron.start();
