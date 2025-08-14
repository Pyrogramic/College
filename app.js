// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== MongoDB Connection =====
mongoose.connect(
  process.env.MONGO_URI || "mongodb+srv://ssmptc:KtSJZsMNl9IAOl6X@events.g7dr6cw.mongodb.net/?retryWrites=true&w=majority&appName=EVENTS",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("✅ MongoDB Connected"))
 .catch(err => console.error(err));

// ===== Models =====
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String // 'owner', 'admin'
});

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadline: Date,
  programs: [
    {
      name: String,
      type: { type: String, enum: ['individual', 'group'] }
    }
  ]
});

const registrationSchema = new mongoose.Schema({
  eventId: mongoose.Schema.Types.ObjectId,
  programName: String,
  participantName: String,
  groupMembers: [String],
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);

// ===== Pre-seed Owner Account =====
async function seedOwner() {
  const ownerExists = await User.findOne({ role: 'owner' });
  if (!ownerExists) {
    await User.create({
      username: '808690',
      password: 'OwnerOfW56',
      role: 'owner'
    });
    console.log("👑 Owner account created");
  }
}
seedOwner();

// ===== Routes =====

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ role: user.role, username: user.username });
});

// Create Event
app.post('/api/events', async (req, res) => {
  const { name, description, deadline, programs } = req.body;
  const event = await Event.create({ name, description, deadline, programs });
  res.json(event);
});

// Get Events
app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Register for a program
app.post('/api/register', async (req, res) => {
  const { eventId, programName, participantName, groupMembers } = req.body;
  const event = await Event.findById(eventId);
  
  if (!event) return res.status(404).json({ message: 'Event not found' });
  
  // Deadline check
  if (new Date() > new Date(event.deadline)) {
    return res.status(400).json({ message: 'Registration is closed' });
  }

  const reg = await Registration.create({ eventId, programName, participantName, groupMembers });
  res.json({ message: 'Registered successfully', registration: reg });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
