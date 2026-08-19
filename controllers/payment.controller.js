const axios = require('axios');
const { Invoice } = require('../models');

const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL;
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

const initializePayment = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Invoice is already paid' });
    }

    // Unique reference so we can match the webhook back to this invoice
    const tx_ref = `invoice-${invoice.id}-${Date.now()}`;

    const chapaResponse = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      {
        amount: invoice.amount,
        currency: 'ETB',
        tx_ref,
        callback_url: `${process.env.APP_BASE_URL}/api/webhooks/chapa`,
        return_url: `${process.env.APP_BASE_URL}/payment-success`,
        customization: {
          title: 'Tuition Payment',
          description: invoice.description || 'Student invoice payment',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      },
    );

    // Store the tx_ref on the invoice so we can look it up later when the webhook arrives
    await invoice.update({ tx_ref });

    res.json({
      checkoutUrl: chapaResponse.data.data.checkout_url,
      tx_ref,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to initialize payment',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { initializePayment };
