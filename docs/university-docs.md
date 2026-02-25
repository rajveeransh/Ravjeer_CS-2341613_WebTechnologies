# Rupkala – Project Abstract

## Title
Rupkala: A Human-Centered Custom T-Shirt E-Commerce Platform

## Abstract

This project presents the design, development, and deployment of Rupkala — a full-stack e-commerce web application that enables users to design and purchase custom printed t-shirts. Unlike conventional online clothing stores, Rupkala is built around the principle of human-centered design (HCD), prioritising the emotional, creative, and social dimensions of fashion.

The platform is developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) following the Model-View-Controller (MVC) architectural pattern. Key features include: a custom design studio (text and image overlays on product mockups), a secure JWT-based authentication system, a complete order lifecycle with dummy payment gateway integration simulating Razorpay, a user dashboard for managing orders and saved designs, and an administrative panel for product, order, and user management.

Humanistic principles are woven into every layer of the application — from the brand narrative ("Wear Your Story") and emotionally-toned microcopy, to inclusive colour systems and accessible UI components. The project demonstrates how modern web technologies can be applied to build not merely functional, but emotionally resonant digital products.

**Keywords:** MERN stack, e-commerce, custom printing, human-centered design, REST API, JWT authentication, print-on-demand.

---

# Problem Statement

The fast-fashion industry offers mass-produced clothing with little room for personal expression. Existing e-commerce platforms typically treat customers as passive consumers rather than active creators. Individuals — particularly youth and creative communities — lack an accessible, affordable, and technically reliable platform to design truly personalised clothing.

Furthermore, most custom printing services available in India either lack digital design capabilities, require high minimum order quantities unsuitable for individual buyers, or offer poor user experiences that frustrate rather than inspire creativity.

**Rupkala addresses this gap by providing:**
1. An intuitive online design studio accessible to non-designers
2. A seamless print-on-demand ordering pipeline with low (even single-unit) minimums
3. A brand identity and UI language that speaks to personal expression rather than corporate transactions
4. A technically robust and scalable platform built on modern industry standards

---

# Literature Review

**Human-Centered Design (HCD):** As defined by the IDEO Design Thinking framework and Don Norman's seminal work *The Design of Everyday Things*, HCD places the user's needs, emotions, and context at the centre of product decisions. Applied to e-commerce, this means designing interactions that reduce friction, inspire confidence, and create emotional connection — not just transactional efficiency.

**E-Commerce Personalisation:** Research by McKinsey & Company (2021) shows that 71% of consumers expect personalised interactions, and 76% become frustrated when they don't find them. Rupkala's custom design feature directly addresses this expectation.

**MERN Stack in Modern Web Development:** The combination of MongoDB (document database), Express.js (REST API), React.js (component-based UI), and Node.js (server runtime) has emerged as a dominant full-stack approach due to its unified JavaScript ecosystem, rapid development cycle, and excellent community support (MongoDB, 2023).

**Print-on-Demand (POD) Market:** The global custom t-shirt printing market was valued at USD 4.9 billion in 2022 and is expected to grow at 9.7% CAGR through 2030 (Grand View Research, 2023), driven by rising demand for self-expression and the democratisation of digital design tools.

**JWT Authentication Best Practices:** JSON Web Tokens, as specified in RFC 7519, provide a stateless, scalable mechanism for user authentication in REST APIs. When paired with bcryptjs password hashing (work factor ≥ 10), they offer an appropriate security baseline for consumer applications.

---

# ER Diagram (Entity Relationship Description)

## Entities and Relationships

### User
- Fields: _id, name, email, password (hashed), role, avatar, addresses[], wishlist[]
- Relationships:
  - **Places** → Order (1 to Many)
  - **Creates** → Design (1 to Many)
  - **Writes** → Review (embedded in Product, 1 to Many)

### Product
- Fields: _id, name, tagline, description, details{fabric,fit,wash,weight}, price, salePrice, category, sizes[], colors[], images[], allowCustomDesign, printPositions[], isFeatured, isActive, reviews[], rating, numReviews, slug
- Relationships:
  - **Has** → Reviews (embedded, Many)
  - **Referenced by** → OrderItem (Many to Many via OrderItem)
  - **Referenced by** → Design (1 to Many)

### Order
- Fields: _id, orderNumber, user_ref, orderItems[], shippingAddress{}, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentMethod, paymentResult{}, isPaid, paidAt, status, isDelivered, deliveredAt, notes
- OrderItem (embedded): product_ref, name, image, price, quantity, size, color, customDesign_ref
- Relationships:
  - **Belongs to** → User (Many to 1)
  - **Contains** → Product (Many to Many via embedded items)
  - **References** → Design (optional, via customDesign)

