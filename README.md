# InternMatch AI - Next Gen

This is a **Next.js + Express + MongoDB** application.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Node.js + Express (Custom Server)
- **Database**: MongoDB (via Mongoose)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Check `.env` and ensure `MONGODB_URI` is correct.
    ```env
    MONGODB_URI=mongodb://localhost:27017/internmatch_ai
    ```
3.  **Run Development Server**:
    This uses `nodemon` to run `server.js` which handles both Express API and Next.js rendering.
    ```bash
    npm run dev
    ```
4.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

- `server.js`: Main entry point (Express Server).
- `app/`: Next.js App Router files.
- `models/`: Mongoose models.
- `lib/`: Utility functions.
# AI-Smart-Intern-Allocator
