# Dynamic Needs Analysis

This is a web application that allows users to analyze their clients' dynamic needs. It provides a user-friendly interface for managing clients, assets, and businesses.

The application is built using Next.js, Tailwind CSS, and PostgreSQL.

It uses the Kinde API to authenticate users and retrieve their client data.

Interacting with the PostgreSQL database on Neon is done using Drizzle ORM.

The application is deployed on Vercel and is available at [dynamic-needs-analysis.vercel.app](https://dynamic-needs-analysis.vercel.app/).

## Prerequisites

- Install [Bun](https://bun.sh/docs/installation)

## Local Development Setup

Clone the repository.

```bash
git clone https://github.com/kinde-oss/dynamic-needs-analysis.git
```

Move into the project directory.

```bash
cd dynamic-needs-analysis
```

Install the dependencies.

```bash
bun install
```

Create a `.env.local` file in the root directory of the project.

```bash
touch .env.local
```

Copy the contents of the `.env.example` file into the `.env.local` file.

```bash
cp .env.example .env.local
```

Open the `.env.local` file in your code editor.

```bash
code .env.local
```

Set the `KINDE_CLIENT_ID` and `KINDE_CLIENT_SECRET` environment variables.

> [!NOTE]  
> You can find your `KINDE_CLIENT_ID` and `KINDE_CLIENT_SECRET` on the [Kinde Platform](https://platform.kinde.com/).

### Database Setup

Create a new PostgreSQL database on [Neon](https://neon.tech/).

Set the `DATABASE_URL` environment variable.

```bash
export DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

### Stripe Local Development

Since were using webhooks to create database entries. Use the Stripe CLI to test your webhook locally. [Download the CLI](https://docs.stripe.com/stripe-cli) and log in with your Stripe account.

```
stripe login
```

Next we just need to set up event forwarding with the CLI to send all Stripe events in a sandbox to your local webhook endpoint.

```
stripe listen --forward-to localhost:3000/api/webhook
```

### Running the Local Development Server

Start up the local development server.

> [!NOTE]  
> (Make sure you have all the correct .env variables set in your .env.local file)

```bash
bun dev
```
