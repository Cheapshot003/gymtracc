import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import Layout from './components/Layout'
import { logger } from "@bogeychan/elysia-logger";
import { staticPlugin } from '@elysiajs/static'
import { auth, deriveUser } from "./auth/authModule";
import { appModule } from "./auth/dashboardModule";

const app = new Elysia()
  .use(html())
  .use(staticPlugin())

  .use(logger({
    level: "trace"
    }))
  .derive(deriveUser)
  .use(auth)
  .use(appModule)
  .get("/", async ({ html, user }: any) => {
  return  html(
      <Layout title="Gymtracc - Home" user={user}>
      </Layout>
    )
  }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
