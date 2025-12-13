/**
 * Gitee AI Provider Implementation
 */

import type { ImageProvider, ProviderGenerateRequest, ProviderGenerateResult } from './types'

const GITEE_API_URL = 'https://ai.gitee.com/v1/images/generations'

interface GiteeImageResponse {
  data: Array<{
    url?: string
    b64_json?: string
  }>
}

export class GiteeProvider implements ImageProvider {
  readonly id = 'gitee'
  readonly name = 'Gitee AI'

  async generate(request: ProviderGenerateRequest): Promise<ProviderGenerateResult> {
    if (!request.authToken) {
      throw new Error('API Key is required for Gitee AI')
    }

    const seed = request.seed ?? Math.floor(Math.random() * 2147483647)

    const requestBody: Record<string, unknown> = {
      prompt: request.prompt,
      model: request.model || 'z-image-turbo',
      width: request.width,
      height: request.height,
      seed,
      num_inference_steps: request.steps ?? 9,
      response_format: 'url',
    }

    if (request.negativePrompt) {
      requestBody.negative_prompt = request.negativePrompt
    }

    if (request.guidanceScale !== undefined) {
      requestBody.guidance_scale = request.guidanceScale
    }

    const response = await fetch(GITEE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.authToken.trim()}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      const errMsg = (errData as { message?: string }).message || `Gitee AI API Error: ${response.status}`
      throw new Error(errMsg)
    }

    const data = (await response.json()) as GiteeImageResponse

    if (!data.data?.[0]?.url) {
      throw new Error('No image returned from Gitee AI')
    }

    return {
      url: data.data[0].url,
      seed,
    }
  }
}

export const giteeProvider = new GiteeProvider()
