# RSU Tax Calculator

A small personal tool to calculate Quadro W and Quadro T values from Equity portal exports. Not a substitute for proper tax advice. See disclaimer below.

## Usage

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000), upload the 4 CSV exports from your equity portal, then click **Calculate Quadro W** and/or **Calculate Quadro T**.

## Development

```bash
npm run start:dev
```

---

To work with mocked data, so you don't have to upload the files at every iteration:

```bash
cp mock-uploads.mjs.example mock-uploads.mjs
```

Edit mock-uploads.mjs with the data you want

```bash
npm run start:dev:mock
```

## ⚠️ Disclaimer

- This is not tax advice. Double-check the numbers with your accountant.
- I can't guarantee this is correct. Use at your own risk.
- I take no responsibility for what you write in your own tax report.
- The exports from the equity portal include your name. The data you upload does not leave your browser and is not sent anywhere. If you don't trust it, delete your name from the reports before uploading them.
