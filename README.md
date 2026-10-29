# SEPELA – Next.js site

## Chalane ka tareeqa
```bash
npm install
npm run dev     # http://localhost:3000
```
Deploy: GitHub par push karo aur Vercel mein import kar do.

## Kahan kya badalna hai
- `components/CanScene.js` – 3D scroll animation (three.js). Timing keyframes() mein hai
- `data/products.js` – flavors, prices, rang aur description
- `public/labels/` – wrap-around label artwork (JPG). `public/logo.png` – logo. Naya flavor: label daalo + products.js mein entry (faceU = brand ki jagah, 0 se 1)
- `components/AgeGate.js` – age check (MIN_AGE_LABEL)
- Cart abhi sirf demo hai. Real checkout ke liye Stripe / Shopify / WhatsApp order add karna hoga.
- Text aur prices placeholder hain, apne asli daal lena.
