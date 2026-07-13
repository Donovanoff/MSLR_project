# Shangri-La Referendum (MSLR) 🗳️

> A modern, secure, and intuitive web application for managing and participating in national referendums.

## 🔗 Live Demo
- **Frontend App**: [https://donovanoff.github.io/MSLR_project/](https://donovanoff.github.io/MSLR_project/)
- **Backend API**: [https://mslr-project.onrender.com](https://mslr-project.onrender.com)

## 📖 About the Project

The Shangri-La Referendum (MSLR) platform is a full-stack web application designed to digitise the voting process. It provides a secure environment for residents to register, verify their identity via SCC (Secret Citizen Code), and cast their votes on active referendums. 

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

## 🚀 How to Interact with the App

> **⚠️ Important Note on Performance:** The backend API is hosted on a free Render instance. If it has been inactive for 15 minutes, it will spin down. **Your very first login or registration attempt may take 10-50 seconds** while the server wakes up. Please be patient! Once awake, the application will be lightning fast.

You can interact with the live application using the following test credentials:

### 👑 Admin Access (Election Commission)
Log in to the Admin Dashboard to manage referendums.
- **Email**: `ec@referendum.gov.sr`
- **Password**: `Shangrilavote&2025@`

### 👤 Test Voter Access
Log in to the Voter Dashboard to view active referendums and cast a vote.
- **Email**: `testvoter@example.com`
- **Password**: `password123`

### 🔑 Test Registration (SCC Codes)
If you want to test the full registration flow, you will need an unused SCC code. You can use any of the codes below:

<details>
<summary><b>Click to reveal unused SCC Codes</b></summary>

- `JOV50TOSYR`
- `SDUBJ5IOYB`
- `YFUVLYBQZR`
- `IGBQET8OOY`
- `R2ZHBUYO2V`
- `Z9HOC1LF4X`
- `9IJKHGHJK4`
- `N5J53QK9FO`
- `ZDN06T01V9`
- `4XRDN9O4AW`
- `921664ML8D`
- `A546AKU16A`
- `V0GB2G690L`
- `12EOU5RGVX`
- `0IXYCAH8UW`
- `GKJ3K1YBGE`
- `46HJV9KH1F`
- `S6K3AV3IVR`
- `IKKSZYJTSH`

</details>

---

 *(Note: SCC codes are single-use. If a code doesn't work, it means another tester has already used it. Please try the next one.)*

---
*Developed by Rostyslav Sobchyshyn*
