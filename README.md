
**📁 Smart File Tracking System (SFTS)** 
A web-based automated file management system for IIUI with multi-office workflows, real-time tracking, and AI-powered features.  


## **🚀 Key Features**  
✔ **Multi-Department Routing** – Files move seamlessly between Program Office, Finance, Exam, and Provost offices.  
✔ **Real-Time Notifications** – Email/SMS alerts for file status (e.g., "Your file is forwarded to Finance Office").  
✔ **Deadline Reminders** – Auto-alerts for pending actions to prevent delays.  
✔ **Role-Based Access** – Secure permissions for Admins, Program Officers, and Users.  
✔ **Audit Trail** – Full history of file movements with timestamps.  
✔ **AI Integration** – Smart metadata suggestions and automated replies.  

---

## **🛠 Tech Stack**  
- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (or PostgreSQL)  
- **Authentication:** JWT  
- **Notifications:** Nodemailer (Email), Twilio (SMS) *(optional)*  
- **Version Control:** Git + GitHub  

---

## **📥 Installation**  
1. **Clone the repo:**  
   ```bash
   git clone https://github.com/your-username/SFTS-IIUI.git
   cd SFTS-IIUI
   ```
2. **Install dependencies:**  
   ```bash
   npm install  # for both backend and frontend
   ```
3. **Set up environment variables:**  
   Create `.env` in the backend folder with:  
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email_for_notifications
   EMAIL_PASS=your_email_password
   ```
4. **Run the app:**  
   ```bash
   npm run dev  # starts both frontend and backend
   ```

---

## **📖 Usage**  
1. **User:**  
   - Submit files, set due dates, and track real-time status.  
   - Receive notifications (e.g., "Finance Office reviewed your file").  
2. **Program Officer:**  
   - Forward files to Finance/Exam/Provost offices.  
   - Get reminders for pending actions.  
3. **Admin:**  
   - Manage roles, departments, and system settings.  


## **📂 Project Structure**  
```markdown
SFTS-IIUI/  
├── client/            # Frontend (React)  
│   ├── public/  
│   └── src/  
│       ├── components/  
│       ├── pages/      # User, PO, Admin dashboards  
│       └── App.js  
├── server/            # Backend (Node.js)  
│   ├── models/        # MongoDB schemas  
│   ├── routes/        # API endpoints  
│   └── app.js  
├── .gitignore  
└── README.md  
```

---

## **🧪 Testing**  
- **Test Cases:**  
  - User registration/login (JWT auth).  
  - File routing between offices.  
  - Deadline reminder triggers.  
- **Run tests:**  
  ```bash
  npm test
  ```

---

## **⚠️ Limitations**  
- Requires stable internet connectivity.  
- Handwritten documents need manual entry.  
- Scalability needs testing for 10,000+ files.  

---

## **🔮 Future Work**  
- **Mobile App** (React Native).  
- **Blockchain** for immutable audit logs.  
- **OCR Integration** to scan handwritten docs.  

---

## **🤝 Contributing**  
Pull requests welcome! Follow these steps:  
1. Fork the repo.  
2. Create a branch (`git checkout -b feature/your-feature`).  
3. Commit changes (`git commit -m "Add your feature"`).  
4. Push to the branch (`git push origin feature/your-feature`).  
5. Open a PR.  

---

## **📜 License**  
MIT © [Saad Ishaq]  

---

## **📞 Contact**  
- **Saad Ishaq** – [chsaadishaq857@gmail.com]  
- **Project Link:** [https://github.com/saadishaq2/SFTS-IIUI](https://github.com/saadishaq2/SFTS-IIUI)  


### **🎉 Thank You!**  
*Star ⭐ the repo if you find it useful!*  
