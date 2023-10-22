/// <reference types="astro/client" />

interface Environment {
  AI: unknown
}

type Runtime = import('@astrojs/cloudflare').AdvancedRuntime<Environment>

declare namespace App {
  interface Locals extends Runtime {
  }
}
