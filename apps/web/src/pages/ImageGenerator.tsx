import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const DEFAULT_PROMPT = "一张虚构的英语电影《回忆之味》（The Taste of Memory）的电影海报。场景设置在一个质朴的19世纪风格厨房里。画面中央，一位红棕色头发、留着小胡子的中年男子（演员阿瑟·彭哈利根饰）站在一张木桌后，他身穿白色衬衫、黑色马甲和米色围裙，正看着一位女士，手中拿着一大块生红肉，下方是一个木制切菜板。在他的右边，一位梳着高髻的黑发女子（演员埃莉诺·万斯饰）倚靠在桌子上，温柔地对他微笑。她穿着浅色衬衫和一条上白下蓝的长裙。桌上除了放有切碎的葱和卷心菜丝的切菜板外，还有一个白色陶瓷盘、新鲜香草，左侧一个木箱上放着一串深色葡萄。背景是一面粗糙的灰白色抹灰墙，墙上挂着一幅风景画。最右边的一个台面上放着一盏复古油灯。海报上有大量的文字信息。左上角是白色的无衬线字体\"ARTISAN FILMS PRESENTS\"，其下方是\"ELEANOR VANCE\"和\"ACADEMY AWARD® WINNER\"。右上角写着\"ARTHUR PENHALIGON\"和\"GOLDEN GLOBE® AWARD WINNER\"。顶部中央是圣丹斯电影节的桂冠标志，下方写着\"SUNDANCE FILM FESTIVAL GRAND JURY PRIZE 2024\"。主标题\"THE TASTE OF MEMORY\"以白色的大号衬线字体醒目地显示在下半部分。标题下方注明了\"A FILM BY Tongyi Interaction Lab\"。底部区域用白色小字列出了完整的演职员名单，包括\"SCREENPLAY BY ANNA REID\"、\"CULINARY DIRECTION BY JAMES CARTER\"以及Artisan Films、Riverstone Pictures和Heritage Media等众多出品公司标志。整体风格是写实主义，采用温暖柔和的灯光方案，营造出一种亲密的氛围。色调以棕色、米色和柔和的绿色等大地色系为主。两位演员的身体都在腰部被截断"
const DEFAULT_NEGATIVE_PROMPT = "低质量, 丑陋, 畸形, 模糊, 多余的肢体, 错误的文本"

const ASPECT_RATIOS: Record<string, [number, number]> = {
  "1:1 (1024×1024)": [1024, 1024],
  "1:1 (512×512)": [512, 512],
  "4:3 (1152×896)": [1152, 896],
  "3:4 (768×1024)": [768, 1024],
  "16:9 (1024×576)": [1024, 576],
  "9:16 (576×1024)": [576, 1024],
}

export default function ImageGenerator() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('z-image-api-key') || '')
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE_PROMPT)
  const [model, setModel] = useState('z-image-turbo')
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(9)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('z-image-api-key', apiKey)
  }, [apiKey])

  const handleAspectRatioChange = (ratio: string) => {
    const dims = ASPECT_RATIOS[ratio]
    if (dims) {
      setWidth(dims[0])
      setHeight(dims[1])
    }
  }

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('Please enter your API Key')
      return
    }

    setLoading(true)
    setImageUrl(null)

    try {
      const res = await fetch('http://localhost:8787/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          model,
          width,
          height,
          num_inference_steps: steps,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      if (data.url) {
        setImageUrl(data.url)
      } else if (data.b64_json) {
        setImageUrl(`data:image/png;base64,${data.b64_json}`)
      }

      toast.success('Image generated!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Z-Image Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Gitee AI API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="negativePrompt">Negative Prompt</Label>
            <Textarea
              id="negativePrompt"
              rows={2}
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div>
              <Label>Aspect Ratio</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                onChange={(e) => handleAspectRatioChange(e.target.value)}
                defaultValue="1:1 (1024×1024)"
              >
                {Object.keys(ASPECT_RATIOS).map((ratio) => (
                  <option key={ratio} value={ratio}>{ratio}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Inference Steps: {steps}</Label>
            <Slider
              value={[steps]}
              onValueChange={(v) => setSteps(v[0])}
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width: {width}</Label>
              <Slider
                value={[width]}
                onValueChange={(v) => setWidth(v[0])}
                min={512}
                max={2048}
                step={64}
              />
            </div>
            <div>
              <Label>Height: {height}</Label>
              <Slider
                value={[height]}
                onValueChange={(v) => setHeight(v[0])}
                min={512}
                max={2048}
                step={64}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <img src={imageUrl} alt="Generated" className="w-full rounded-md" />
            ) : (
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                {loading ? 'Generating...' : 'Image will appear here'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
