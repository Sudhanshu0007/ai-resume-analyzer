# AI Resume Analyzer

A modern web application that analyzes resumes using AI to provide ATS (Applicant Tracking System) compatibility scores, actionable insights, and detailed feedback for job seekers.

## 🎯 Features

- **Resume Upload**: Drag-and-drop interface supporting PDF files (up to 20MB)
- **ATS Score Analysis**: Get an instant ATS compatibility score (0-100)
- **AI-Powered Insights**: Receive actionable suggestions to improve your resume
- **Visual Feedback**: Score badges and gauges for easy visualization
- **File Management**: Upload, view, and manage multiple resumes
- **Authentication**: Secure user authentication system
- **Cloud Integration**: Built-in Puter cloud OS integration

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router 7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **PDF Processing**: PDF.js
- **File Upload**: React Dropzone
- **Runtime**: Node.js with React Router SSR

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or specified port)

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Type Checking

```bash
npm run typecheck
```

## 📁 Project Structure

```
├── app/
│   ├── components/          # React components
│   │   ├── ATS.tsx         # ATS score display
│   │   ├── FileUploader.tsx # File upload component
│   │   ├── ScoreBadge.tsx   # Score badge display
│   │   ├── ScoreGauge.tsx   # Score gauge visualization
│   │   └── ...             # Other UI components
│   ├── routes/             # Page routes
│   │   ├── home.tsx        # Home page
│   │   ├── auth.tsx        # Authentication
│   │   ├── upload.tsx      # Resume upload page
│   │   ├── resume.tsx      # Resume details page
│   │   └── wipe.tsx        # Data cleanup page
│   ├── lib/                # Utility libraries
│   │   ├── pdf2img.ts      # PDF to image conversion
│   │   ├── puter.ts        # Puter cloud integration
│   │   └── utils.ts        # Helper utilities
│   └── root.tsx            # Root component
├── constants/              # Application constants
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── Dockerfile              # Container configuration
└── package.json           # Dependencies and scripts
```

## 🔑 Key Routes

- `/` - Home page
- `/auth` - Authentication page
- `/upload` - Resume upload interface
- `/resume/:id` - Detailed resume analysis view
- `/wipe` - Data management/cleanup

## 🎨 Components

### Core Components

- **FileUploader**: Handles resume file uploads with drag-and-drop support
- **ATS**: Displays ATS compatibility score and suggestions
- **ScoreGauge**: Visual score gauge component
- **ScoreBadge**: Compact score display badge
- **Accordion**: Expandable section for detailed information
- **ResumeCard**: Card component for resume display
- **Summary**: Resume summary component
- **Navbar**: Navigation bar with user menu

## 📦 Dependencies

### Main Dependencies

- `react` & `react-dom` - UI framework
- `react-router` - Client-side routing
- `@react-router/node` & `@react-router/serve` - Server-side routing and serving
- `pdfjs-dist` - PDF processing
- `react-dropzone` - File upload handling
- `tailwindcss` - Utility-first CSS framework
- `zustand` - Lightweight state management
- `clsx` - Conditional CSS class names

### Dev Dependencies

- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `vite` - Build tool
- `@tailwindcss/vite` - Tailwind CSS Vite integration


## 📝 Configuration Files

- `vite.config.ts` - Vite build configuration
- `react-router.config.ts` - React Router configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration (if exists)

## 🔄 Workflow

1. User uploads a resume (PDF)
2. Resume is processed and converted to images
3. AI analyzes the resume for ATS compatibility
4. Score (0-100) is calculated based on formatting, keywords, structure
5. Actionable suggestions are provided
6. Results are displayed with visual feedback
7. User can view, edit, or delete their resumes

## 🤝 State Management

The app uses Zustand for state management, enabling:
- Global state for user authentication
- Resume data persistence
- UI state management

## 📄 License

This project is private and not for public use.

---

**Note**: Make sure to configure environment variables for API endpoints and cloud services before deployment.