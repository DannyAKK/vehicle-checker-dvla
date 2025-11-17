# UK Vehicle Checker – DVLA API Integration

A modern vehicle lookup tool that retrieves real DVLA data including MOT status, tax status, engine size, vehicle age, and more.

Built with HTML, CSS, JavaScript and serverless backend functions.

## Features
- Live DVLA API integration  
- Validates UK registration formats  
- Neon-styled modern UI  
- Mobile friendly  
- Secure serverless backend  
- Detailed vehicle data in card layout  

## Technologies
Frontend: HTML, CSS, JavaScript  
Backend: Serverless Functions (Netlify / Vercel), Node.js  
API: DVLA Vehicle Enquiry API  

## Environment Variables
Create a `.env` file:

```
DVLA_API_KEY=your_api_key_here
```

## Project Structure
```
vehicle-checker-dvla/
│── index.html
│── package.json
│── .gitignore
│── .env.example
│
├── api/
│   └── check-vehicle.js
│
└── netlify-functions/
    └── check-vehicle.js
```
