import * as Koa from "koa"
import * as KoaStatic from "koa-static"

const app: Koa = new Koa()
const port = process.env.PORT ?? 3000

app.use(KoaStatic(__dirname+"/../static/"))

app.listen(port, (): void => {
    console.log(`Server is running on http://localhost:${port} port`)
})