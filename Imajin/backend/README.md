# Imajin Backend

Simple Express-based backend for the marketplace prototype.

Requirements implemented:
- Register / Login (bcrypt + JWT)
- Product listing, search and filtering
- Cart endpoints and dummy checkout (supports partial quantities)
- Order history

Quick start (Windows cmd.exe):

```cmd
cd c:\workspace\Imajin\backend
npm install
npm run start
```

Run tests:

```cmd
npm run test
```

Notes:
- Storage is a simple JSON file at `data/store.json` for the prototype.
- Passwords are hashed using bcrypt.
- This is a lightweight scaffold intended for local development and unit testing.
