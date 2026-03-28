import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'writer' } },
    depth: 3,
    limit: 1,
  })
  console.log(JSON.stringify(result, null, 2))
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
