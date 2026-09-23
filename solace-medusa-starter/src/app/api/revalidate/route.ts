import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret =
    req.headers.get('x-revalidate-secret') ||
    req.nextUrl.searchParams.get('secret')
  const expectedSecret =
    process.env.REVALIDATE_SECRET || process.env.JWT_SECRET || 'supersecret'

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { message: 'Invalid revalidation secret' },
      { status: 401 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const tag = body?.tag || 'products'

  revalidateTag(tag, 'max')
  console.log(`[revalidate] Purged Next.js cache tag: '${tag}'`)

  return NextResponse.json({ revalidated: true, tag, timestamp: Date.now() })
}
