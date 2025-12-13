import { ApiConfigAccordion } from '@/components/feature/ApiConfigAccordion'
import { Header } from '@/components/feature/Header'
import { ImageResultCard } from '@/components/feature/ImageResultCard'
import { PromptCard } from '@/components/feature/PromptCard'
import { StatusCard } from '@/components/feature/StatusCard'
import { useImageGenerator } from '@/hooks/useImageGenerator'

export default function ImageGenerator() {
  const {
    currentToken,
    provider,
    model,
    availableModels,
    prompt,
    negativePrompt,
    width,
    height,
    steps,
    loading,
    imageDetails,
    status,
    elapsed,
    selectedRatio,
    uhd,
    showInfo,
    isBlurred,
    isUpscaled,
    isUpscaling,
    setProvider,
    setModel,
    setPrompt,
    setNegativePrompt,
    setWidth,
    setHeight,
    setSteps,
    setShowInfo,
    setIsBlurred,
    saveToken,
    handleRatioSelect,
    handleUhdToggle,
    handleDownload,
    handleUpscale,
    handleDelete,
    handleGenerate,
  } = useImageGenerator()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Header />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-3 space-y-4">
              <ApiConfigAccordion
                provider={provider}
                model={model}
                currentToken={currentToken}
                availableModels={availableModels}
                setProvider={setProvider}
                setModel={setModel}
                saveToken={saveToken}
              />

              <PromptCard
                prompt={prompt}
                negativePrompt={negativePrompt}
                steps={steps}
                width={width}
                height={height}
                selectedRatio={selectedRatio}
                uhd={uhd}
                loading={loading}
                setPrompt={setPrompt}
                setNegativePrompt={setNegativePrompt}
                setSteps={setSteps}
                setWidth={setWidth}
                setHeight={setHeight}
                handleRatioSelect={handleRatioSelect}
                handleUhdToggle={handleUhdToggle}
                handleGenerate={handleGenerate}
              />
            </div>

            {/* Right Panel - Output */}
            <div className="lg:col-span-2 space-y-4">
              <ImageResultCard
                imageDetails={imageDetails}
                loading={loading}
                elapsed={elapsed}
                showInfo={showInfo}
                isBlurred={isBlurred}
                isUpscaled={isUpscaled}
                isUpscaling={isUpscaling}
                setShowInfo={setShowInfo}
                setIsBlurred={setIsBlurred}
                handleUpscale={handleUpscale}
                handleDownload={handleDownload}
                handleDelete={handleDelete}
              />

              <StatusCard status={status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
