/// <reference types="astro/client" />

interface Env {
  DB?: D1Database
  MEDIA_BUCKET?: R2Bucket
  CACHE?: KVNamespace
}