### Design
- Fields: _id, user_ref, product_ref, title, textLayer{content,font,fontSize,color,bold,italic,positionX,positionY}, imageLayer{url,positionX,positionY,width,height}, printPosition, previewImage, isSaved
- Relationships:
  - **Belongs to** → User (Many to 1)
  - **Applied to** → Product (Many to 1)
  - **Referenced by** → OrderItem (optional, 1 to 1)

---

# System Architecture

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  React.js (Vite) + Tailwind CSS                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │ Components│  │ Context  │              │
│  │  (Routes)│  │ (UI Parts)│  │(State)   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────────────────────────────────┐               │
│  │   Services (Axios HTTP calls)        │               │
│  └──────────────────────────────────────┘               │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP/REST (JSON)
┌────────────────────────▼─────────────────────────────────┐
│                    API LAYER                             │
│  Express.js (Node.js)                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Routes  │→ │Middleware│→ │Controllers│             │
│  │(Endpoints)│ │(Auth,    │  │(Business │             │
│  │          │  │ Upload)  │  │ Logic)   │             │
│  └──────────┘  └──────────┘  └──────────┘              │
└────────────────────────┬─────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼─────────────────────────────────┐
│                  DATABASE LAYER                          │
│  MongoDB                                                 │
│  ┌────────┐  ┌─────────┐  ┌───────┐  ┌────────┐       │
│  │ Users  │  │Products │  │Orders │  │Designs │       │
│  └────────┘  └─────────┘  └───────┘  └────────┘       │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User action** (e.g., "Add to Cart") triggers a React state update (CartContext)
2. **API call** (e.g., "Place Order") goes via Axios → Vite proxy → Express route
3. **Middleware** verifies JWT, checks role if needed
4. **Controller** executes business logic (validates stock, creates order document)
5. **Mongoose** writes to MongoDB and returns populated document
6. **Response** travels back through JSON → Axios → React state → UI update

## Security Measures

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens expire in 7 days; refresh requires re-login
- Admin-only routes protected by double middleware (protect + adminOnly)
- File uploads restricted by MIME type and 5 MB size limit
- CORS configured to allow only known origins
- Sensitive fields (password) excluded from queries using Mongoose `select: false`

---

# Future Scope

1. **Real Payment Integration** — Replace dummy simulation with live Razorpay/Stripe SDK
2. **Fabric.js Design Canvas** — Full drag-and-drop canvas editor with layer management, stickers, and design templates
3. **AI Design Suggestions** — Use generative AI to suggest designs based on user preferences
4. **Cloud Storage** — Migrate upload handling from local disk to AWS S3 or Cloudinary
5. **Email Notifications** — Transactional emails for order confirmation, shipping updates via Nodemailer/SendGrid
6. **Multi-vendor Support** — Allow independent designers to sell their artwork on the platform
7. **Mobile App** — React Native companion app for on-the-go design and ordering
8. **Analytics Dashboard** — Revenue trends, top-selling products, customer retention metrics
9. **Inventory Management** — Real-time stock alerts, low-stock notifications, automated restocking workflows
10. **Social Sharing** — Users can share their custom designs to Instagram/WhatsApp directly from the platform
11. **Review Image Upload** — Allow customers to upload photos of received products with their reviews
12. **Subscription Model** — Monthly design credits for frequent custom orders at a discounted rate

---

# Conclusion

Rupkala demonstrates that e-commerce platforms can be more than transactional tools — they can be empowering, expressive, and emotionally meaningful. By combining a robust MERN stack architecture with humanistic design principles, this project delivers a platform that serves both technical requirements and genuine human needs.

From a technical standpoint, the project successfully implements:
- A secure, scalable REST API following MVC architecture
- JWT-based stateless authentication with role-based access control
- Complete e-commerce lifecycle: browse → design → cart → checkout → order tracking
- Admin capabilities for product, order, and user management
- A responsive, accessible UI with a cohesive brand identity

From a human-centered standpoint, Rupkala proves that software can carry values — the belief that personal expression matters, that clothing is a language, and that technology should serve the individual rather than reduce them to a data point.

The platform is submission-ready as a working prototype and provides a strong foundation for future commercial deployment with the enhancements described in the Future Scope section.

> *"Every tee has a voice. Rupkala gives it the words."*
