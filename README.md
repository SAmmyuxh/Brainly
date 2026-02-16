# Brainly (Second Brain)

Brainly is a powerful **Second Brain** application designed to help you capture, organize, and retrieve your digital life. Store interesting tweets, YouTube videos, articles, and documents in one centralized place.

Built with a focus on simplicity and intelligence, Brainly integrates **Google Gemini AI** to let you chat with your own stored content, making it not just a storage locker, but an active partner in your thinking process.

![Brainly Dashboard](https://placehold.co/1200x600/1e293b/ffffff?text=Brainly+Dashboard)

## 🚀 Features

-   **Unified Content Storage**: Save links, tweets (`react-tweet`), videos, and helper documents.
-   **Smart Organization**: Tag and categorize your content for easy retrieval.
-   **AI-Powered Chat**: Ask questions about your saved notes and links using Google Gemini AI.
-   **Shareable Brains**: Create public links to share your curated collections with the world.
-   **Full Text Search**: Instantly find what you're looking for with robust search capabilities.
-   **Modern UI**: A clean, responsive interface built with React, Tailwind CSS, and DaisyUI.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, DaisyUI, Radix UI
-   **State/Data**: TanStack Query
-   **Icons**: Lucide React

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JWT & BCrypt
-   **AI**: Google Generative AI (Gemini Flash)
-   **Validation**: Zod

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB (Local or Atlas URI)
-   Google Gemini API Key (Get one [here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/brainly.git
    cd brainly
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

#### Backend
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URL=mongodb+srv://<your_mongo_uri>
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

#### Frontend
By default, the frontend is configured to point to a production backend. For local development, check `frontend/src/config.ts`:

```typescript
// frontend/src/config.ts
export const BACKEND_URL = "http://localhost:5000" // Change this to your local backend URL
```

### Running the App

1.  **Start the Backend**
    ```bash
    cd backend
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend**
    ```bash
    cd frontend
    npm run dev
    ```
    The app will accept connections at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
