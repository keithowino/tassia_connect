# Tassia Connect

![Tassia Connect Banner](./client/public/banner.jfif)

## Overview

Tassia Connect is a community-centric e-commerce and business discovery platform built specifically for the Tassia Complex in Embakasi, Nairobi. As local entrepreneurship continues to grow, many small businesses still struggle with digital visibility while residents often miss nearby products and services.

Tassia Connect bridges this gap by creating a centralized local marketplace where businesses can showcase their offerings and community members can discover, shop, and engage with nearby vendors—all in one place.

### The Problem

Small businesses struggle with online visibility, while residents waste time searching for trusted local services and products.

### The Solution

A digital community marketplace where local businesses can list products and services, and residents can discover, order, review, and connect with nearby merchants.

**Live Demo:** https://tassia-connect.vercel.app/

---

## Key Features

### Customer Features

- **Discover Local Businesses** — Browse businesses by category or search by name/service
- **Shopping Cart with Persistence** — Cart items saved locally across sessions
- **Order Tracking** — Track orders from pending to completion with real-time status updates
- **Community Board** — Share announcements, deals, and interact with neighbors
- **Business Reviews & Ratings** — Rate and review experiences with star ratings
- **Favorites System** — Save businesses for quick access
- **Delivery & Pickup Options** — Flexible fulfillment choices with delivery fee calculation
- **Responsive Design** — Seamless experience across mobile, tablet, and desktop

### Business Owner Features

- **Comprehensive Business Dashboard** — Manage your storefront in one place
- **Product & Service Management** — Add, edit, and remove listings with stock tracking
- **Order Management System** — Process and manage customer orders with status updates
- **Performance Analytics** — Monitor views, ratings, and business activity
- **Business Submission Workflow** — Submit listings for admin approval
- **Delivery Configuration** — Set delivery fees and minimum order requirements
- **Business Hours Management** — Configure operating hours and days

### Admin Features

- **Business Approval System** — Review, approve, or reject business listings
- **Content Moderation** — Manage reviews, community posts, and user content
- **User Management** — View and manage user accounts and roles
- **Platform Analytics** — Monitor ecosystem growth and activity metrics
- **Category Management** — Create and manage business categories

---

## Technology Stack

| Category            | Technology                           |
| :------------------ | :----------------------------------- |
| Frontend            | React 19 + Vite                      |
| Styling             | Tailwind CSS                         |
| Routing             | React Router DOM v7                  |
| State Management    | React Context API                    |
| HTTP Client         | Axios                                |
| Icons               | Lucide React                         |
| Backend             | Node.js + Express                    |
| Database            | MongoDB + Mongoose ODM               |
| Authentication      | JWT (JSON Web Tokens)                |
| Password Encryption | bcryptjs                             |
| Payment Integration | Daraja API (M-Pesa) - Planned        |
| Maps Integration    | Leaflet + React-Leaflet - Planned    |
| Build Tool          | Vite                                 |
| Hosting             | Render (Backend) + Vercel (Frontend) |

---

## Architecture

### Frontend Structure

```bash

client/
├── src/
│ ├── components/
│ │ ├── business/ # Business cards, filters, categories
│ │ ├── common/ # Loading spinners, star ratings, metadata
│ │ ├── layout/ # Header, footer, bottom navigation
│ │ └── orders/ # Cart drawer, checkout flow
│ ├── lib/
│ │ ├── api.js # Centralized API service layer
│ │ ├── context/ # Auth, Cart, Data contexts
│ │ └── MetadataInsert.jsx
│ ├── pages/ # All route pages
│ └── App.jsx # Main application with routing

```

### Backend Structure

```bash

server/
├── src/
│ ├── controllers/ # Business logic for each entity
│ ├── models/ # MongoDB schemas (User, Business, Product, etc.)
│ ├── routes/ # API route definitions
│ ├── middleware/ # Auth, validation, error handling
│ └── server.js # Express application entry point

```

---

### API Endpoints

---

| Method | Endpoint                   | Description              | Access         |
| :----- | :------------------------- | :----------------------- | :------------- |
| POST   | /api/auth/register         | User registration        | Public         |
| POST   | /api/auth/login            | User login               | Public         |
| POST   | /api/auth/google           | Google OAuth login       | Public         |
| GET    | /api/auth/me               | Get current user profile | Authenticated  |
| GET    | /api/businesses            | Get all businesses       | Public         |
| GET    | /api/businesses/my         | Get user's businesses    | Business Owner |
| POST   | /api/businesses            | Create new business      | Business Owner |
| PUT    | /api/businesses/:id        | Update business          | Owner/Admin    |
| GET    | /api/products/business/:id | Get products by business | Public         |
| POST   | /api/orders                | Create new order         | Customer       |
| GET    | /api/orders/my             | Get user's orders        | Customer       |
| PATCH  | /api/orders/:id/status     | Update order status      | Business Owner |
| POST   | /api/reviews               | Create business review   | Customer       |
| GET    | /api/community/posts       | Get community posts      | Public         |
| POST   | /api/community/posts       | Create community post    | Authenticated  |

