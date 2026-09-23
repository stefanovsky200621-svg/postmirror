FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=12 \
  CMD node -e "const http=require('http');const port=process.env.PORT||3000;http.get({host:'127.0.0.1',port,path:'/'},r=>process.exit(r.statusCode>=200&&r.statusCode<400?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
