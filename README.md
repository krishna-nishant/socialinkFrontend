# SociaLink Frontend

This directory contains the frontend application for SociaLink, a real-time chat application built with React.

## Overview

The frontend provides a modern, responsive user interface for the SociaLink chat platform. It handles user authentication, real-time messaging, message history, user profile management, and file uploads.

## Features

- Real-time messaging with Socket.IO integration
- User authentication with HTTP-only cookie support
- Responsive UI built with Tailwind CSS
- Dark/Light mode toggle
- Image upload and sharing
- Online user status indicators
- Message history with pagination
- Profile management
- Cross-domain communication support

## Tech Stack

- **React**: UI library
- **Zustand**: State management
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP requests
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling
- **React Hot Toast**: Notifications
- **Cloudinary**: Image hosting integration

## Project Structure

- `/src/components`: UI components
- `/src/pages`: Page components
- `/src/lib`: Utility functions and configurations
- `/src/store`: Global state management with Zustand
- `/src/hooks`: Custom React hooks
- `/src/assets`: Static assets like images and icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

The frontend is currently deployed on Vercel at [https://socialink-chat.vercel.app/](https://socialink-chat.vercel.app/)

## Note

This frontend application requires the SociaLink backend server to be running for full functionality.