---

## Feature Access Matrix

| Feature                    | Customer | Business Owner | Admin |
| :------------------------- | :------: | :------------: | :---: |
| Browse businesses          |    ✓     |       ✓        |   ✓   |
| Place orders               |    ✓     |       ✓        |   ✓   |
| Write reviews              |    ✓     |       ✓        |   ✓   |
| Community interactions     |    ✓     |       ✓        |   ✓   |
| Save favorites             |    ✓     |       ✓        |   ✓   |
| Manage business listing    |    —     |       ✓        |   ✓   |
| Manage business orders     |    —     |       ✓        |   ✓   |
| Add/Edit products/services |    —     |       ✓        |   ✓   |
| View business analytics    |    —     |       ✓        |   ✓   |
| Configure delivery options |    —     |       ✓        |   ✓   |
| Approve businesses         |    —     |       —        |   ✓   |
| Moderate content           |    —     |       —        |   ✓   |
| Manage categories          |    —     |       —        |   ✓   |
| View platform analytics    |    —     |       —        |   ✓   |

---

## Project Structure

```bash
tassia-connect/
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Contexts, API, utilities
│   │   └── pages/            # Route pages
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── server/                    # Node.js backend application
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   └── middleware/       # Auth, validation
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Before running the project locally, ensure you have:

- Node.js (v18+ recommended)
- npm or yarn
- Git
- Modern browser
- MongoDB Atlas account (or local MongoDB instance)

---

## Installation & Setup

### Clone the repository:

```bash
git clone https://github.com/keithowino/tassia-connect.git
cd tassia-connect
```

### Backend Setup:

```bash
cd server
npm install
cp .env.example .env.development
# Edit .env.development with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup:

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### Environment Variables

**Backend (.env.development):**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Frontend (.env.development):**

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Open `http://localhost:5173` to view the application.

---

## Deployment

### Backend Deployment (Render)

```bash
# Connect your GitHub repository to Render
# Set environment variables in Render dashboard
# Deploy automatically on push
```

### Frontend Deployment (Vercel)

```bash
npm run build
# Connect your GitHub repository to Vercel
# Set VITE_API_URL to your deployed backend URL
# Deploy
```

---

## Current Status ✅

- ✅ Complete MongoDB migration from Firebase
- ✅ JWT authentication system
- ✅ Business registration and management
- ✅ Product/service CRUD operations
- ✅ Shopping cart with localStorage persistence
- ✅ Order processing system
- ✅ Review and rating system
- ✅ Community board with post types
- ✅ Favorites system
- ✅ Admin moderation panel
- ✅ Responsive mobile-first design
- ✅ CORS and environment configuration
- ✅ Error handling and validation

---

## Planned Enhancements

### Phase 1: Payment & Financial Systems

- **M-Pesa Integration (Daraja API)** — Direct mobile payments
- **Multiple Payment Methods** — Card payments, bank transfers
- **Digital Receipts** — Email/SMS order confirmations
- **Wallet System** — In-app wallet for faster checkout
- **Business Payouts** — Automated settlement to business owners
- **Transaction History** — Detailed financial records for users

### Phase 2: Maps & Location Services

- **Interactive Store Locator** — Leaflet.js integration
- **Real-time Delivery Tracking** — GPS-based order tracking
- **Geofencing** — Automatic store discovery based on location
- **Distance-based Delivery Fees** — Dynamic pricing based on distance
- **Store Directions** — Navigation assistance for pickup
- **Service Area Management** — Businesses define delivery zones

### Phase 3: Communication & Engagement

- **Push Notifications** — Order updates, promotions, reminders
- **In-app Messaging** — Direct chat between customers and businesses
- **Live Order Updates** — Real-time WebSocket notifications
- **Email Marketing Integration** — Newsletter and campaign management
- **SMS Alerts** — Critical order notifications via text
- **Community Events Calendar** — Local event management

### Phase 4: AI & Personalization

- **AI-Powered Recommendations** — Personalized product suggestions
- **Smart Search** — Semantic search with natural language processing
- **Predictive Inventory** — Stock prediction for businesses
- **Customer Segmentation** — Targeted marketing campaigns
- **Review Sentiment Analysis** — Automated review insights
- **Chatbot Support** — AI-powered customer service assistant

