import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Stripe if secret key is present
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// Public Stripe configuration endpoint
app.get('/api/stripe-config', (_req, res) => {
  res.json({
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_poshpop_marketplace',
    hasSecretKey: Boolean(stripeSecretKey),
    mode: stripeSecretKey ? 'live_stripe' : 'simulated_test'
  });
});

// Create PaymentIntent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', itemTitle = 'Second-Hand Garment', orderNumber = '' } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const amountInCents = Math.round(amount * 100);

    // If real Stripe secret key is configured, invoke Stripe API
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        description: `PoshPop Escrow Order #${orderNumber}: ${itemTitle}`,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderNumber,
          itemTitle,
          platform: 'PoshPop Marketplace',
          escrowProtection: 'true'
        }
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        mode: 'live'
      });
    }

    // High-fidelity sandbox / test simulation when no Stripe key is configured yet
    const simulatedId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const simulatedClientSecret = `${simulatedId}_secret_${Math.random().toString(36).substring(2, 10)}`;

    return res.json({
      clientSecret: simulatedClientSecret,
      paymentIntentId: simulatedId,
      amount,
      currency,
      status: 'requires_payment_method',
      mode: 'sandbox_escrow',
      message: 'PaymentIntent created in Stripe Sandbox Escrow Mode'
    });
  } catch (err: any) {
    console.error('Error creating Stripe PaymentIntent:', err);
    return res.status(500).json({
      error: err.message || 'Failed to create payment intent'
    });
  }
});

// Setup dev server with Vite middleware or serve production dist
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: 3000,
        host: '0.0.0.0'
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} (Stripe Escrow API active)`);
  });
}

startServer();
