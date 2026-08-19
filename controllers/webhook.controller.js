const crypto = require('crypto');
const { Invoice } = require('../models');

const CHAPA_WEBHOOK_SECRET = process.env.CHAPA_WEBHOOK_SECRET;

const handleChapaWebhook = async (req, res) => {
  try {
    // Verify the signature BEFORE trusting anything in the body
    const signature =
      req.headers['x-chapa-signature'] || req.headers['chapa-signature'];

    if (!signature) {
      return res.status(401).json({ message: 'Missing signature' });
    }

    const expectedHash = crypto
      .createHmac('sha256', CHAPA_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedHash !== signature) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Signature confirmed genuine — now safe to read the event
    const event = req.body;

    if (event.event === 'charge.success') {
      const invoice = await Invoice.findOne({
        where: { tx_ref: event.tx_ref },
      });

      if (invoice && invoice.status !== 'paid') {
        // The !== 'paid' check makes this idempotent —
        // if Chapa resends this same event, we simply skip re-processing
        await invoice.update({ status: 'paid' });
      }
    }

    // Always acknowledge, even for event types we don't act on
    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    // Still return 200 to prevent Chapa retry storms for our own internal bugs;
    // log the error server-side for you to investigate separately
    res.status(200).json({ message: 'Webhook received' });
  }
};

module.exports = { handleChapaWebhook };