### Phase 5: Business Intelligence

- **Advanced Analytics Dashboard** — Sales trends, customer behavior
- **Export Reports** — CSV/PDF exports for business owners
- **Competitor Analysis** — Benchmarking against similar businesses
- **Customer Lifetime Value** — Retention and loyalty metrics
- **Peak Hour Analysis** — Optimal operating hours recommendations
- **Inventory Alerts** — Low stock notifications

### Phase 6: Social & Gamification

- **Loyalty Programs** — Points system for repeat customers
- **Referral System** — Earn rewards for inviting friends
- **Badges & Achievements** — Gamified user engagement
- **Social Media Integration** — Share products to Facebook, Twitter
- **Flash Sales** — Time-limited discounts and promotions
- **Group Buying** — Collective purchasing power discounts

### Phase 7: Multi-tenant & Scalability

- **Multi-language Support** — English + Swahili + other local languages
- **Multi-currency Support** — Handle different currencies
- **Progressive Web App (PWA)** — Offline access and installable app
- **Mobile Native Apps** — React Native for iOS and Android
- **White-label Solution** — Customizable for other communities
- **API Rate Limiting** — Scalable request handling

### Phase 8: Advanced Features

- **Voice Search** — Hands-free business discovery
- **Image Recognition** — Search products by photo
- **Augmented Reality** — Virtual product preview
- **Blockchain Receipts** — Immutable transaction records
- **Subscription Models** — Premium features for businesses
- **Affiliate Marketing** — Earn commissions on referrals

---

## Development Roadmap

| Quarter | Focus Area              | Key Deliverables                        |
| :------ | :---------------------- | :-------------------------------------- |
| Q1 2026 | Core Platform Stability | Complete MongoDB migration, bug fixes   |
| Q2 2026 | Payment Integration     | M-Pesa, digital receipts, wallet system |
| Q3 2026 | Maps & Location         | Store locator, delivery tracking        |
| Q4 2026 | AI Features             | Recommendations, smart search, chatbot  |
| Q1 2027 | Mobile Apps             | React Native iOS/Android applications   |
| Q2 2027 | Scale & Expand          | White-label solution, multi-language    |

---

## Known Issues & Troubleshooting

### CORS Errors

Ensure your backend `CLIENT_URL` environment variable matches your frontend URL exactly (no trailing slash).

### MongoDB Connection Issues

- Verify IP whitelist in MongoDB Atlas
- Check connection string credentials
- Ensure network allows outbound connections

### JWT Authentication

- Tokens expire after 7 days (configurable)
- Clear localStorage on logout
- Tokens are automatically refreshed on protected routes

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting PR

---

## License

This project is proprietary and confidential.

See the [LICENSE](./LICENSE) file for additional details.

All rights reserved.

---

## Acknowledgments

- **DeepSeek** — Primary AI assistant for development guidance
- **Bolt.new** — Accelerated initial prototyping
- **MongoDB Atlas** — Scalable database infrastructure
- **Render & Vercel** — Reliable hosting platforms
- **Local business owners** — Valuable feedback and testing
- **Community members** — Continuous support and engagement
- **Open Source Community** — Amazing tools and libraries

---

## Contact

**Keith Owino**

- Email: designsolutions1629@gmail.com
- GitHub: [@keithowino](https://github.com/keithowino)
- Portfolio: [Pickaxe & Shovel](https://pickaxe-and-shovel.vercel.app)
- Twitter: [@keithowino](https://twitter.com/keithowino)

**Project Links:**

- Repository: https://github.com/keithowino/tassia-connect
- Live Demo: https://tassia-connect.vercel.app/
- API Endpoint: https://tassia-connect.onrender.com

---

## Support the Project

If you find this project valuable, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs via Issues
- 💡 Suggesting new features
- 🤝 Contributing code
- 📢 Sharing with your network

For business inquiries or partnerships, please reach out via email.

---

## Version History

| Version | Date       | Changes                                           |
| :------ | :--------- | :------------------------------------------------ |
| 1.0.0   | 2024-12-01 | Initial Firebase launch                           |
| 2.0.0   | 2026-01-15 | Complete MongoDB migration                        |
| 2.1.0   | 2026-03-01 | Cart system, order management                     |
| 2.2.0   | 2026-05-01 | Community board, reviews, favorites               |
| 2.3.0   | 2026-06-01 | Admin panel, analytics, performance optimizations |

---

**Built with ❤️ for the Tassia Community**

_Empowering local businesses, connecting neighbors, building community._
