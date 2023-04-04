const db = require('../config/database');
const Auctions = db.Auction;
const Causes = db.Cause;
const Bids = db.Bid;
const Op = db.Sequelize.Op;

const duration = 10000;
// 1 Hour = 36000000
// 30 Mins = 18000000
// 10 min = 600000

// Get Active Causes/Auctions
// Check if Completed
// FInd highest bid per auction
// Initiate payment with accounts on hand
// Update Auctions to Completed status

const run = true;

if (run) {
    setTimeout(checkActive, duration);
}


async function checkActive() {
    try {
        console.log('***Checking Causes***');
        const causes = await Causes.findAll({ where: { status: 'ACTIVE'} });
        causes.forEach(function(cause){
            // 604800 = 1 Week
            const total = (cause.start + (2500 * cause.duration)) - (Date.now() / 1000);
            if (total <= 0) {
                updateCause(cause.id)
            }
        })
        console.log('***Checking Auctions***');
        const auctions = await Auctions.findAll({ where: { status: 'ACTIVE'} });
        auctions.forEach(function(auction){
            // 604800 = 1 Week
            const total = (auction.start + (2500 * auction.duration)) - (Date.now() / 1000);
            if (total <= 0) {
                updateAuction(auction.id)
            }
        })
        console.log('***Checking Bids***');
        const bids = await Bids.findAll({ where: { status: 'ACTIVE'} });
        bids.forEach(function(bid){
            if (bid.cause > 0) {
                checkBidCause(bid.id, bid.cause)
            } else {
                console.log("YARGWGWGWGAGAGAGAGAG")
                checkBidAuction(bid.id, bid.auction);
            }
        })
        checkBidCauseResult();
        checkBidAuctionResult();
        setTimeout(checkActive, duration)
    } catch (err) {
        console.log(err.message);
        setTimeout(checkActive, duration)
    };
}

async function updateAuction(auctionId) {
    try {
        const auction = await Auctions.findOne({ where: { id: auctionId } });

        await auction.update({
            status: 'COMPLETED'
        })
        console.log('***Auction ', auction.name, ' Completed***')
    } catch (err) {
        console.log(err.message);
    }
}

async function checkBidCause(bidId, causeId) {
    // Find the cause and check if completed
    // If true, find bid and update with completed status
    try {
        const cause = await Causes.findOne({ where: { id: causeId } });
        if (cause.status === 'COMPLETED') {
            const bid = await Bids.findOne({ where: { id: bidId } });
            
            bid.update({
                status: 'COMPLETED'
            })
        }

        console.log('***Bid Completed***')
    } catch (err) {
        console.log(err.message);
    }
}

async function checkBidAuction(bidId, auctionId) {
    // Find the auction and check if completed
    // If true, find bid and update with completed status
    try {
        const auction = await Auctions.findOne({ where: { id: auctionId } });
        if (auction.status === 'COMPLETED') {
            const bid = await Bids.findOne({ where: { id: bidId } });
            
            bid.update({
                status: 'COMPLETED'
            })
        }

        console.log('***Bid Completed***')
    } catch (err) {
        console.log(err.message);
    }
}

async function checkBidCauseResult() {
    // Find the bids that are completed
    // Sort by cause and then by funds
    // The 0 position is updated as winner per auction id
    try {
        const bids = await Bids.findAll({ where: { status: "COMPLETED" } });
        bids.sort(function(a,b){return a.cause - b.cause});
        bids.sort(function(a,b){return a.funds - b.funds});

        console.log('***Bid Cause Order***', bids)
    } catch (err) {
        console.log(err.message);
    }
}

async function checkBidAuctionResult() {
    // Find the bids that are completed
    // Sort by cause and then by funds
    // The 0 position is updated as winner per auction id
    try {
        const bids = await Bids.findAll({ where: { status: "COMPLETED" } });
        bids.sort(function(a,b){return a.auction - b.auction});
        bids.sort(function(a,b){return a.funds - b.funds});

        console.log('***Bid Auction Order***', bids)
    } catch (err) {
        console.log(err.message);
    }
}


function payment(total, payeeEmail){
    // For a fully working example, please see:
    // https://github.com/paypal-examples/docs-examples/tree/main/standard-integration

    const CLIENT_ID = process.env.CLIENT_ID;
    const APP_SECRET = process.env.APP_SECRET;
    const baseURL = {
        sandbox: "https://api-m.sandbox.paypal.com",
        production: "https://api-m.paypal.com"
    };

    // allow json body
    // app.use(express.json());

    // create a new order
    app.post("/create-paypal-order", async (req, res) => {
        const order = await createOrder();
        res.json(order);
        });

        // capture payment & store order information or fullfill order
        app.post("/capture-paypal-order", async (req, res) => {
        const { orderID } = req.body;
        const captureData = await capturePayment(orderID);
        // TODO: store payment information such as the transaction ID
        res.json(captureData);
        });

        //////////////////////
        // PayPal API helpers
        //////////////////////

        // use the orders api to create an order
        async function createOrder() {
        const accessToken = await generateAccessToken();
        const url = `${baseURL.sandbox}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total,
                        },
                        payee: {
                            email_address: payeeEmail,
                        },
                    },
                ],
            }),
        });
        const data = await response.json();
        return data;
        }

        // use the orders api to capture payment for an order
        async function capturePayment(orderId) {
            const accessToken = await generateAccessToken();
            const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            return data;
        }

        // generate an access token using client id and app secret
        async function generateAccessToken() {
            const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
            const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: {
                Authorization: `Basic ${auth}`,
                },
            });
            const data = await response.json();
            return data.access_token;
        }
}
