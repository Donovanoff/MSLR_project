# Shangri-La Referendum (MSLR) 🗳️

![Project Banner](https://via.placeholder.com/1200x400.png?text=Shangri-La+Referendum+System)

> A modern, secure, and intuitive web application for managing and participating in national referendums.

## 🔗 Live Demo (Coming Soon)
- **Frontend App**: [Insert GitHub Pages Link Here]
- **Backend API**: [Insert Render Link Here]

## 📖 About the Project

The Shangri-La Referendum (MSLR) platform is a full-stack web application designed to digitize the voting process. It provides a secure environment for residents to register, verify their identity via SCC (Secret Citizen Code), and cast their votes on active referendums. 

This project was built to demonstrate full-stack development skills, including secure authentication, role-based access control, responsive UI design, and RESTful API architecture.

## 🛠️ Technology Stack

**Frontend:**
- React (v19)
- TypeScript
- React Router DOM
- QR Code Scanner (`@yudiel/react-qr-scanner`)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Cloud Atlas)
- JWT (JSON Web Tokens) for secure authentication
- bcryptjs for password hashing

## ✨ Key Features

### For Voters (Residents)
- **Secure Registration & Login**: Residents can create an account using their personal details and a unique, single-use SCC code.
- **QR Code Scanning**: Seamlessly scan SCC codes using the device camera for fast registration.
- **Active Voting**: View currently open referendums and securely cast a vote (one vote per referendum per user).
- **Responsive Dashboard**: A mobile-friendly interface to track voting status.

### For Election Commission (Administrators)
- **Admin Dashboard**: Dedicated login for election officials.
- **Referendum Management**: Create, edit, and delete draft referendums with custom options.
- **Voting Lifecycle**: Manually open or close referendums.
- **Automatic Closure**: System automatically closes a referendum if a single option secures a majority (>50%) of all registered voters.

### Open Data API
A public REST API is available for developers and journalists to retrieve referendum data transparently.
- `GET /mslr/referendums` - Fetch all referendums.
- `GET /mslr/referendums?status=open` - Filter by status.
- `GET /mslr/referendum/:id` - Fetch details of a specific referendum.

## 📸 Screenshots

*(Add screenshots of your application here once deployed)*
- **Voter Dashboard**:
- **Admin Panel**:
- **QR Scanner**:

## 🚀 How to Interact with the App

Once deployed, you can interact with the live application using the following test credentials:

**Admin Access:**
- **Email**: `ec@referendum.gov.sr`
- **Password**: `Shangrilavote&2025@`

*(Note: To test Voter Registration, you will need an unused SCC code. You can find sample SCC codes in the repository under `server/models/SCC.js` or via the database.)*

---
*Developed by Rostyslav Sobchyshyn*
