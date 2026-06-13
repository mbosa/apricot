# RSU Tax Calculator

A small personal tool to calculate values for Quadro W and Quadro T from the equity portal exports. Not a substitute for proper tax advice. See disclaimer below.

---

The main logic to calculate the final values is in:

| Quadro | File | Function |
|--------|------|----------|
| W | [src/handlers/quadro/quadro-w.mjs](https://github.com/mbosa/apricot/blob/main/src/handlers/quadro/quadro-w.mjs) | `calculateW` |
| T | [src/handlers/quadro/quadro-t.mjs](https://github.com/mbosa/apricot/blob/main/src/handlers/quadro/quadro-t.mjs) | `calculateT` |

---

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

- This is not tax advice, and I'm not an accountant. Double-check the numbers with yours
- I take no responsibility for what you write in your own tax report.
- This is not endorsed by Klarna
- The exports from the equity portal include your name. The data you upload doesn't leave your browser and is not sent anywhere. If you don't trust it, you can delete your name from the reports before uploading them
