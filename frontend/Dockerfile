# -----------------------------

# Build Stage

# -----------------------------

FROM node:20-alpine AS builder

WORKDIR /app

# Accept build argument from CI/CD

ARG NEXT_PUBLIC_API_URL

# Make it available during build

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Install dependencies

COPY package*.json ./
RUN npm install

# Copy source code

COPY . .

# Build Next.js app

RUN npm run build

# -----------------------------

# Production Stage

# -----------------------------

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy built app

COPY --from=builder /app ./

# Install only production dependencies

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm","start"]