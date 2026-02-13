This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Biến môi trường

- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`: Gửi thông báo + webhook bot (nhận lì xì, `/reset`).
- **Lưu lịch sử lì xì trên Vercel:** Mặc định trên Vercel dữ liệu ghi vào `/tmp` không bền (mất khi cold start). Để lưu bền, thêm **Upstash Redis** (Vercel Marketplace → Upstash Redis), sau đó cấu hình:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`  
  Khi có hai biến này, app sẽ lưu/đọc danh sách lì xì từ Redis thay vì file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Lưu ý:** Để lịch sử nhận lì xì và lệnh `/reset` hoạt động ổn định trên Vercel, nên thêm storage **Upstash Redis** (Marketplace) và khai báo đủ biến môi trường như trên.
