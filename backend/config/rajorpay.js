const Razorpay = require('razorpay');

let razorpay;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized');
} else {
    // Dummy object for local testing
    razorpay = {
        orders: {
            create: async () => ({ id: 'dummy_order', amount: 100, currency: 'INR' }),
        },
    };
    console.log('⚠️ Razorpay dummy mode enabled');
}

module.exports = razorpay;
