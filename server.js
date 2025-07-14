const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const mysqlpool = require("./config/db");
const { createAllTables } = require("./models/createTables");

// Configure dotenv
dotenv.config();

// Create Express app
const app = express();

//  CORS Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow cookies, auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/v1/athlete", require("./routes/athletesRouts"));
app.use("/api/v1/register_athletes", require("./routes/registrationFormRouts"));
app.use("/api/v1/news_update", require("./routes/newsUpdateRoutes"));
app.use("/api/v1/coaches_details", require("./routes/coachesDetailsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/admin_auth", require("./routes/adminAuthRoutes"));
app.use("/api/v1/get-heats", require("./routes/heatRoutes"));

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("<h1>Mysql 123</h1>");
});

// Start server only after DB is connected
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await createAllTables();
    console.log("MySQL tables ensured");
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
};

startServer();
