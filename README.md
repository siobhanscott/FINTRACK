# FINTRACK

A modern, secure, and intelligent banking tracker application built with React, Tailwind CSS, and powerful data parsing tools.

## Vercel Link: https://fintrack-nine-iota.vercel.app/


## Features

- 📊 **Smart Dashboard**: Real-time overview of your financial health  
- 📂 **Automated Parsing**: Extracts transaction data from PDF and CSV bank statements  
- 💰 **Budget Tracking**: Set and monitor monthly budgets with visual progress indicators  
- 📈 **Monthly Trends**: Visualize spending patterns over time  
- 🏷️ **Category Breakdown**: Automatic categorization of expenses  
- 🔍 **Search & Filter**: Easily find specific transactions  
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile  

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion  
- **UI Components**: Shadcn/UI, Lucide React  
- **Data Visualization**: Recharts  
- **State Management**: TanStack Query  
- **Backend/API**: Mock API for local dev based off of Base44 Platform


## Getting Started

### Prerequisites

- Node.js (v18 or higher)  
- npm or yarn  

### Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/banking-tracker.git
   cd banking-tracker

2. Install dependancies
   ```bash
   npm install

3. Install required UI Components
   ```bash
   npm install @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-label class-variance-authority clsx tailwind-merge lucide-react framer-motion date-fns recharts

4. Start the development server:
   ```bash
   npm start


### Project Structure
```bash
src/
├── components/         # Reusable UI components
│   ├── ui/             # Shadcn/UI primitives
│   ├── FileUploader    # File upload and transaction data extraction
│   └── ...             # Other feature components
├── pages/              # Application pages
├── api/                # API client and mocks
└── lib/                # Utilities
```
 ### Visual Overview: 
<img width="1628" height="931" alt="Screenshot 2026-01-13 050538" src="https://github.com/user-attachments/assets/a201e5b7-6a2c-4f1f-a343-f2607428ee15" />
<img width="1794" height="917" alt="Screenshot 2026-01-13 050647" src="https://github.com/user-attachments/assets/de4e3a06-04df-4d5a-ac4b-7eb66f92be73" />
<img width="1720" height="867" alt="Screenshot 2026-01-13 050720" src="https://github.com/user-attachments/assets/32979177-59b2-466c-99bc-31167650a141" />


