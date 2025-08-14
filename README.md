# College Events Management Website

A full-featured, responsive events management platform with Owner/Admin roles, program registration, and MongoDB backend.

## Features
- Owner & Admin login with role-based access
- Create, edit, delete events and programs
- Black-Green-White premium theme (inspired by makemypass.com)
- Mobile and desktop responsive UI
- Pre-seeded DB with sample data
- MongoDB backend (Atlas connection ready)
- No email notifications (can be enabled later)

## Environment Variables
Set these in Netlify or your local `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@events.g7dr6cw.mongodb.net/?retryWrites=true&w=majority&appName=EVENTS
MONGODB_DB=EVENTS
JWT_SECRET=your_random_secret
```

## Deployment
1. Push to a GitHub repo
2. Connect repo to Netlify
3. Set environment variables
4. Deploy

---
*Built for your college tech fest & events management needs.*
