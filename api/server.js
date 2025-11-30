require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./config/passport');

const authRoutes = require('./models/routes/auth');
const questionRoutes = require('./models/routes/questions');
const answerRoutes = require('./models/routes/answers');
const adminRoutes = require('./models/routes/admin');
const notificationRoutes = require('./models/routes/notifications');

const app = express();

/* -----------------------------------------
   SECURITY MIDDLEWARE
----------------------------------------- */
app.use(helmet());

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
  });
  app.use(limiter);
}

/* -----------------------------------------
   CORS CONFIG (🔥 FIXED FOR PRODUCTION)
----------------------------------------- */

const allowedOrigins = [
  process.env.CLIENT_URL,          // Vercel frontend (production)
  "http://localhost:3000",         // local dev
  "http://localhost:3001"          // alternative dev
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

/* -----------------------------------------
   SESSION + PASSPORT
----------------------------------------- */
app.use(session({
  secret: process.env.JWT_SECRET || "fallback-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

/* -----------------------------------------
   PARSING
----------------------------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------------
   MONGODB CONNECTION
----------------------------------------- */
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log("MongoDB connection error:", err));

/* -----------------------------------------
   ROUTES
----------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

/* -----------------------------------------
   HEALTH CHECK
----------------------------------------- */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

/* -----------------------------------------
   GLOBAL ERROR HANDLER
----------------------------------------- */
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

/* -----------------------------------------
   404 HANDLER
----------------------------------------- */
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* -----------------------------------------
   START SERVER
----------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.CLIENT_URL}`);
  console.log(`MongoDB URI: ${mongoUri}`);
  console.log("======================================");
});
