const db = require('../config/database');
const Users = db.User;
const Auctions = db.Auction;
const Causes = db.Cause;
const Bids = db.Bid;
const Op = db.Sequelize.Op;

const duration = 10000;
// 1 Hour = 36000000
// 30 Mins = 18000000
// 10 min = 600000
// 10 sec = 10000

// Get active causes/auctions
// Check if completed
// Find highest bid per cause/auction
// Initiate payment with accounts on hand
// Update causes/auctions to completed status

const run = false;

if (run) {
    setTimeout(checkActive, duration);
}


async function checkActive() {
    try {
        console.log('***Checking Causes***');
        const causes = await Causes.findAll({ where: { status: 'ACTIVE'} });
        causes.forEach(function(cause){
            // 604800 = 1 Week
            let total = (cause.start + (604800 * cause.time)) - (Date.now() / 1000);
            console.log('CAUSE TOTAL', total)
            if (total <= 0) {
                updateCause(cause.id)
                checkBidCauseResult(cause.id);
            }
        })
        console.log('***Checking Auctions***');
        const auctions = await Auctions.findAll({ where: { status: 'ACTIVE'} });
        auctions.forEach(function(auction){
            // 604800 = 1 Week
            let total = (auction.start + (604800 * auction.time)) - (Date.now() / 1000);
            console.log('AUCTION TOTAL', total)
            if (total <= 0) {
                updateAuction(auction.id)
                checkBidAuctionResult(auction.id);
            }
        })
        
        setTimeout(checkActive, duration)
    } catch (err) {
        console.log(err.message);
        setTimeout(checkActive, duration)
    };
}

async function updateCause(causeId) {
    try {
        console.log('***UPDATING CAUSE***')
        const cause = await Causes.findOne({ where: { id: causeId } });

        await cause.update({
            status: 'COMPLETED'
        })
        console.log('***CAUSE ', cause.name, ' COMPLETED***')
    } catch (err) {
        console.log(err.message);
    }
}

async function updateAuction(auctionId) {
    try {
        console.log('***UPDATING AUCTION***')
        const auction = await Auctions.findOne({ where: { id: auctionId } });

        await auction.update({
            status: 'COMPLETED'
        })
        console.log('***AUCTION ', auction.name, ' COMPLETED***')
    } catch (err) {
        console.log(err.message);
    }
}

async function checkBidCauseResult(causeId) {
    // Find the bids by cause Id
    // Sort by funds
    // The 0 position is updated as winner
    // Find the rest of the active bids for that cause Id
    // Update them as outbid
    try {
        const bids1 = await Bids.findAll({ where: { cause: causeId } });
        bids1.sort(function(a,b){return a.funds - b.funds});
        bids1[0].update({
            status: 'WINNER'
        })
        console.log('***BID WINNER***', bids1[0])
        const bidWinner = bids1[0];
        const auction = Auctions.findOne({where: { id: bidWinner.auction } });
        // Get clientId
        const seller = Users.findOne({where: { id: auction.creator } });
        // Get paypalEmail
        const payee = Users.findOne({where: { id: bidWinner.creator } });
        payment(seller.clientId, payee.paypalEmail, bidWinner.amount);

        const bids2 = await Bids.findAll({ where: { cause: causeId, status: 'ACTIVE' } });
        bids2.forEach(function(bid){
            bid.update({
                status: 'OUTBID'
            })
        })


    } catch (err) {
        console.log(err.message);
    }
}

async function checkBidAuctionResult(auctionId) {
    // Find the bids by auction Id
    // Sort by funds
    // The 0 position is updated as winner
    // Find the rest of the active bids for that auction Id
    // Update them as outbid
    try {
        const bids1 = await Bids.findAll({ where: { auction: auctionId } });
        bids1.sort(function(a,b){return a.funds - b.funds});
        bids1[0].update({
            status: 'WINNER'
        })
        console.log('***BID WINNER***', bids1[0])

        const bids2 = await Bids.findAll({ where: { auction: auctionId, status: 'ACTIVE' } });
        bids2.forEach(function(bid){
            bid.update({
                status: 'OUTBID'
            })
        })

    } catch (err) {
        console.log(err.message);
    }
}


function payment(clientId, payeeEmail, total){
    // For a fully working example, please see:
    // https://github.com/paypal-examples/docs-examples/tree/main/standard-integration

    const CLIENT_ID = clientId;
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
