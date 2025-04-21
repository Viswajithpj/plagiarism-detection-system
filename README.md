# 🧠 Plagiarism Detection System

A web-based platform for detecting plagiarism in academic submissions using intelligent NLP techniques. This system helps educators upload assignments, analyze similarities, and generate insightful plagiarism reports using TF-IDF, K-gram, and sentence-level comparison algorithms.

![Interface](https://github.com/user-attachments/assets/fd63c212-8611-4fe1-908e-068079f63944)

---

## 🚀 Features

- 📁 Upload files (PDF, DOCX, TXT)
- 🔍 Multi-algorithm plagiarism detection
- 🧾 Detailed similarity reports
- 👨‍🏫 Role-based user access (Teacher & Student)
- 🔐 JWT Authentication with Djoser
- 📚 Course and assignment management
- 💻 Modern, responsive frontend using Next.js & Tailwind CSS

---

## 🏗 Tech Stack

| Layer        | Technology                                |
|--------------|--------------------------------------------|
| Frontend     | Next.js 14, React 18, Tailwind CSS, TypeScript |
| Backend      | Django 4.2.7, Django REST Framework, Python 3.8+ |
| Authentication | JWT, Djoser |
| NLP & ML     | scikit-learn, NLTK |
| Database     | SQLite (dev), PostgreSQL (prod) |
| File Parsing | PyPDF2, python-docx |
| UI Components| shadcn/ui, Lucide React Icons |

---

## ⚙ Setup Instructions

### ✅ Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

---

### 🔧 Backend Setup

bash
git clone https://github.com/yourusername/plagiarism-detector.git
cd plagiarism-detector

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python setup.py

# Setup database
python manage.py makemigrations accounts detector
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver

🌐 Frontend Setup

cd frontend

# Install dependencies
npm install  # or yarn install

# Create env file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev  # or yarn dev

# Open in browser
http://localhost:3000
![Server Running](https://github.com/user-attachments/assets/b2297c08-0170-4e6f-b7d0-cd3c5c42a463)

### 🔁 *Project Workflow*

- 🔐 *User Authentication*  
  - User registers/logs in via the frontend  
  - Backend issues JWT tokens  
  - Tokens are stored in localStorage and used in API headers  

- 📤 *Assignment Upload*  
  - User uploads a document (PDF, DOCX, TXT) with assignment details
    
     ![Document Selection](https://github.com/user-attachments/assets/79aa1d07-5679-4beb-949d-9d0d568fa920)

  - Backend extracts text content and stores it in the database  

- 🧪 *Plagiarism Detection*  
  - User selects an assignment to check
    
  ![checking_plagiarsim](https://github.com/user-attachments/assets/779477ef-3e50-47d0-a0cb-1058b1bcd878)

  - Text is preprocessed (lowercase, cleaned)  
  - Detection algorithms are applied:
    - TF-IDF + Cosine Similarity
    - K-gram Fingerprinting
    - Sentence-Level Matching  
  - Results (score + matches) are saved and returned
    
     ![Results Comparison](https://github.com/user-attachments/assets/0f43d153-390f-465d-990b-7612909fd619)


- 📊 *Results Visualization*  
  - Frontend fetches results via API  
  - Plagiarism reports show:
    - Matched text snippets  
    - Source types (Assignment, Internet, DB)  
    - Similarity scores
      ![final Result](https://github.com/user-attachments/assets/0958ad00-80df-471e-90ee-ae64edf08b3b)

- 🛠 *Tech & Communication*  
  - Frontend ↔ Backend via RESTful API  
  - Django handles logic; Next.js renders UI  

---
