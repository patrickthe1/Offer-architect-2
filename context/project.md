# Project Brief: Offer Architect Backend

## 1. Project Objective

The goal is to create a simple, robust backend service for a web application named "Offer Architect." The application helps entrepreneurs craft irresistible business offers based on Alex Hormozi's Value Equation framework. The backend will expose a series of API endpoints that take user input for each part of the equation, use the Gemini AI to generate creative suggestions, and finally assemble the selected components into a compelling final offer.

## 2. Core Logic: The Value Equation

The entire application is based on this formula:

```
Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort & Sacrifice)
```

The backend will have a dedicated endpoint for each key variable, plus one to assemble the final result.

## 3. Technology Stack

- **Language/Framework:** Node.js with Express.js  
- **AI Model:** Google's Gemini API (via generativelanguage SDK)  
- **Environment Variables:** The Gemini API Key must be managed via an environment variable (`GEMINI_API_KEY`).

## 4. Required API Endpoints & Data Structures

You are to build the following four API endpoints. Each should be meticulously documented and testable.

---

### Endpoint 1: Generate Dream Outcomes

This endpoint takes a user's basic description of their product's result and returns powerful, emotionally resonant alternatives.

- **Route:** `POST /api/dream-outcome`
- **Request Body (JSON):**
    ```json
    {
        "userInput": "My SaaS helps businesses manage their finances."
    }
    ```
- **AI Task:** The AI prompt should ask the model to act as an expert marketer and rephrase the userInput into 3 more powerful "Dream Outcome" statements.
- **Response Body (JSON):**
    ```json
    {
        "suggestions": [
            "Achieve complete financial clarity and control over your business.",
            "Transform your financial stress into a predictable system for growth.",
            "Unlock the financial insights that let you make confident, profitable decisions."
        ]
    }
    ```

---

### Endpoint 2: Generate Guarantees (Likelihood of Achievement)

This endpoint takes a user's description of their customer's fears or doubts and returns strong guarantee ideas to reverse that risk.

- **Route:** `POST /api/guarantees`
- **Request Body (JSON):**
    ```json
    {
        "userInput": "Users are afraid it will be too complicated to learn and that it won't actually save them time."
    }
    ```
- **AI Task:** The AI prompt should ask the model to generate 3 bold, risk-reversal guarantees based on the user's input.
- **Response Body (JSON):**
    ```json
    {
        "suggestions": [
            "The '10-Hour Payback' Guarantee: If you don't save at least 10 hours in your first month, you get a full refund and we'll pay for your first month of QuickBooks.",
            "The 'Onboarded in 30 Minutes' Guarantee: We personally guarantee you will be fully set up and running within 30 minutes of your onboarding call, or your first three months are free.",
            "The 'Confidence Guarantee': Use the software for 90 days. If you don't feel more confident in your financial decisions, we'll refund you 110% of your purchase price."
        ]
    }
    ```

---

### Endpoint 3: Generate Bonuses (Effort & Sacrifice)

This endpoint takes a list of annoying steps or problems the customer faces and generates valuable bonuses that solve those specific problems.

- **Route:** `POST /api/bonuses`
- **Request Body (JSON):**
    ```json
    {
        "userInput": "Migrating all my data from spreadsheets is a huge pain. I also don't know which reports to look at."
    }
    ```
- **AI Task:** The AI prompt should ask the model to generate 3 high-value bonuses that directly solve the pain points in the userInput.
- **Response Body (JSON):**
    ```json
    {
        "suggestions": [
            "Bonus #1: Free 'White Glove' Spreadsheet Migration Service.",
            "Bonus #2: The 'CEO's Weekend-Read' Report Pack: 5 custom-built report templates.",
            "Bonus #3: A 1-on-1 'Financial Strategy' call to set up your dashboards."
        ]
    }
    ```

---

### Endpoint 4: Assemble The Final Offer

This endpoint is **NOT** AI-powered. It takes the user's final selections from the previous steps and uses a simple template to structure them into a final offer. This ensures reliability.

- **Route:** `POST /api/assemble-offer`
- **Request Body (JSON):**
    ```json
    {
        "dreamOutcome": "Achieve complete financial clarity and control over your business.",
        "guarantee": "The '10-Hour Payback' Guarantee.",
        "bonuses": [
            "Bonus #1: Free 'White Glove' Spreadsheet Migration Service.",
            "Bonus #2: The 'CEO's Weekend-Read' Report Pack."
        ],
        "price": "2 payments of $497"
    }
    ```
- **Response Body (JSON):**
    ```json
    {
        "finalOfferText": "Here's what you're going to get: You will achieve complete financial clarity and control over your business. This is backed by our '10-Hour Payback' Guarantee. You will also receive these exclusive bonuses: Bonus #1: Free 'White Glove' Spreadsheet Migration Service, and Bonus #2: The 'CEO's Weekend-Read' Report Pack. The investment for this is 2 payments of $497."
    }
    ```
