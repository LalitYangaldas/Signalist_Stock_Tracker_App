<h1>Introduction</h1>

<p>Signalist is an AI-powered modern stock market app built with Next.js, Shadcn, Better Auth, and Inngest! Track real-time prices, explore company insights, and manage watchlists. The admin dashboard allows managing stocks, publishing news, and monitoring user activity, AI-driven daily digests, earnings notifications, and sentiment analysis—perfect for devs who want a dynamic, real-time financial platform.</p>

<h2>Tech Stack</h2>

[Better-Auth](https://www.better-auth.com) is a framework-agnostic authentication and authorization library for TypeScript. It provides built-in support for email/password login, social sign-on (Google, GitHub, Apple, and more), and multi-factor authentication, simplifying user authentication and account management.

[Finnhub](https://finnhub.io/) is a real-time financial data API that provides stock, forex, and cryptocurrency market data. It offers developers access to fundamental data, economic indicators, and news, making it useful for building trading apps, dashboards, and financial analysis tools.

[Inngest](https://jsm.dev/stocks-inngest) is a platform for event-driven workflows and background jobs. It allows developers to build reliable, scalable automated processes such as real-time alerts, notifications, and AI-powered workflows.

[MongoDB](https://www.mongodb.com/) is a flexible, high-performance NoSQL database. It stores data in JSON-like documents, supports dynamic schemas, and provides robust features for scalability, replication, and querying.

[Nodemailer](https://nodemailer.com/) is a Node.js library for sending emails easily. It supports various transport methods such as SMTP, OAuth2, and third-party services, making it a reliable tool for handling transactional emails, notifications, and contact forms in applications.

[Next.js](https://nextjs.org/docs) is a powerful React framework for building full-stack web applications. It provides server-side rendering, static site generation, and API routes, allowing developers to create optimized and scalable apps quickly.

[Shadcn](https://ui.shadcn.com/docs) is an open-source library of fully customizable, accessible React components. It helps teams rapidly build consistent, visually appealing UIs while allowing full control over design and layout.

[TailwindCSS](https://tailwindcss.com/) is a utility-first CSS framework that allows developers to build custom, responsive designs quickly without leaving their HTML. It provides pre-defined classes for layout, typography, colors, and more.

[TypeScript](https://www.typescriptlang.org/) is a statically typed superset of JavaScript that improves code quality, tooling, and error detection. It is ideal for building large-scale applications and enhances maintainability.

<h2>Features</h2>

<strong>Stock Dashboard: </strong>Track real-time stock prices with interactive line and candlestick charts, including historical data, and filter stocks by industry, performance, or market cap.

<strong>Powerful Search: </strong>Quickly find the best stocks with an intelligent search system that helps you navigate through Signalist.

<strong>Company Insights: </strong>Explore detailed financial data such as PE ratio, EPS, revenue, recent news, filings, analyst ratings, and sentiment scores for informed decision-making.

<strong> Real-Time Workflows: </strong>Powered by Inngest, automate event-driven processes like price updates, alert scheduling, automated reporting, and AI-driven insights.

<strong>Analytics & Insights: </strong>Gain insights into user behavior, stock trends, and engagement metrics, enabling smarter business and trading decisions.

<h2>Quick Start</h2>

Follow these steps to set up the project locally on your machine.

<strong>Prerequisites</strong>

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)


**Cloning the Repository**

```bash
git clone https://github.com/LalitYangaldas/Signalist_Stock_Tracker_App.git
cd signalist_stock-tracker-app
```


**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NODE_ENV='development'
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# FINNHUB
NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY=
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# MONGODB
MONGODB_URI=

# BETTER AUTH
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# GEMINI
GEMINI_API_KEY=

#NODEMAILER
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
```

Replace the placeholder values with your real credentials. You can get these by signing up at: [**MongoDB**](https://www.mongodb.com/products/platform/atlas-database), [**Gemini**](https://aistudio.google.com/prompts/new_chat?utm_source=chatgpt.com), [**Inngest**](https://jsm.dev/stocks-inggest), [**Finnhub**](https://finnhub.io).


**Running the Project**

```bash
npm run dev
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


<h3>Signalist Dashboard</h3><img width="1919" height="795" alt="image" src="https://github.com/user-attachments/assets/934803e8-2d06-46b0-a335-daf26e295832" />


<h3>News & Market Analytics</h3><img width="1919" height="649" alt="image" src="https://github.com/user-attachments/assets/a143c1c0-58d7-44f4-a006-06516331a2be" />

<h3>Search Funtion with Popular stocks</h3><img width="1919" height="591" alt="image" src="https://github.com/user-attachments/assets/367c74df-a598-4fa7-9de2-12497a370d72" />

<h3>Personalized Watchlist</h3><img width="1906" height="739" alt="image" src="https://github.com/user-attachments/assets/b9bbe715-3c48-4920-919a-d854f7ded490" />

<h3>Sign-in Page for Safety and your personal account</h3><img width="1914" height="911" alt="image" src="https://github.com/user-attachments/assets/3397309f-bd4f-4f01-9507-f7491346c936" />

<h3>Sign-up page for your custom market and analytics</h3><img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/e5910593-ec1a-4c46-95ad-f26c59fa1365" />
