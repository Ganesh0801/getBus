# BusNova — Full-Stack Bus Ticket Booking Platform

A production-oriented starter project for a modern bus ticket booking application.

## Highlights

### Customer
- Registration with username, phone and email
- Email OTP verification before password creation
- Login with username + password
- Forgot-password email OTP flow
- Browse buses by From / To / Date
- Filters: AC / Non-AC, Seater / Sleeper, departure time, price
- Bus images and operator details
- Interactive seat map
- Occupied seats are disabled
- Gender-aware adjacent-seat rule:
  - A female passenger cannot be placed beside an occupied male passenger.
  - A female passenger can be placed beside a female passenger.
  - The UI never exposes another passenger's personal information.
  - Companion relationship is collected only for the booking passenger when applicable.
- First-booking 10% coupon
- Checkout preview
- Passenger name, age and gender validation
- Simulated payment using email OTP (replace with Razorpay/Stripe later)
- PNR generation
- Ticket confirmation
- Email ticket after successful payment
- My bookings / profile

### Admin
- Admin login
- Bus CRUD
- Bus name/operator, route, pickup/drop, schedule, fare
- AC/non-AC, seater/sleeper, amenities
- Bus image URL
- Offer percentage
- User list
- Revenue / expenses / profit dashboard
- Monthly statistics
- Booking list

## Architecture

```text
bus-booking-platform/
├── frontend/                 # React + Vite + Tailwind + Redux Toolkit + Redux Saga
├── backend/                  # Express + MongoDB + JWT + Nodemailer
└── docs/
```

## Important production note

The payment OTP flow in this project is a **payment simulation** because no payment gateway was requested/provided. It proves the complete booking architecture:

`Pay Now -> Payment OTP email -> Verify OTP -> booking confirmation -> PNR -> ticket email`

For real money, replace the payment simulation with Razorpay/Stripe/PayU server-side payment verification and webhooks.

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Configure MongoDB and SMTP in `.env`.

To create the first admin:

```bash
npm run seed:admin
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

## Default admin

The seed script reads:

```env
ADMIN_EMAIL=admin@busnova.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMe123!
```

Change these values before production.

## API overview

### Auth
- `POST /api/auth/register/start`
- `POST /api/auth/register/verify-email`
- `POST /api/auth/register/set-password`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password/start`
- `POST /api/auth/forgot-password/verify`
- `POST /api/auth/forgot-password/reset`

### Buses
- `GET /api/buses`
- `GET /api/buses/:id`
- `POST /api/buses` admin
- `PATCH /api/buses/:id` admin
- `DELETE /api/buses/:id` admin

### Booking
- `GET /api/bookings/seat-map/:busId?date=YYYY-MM-DD`
- `POST /api/bookings/payment/start`
- `POST /api/bookings/payment/verify`
- `GET /api/bookings/my`
- `GET /api/bookings/:id`

### Admin
- `GET /api/admin/users`
- `GET /api/admin/bookings`
- `GET /api/admin/stats`

## Seat policy

The seat service performs the final validation. Never trust the browser's seat availability.

The backend checks:
1. Bus exists.
2. Travel date is valid.
3. Requested seats are not already booked.
4. Passenger information is complete.
5. Female adjacency rule is satisfied.
6. Coupon is valid.
7. Payment OTP is verified.
8. Booking is created atomically enough for this application.

For high-volume production traffic, use MongoDB transactions + a temporary seat-hold collection with TTL.

## Email

Beautiful responsive HTML templates are in:

```text
backend/src/templates/
├── registerOtp.js
├── forgotOtp.js
├── paymentOtp.js
└── ticket.js
```

## Security checklist before production

- Use HTTPS.
- Store JWT in secure HttpOnly cookies rather than localStorage where possible.
- Add refresh-token rotation.
- Add rate limiting to OTP endpoints.
- Hash OTP values instead of storing raw OTPs.
- Use Redis for OTP/seat locks at scale.
- Add MongoDB transactions for final seat allocation.
- Integrate a real payment gateway.
- Validate image uploads with MIME/size limits if using uploads instead of URLs.
- Add audit logs for admin operations.
- Add CSRF protection if cookie auth is used.
- Add structured logging and monitoring.

## Brand

The supplied logo is used as:

```text
frontend/public/logo.svg
```

Primary visual colors:

- Indigo/Purple: `#4A00E0`
- Violet: `#8E2DE2`
- Female-seat accent: `#EC4899`
- Dark text: `#111827`

## UX direction

The frontend uses:
- Glassy cards
- Large route search hero
- Gradient CTAs
- Rounded 2xl cards
- Accessible focus states
- Mobile-first responsive layouts
- Clear seat legend
- Sticky checkout summary
- Friendly empty/loading/error states

### Optional demo data

```bash
cd backend
npm run seed:buses
```
