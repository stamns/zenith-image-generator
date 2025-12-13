/**
 * Provider Interface Definition
 */

import type { GenerateRequest } from '@z-image/shared'

/** Provider generate request with auth token */
export interface ProviderGenerateRequest extends Omit<GenerateRequest, 'provider'> {
  authToken?: string
}

/** Provider generate result (internal) */
export interface ProviderGenerateResult {
  /** Image URL */
  url: string
  /** Random seed used */
  seed: number
}

/** Image provider interface */
export interface ImageProvider {
  /** Provider ID */
  readonly id: string
  /** Provider display name */
  readonly name: string
  /** Generate image */
  generate(request: ProviderGenerateRequest): Promise<ProviderGenerateResult>
}
