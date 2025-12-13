/**
 * ModelScope Provider Implementation
 */

import type { ImageProvider, ProviderGenerateRequest, ProviderGenerateResult } from './types'

interface ModelScopeResponse {
  images?: Array<{ url?: string }>
}

export class ModelScopeProvider implements ImageProvider {
  readonly id = 'modelscope'
  readonly name = 'ModelScope'

  private readonly baseUrl = 'https://api-inference.modelscope.cn/v1'

  async generate(request: ProviderGenerateRequest): Promise<ProviderGenerateResult> {
    if (!request.authToken) {
      throw new Error('API Token is required for ModelScope')
    }

    const token = request.authToken.trim()

    // Debug: log token info (uncomment for debugging)
    // console.log(`[ModelScope] Token length: ${token.length}`)
    if (token.length < 8) {
      throw new Error(`Invalid token: too short (${token.length} chars)`)
    }
    // console.log(`[ModelScope] Token format: ${token.slice(0, 4)}...${token.slice(-4)}`)

    const sizeString = `${request.width}x${request.height}`
    const body: Record<string, unknown> = {
      prompt: request.prompt,
      model: request.model || 'Tongyi-MAI/Z-Image-Turbo',
      size: sizeString,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      steps: request.steps ?? 9,
    }

    if (request.guidanceScale !== undefined) {
      body.guidance = request.guidanceScale
    }

    // Debug: log request (uncomment for debugging)
    // console.log('[ModelScope] Request:', JSON.stringify({ ...body, prompt: `${body.prompt?.toString().slice(0, 50)}...` }))

    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errData = (await response.json().catch(() => ({}))) as {
        message?: string
        errors?: { message?: string }
      }
      const errMsg = errData.errors?.message || errData.message || `HTTP ${response.status}`
      // console.error('[ModelScope] Error response:', errData)
      throw new Error(errMsg)
    }

    const data = (await response.json()) as ModelScopeResponse
    const imageUrl = data.images?.[0]?.url

    if (!imageUrl) {
      // console.error('[ModelScope] Invalid response:', data)
      throw new Error('No image returned from ModelScope')
    }

    // console.log(`[ModelScope] Success! Image URL: ${imageUrl.slice(0, 50)}...`)
    return { url: imageUrl, seed: body.seed as number }
  }
}

export const modelscopeProvider = new ModelScopeProvider()
