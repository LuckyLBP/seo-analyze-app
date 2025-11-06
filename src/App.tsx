import { useState } from 'react'
import './index.css'
import IntroScreen from './components/IntroScreen'
import UrlInputScreen from './components/UrlInputScreen'
import ContactForm from './components/ContactForm'
import SEOReport from './components/SEOReport'
import LoadingScreen from './components/LoadingScreen'
import { performStagedAudit, type SEOAnalysisResult } from './services/apiService'

export interface UserData {
  name: string
  email: string
  phone: string
}

export interface AnalysisData {
  url: string
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
  suggestions: string[]
  issues: string[]
  isAiAnalysisComplete?: boolean
}

function App() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'urlInput' | 'loading' | 'contact' | 'report'>('intro')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleGetStarted = () => {
    setCurrentStep('urlInput')
  }

  const handleBackToIntro = () => {
    setCurrentStep('intro')
    setError(null)
  }

  const handleUrlSubmit = async (url: string) => {
    setWebsiteUrl(url)
    setCurrentStep('loading')
    setError(null)
    
    try {
      console.log('Starting staged analysis for:', url)
      
      // Use staged analysis - show PageSpeed results first, then AI
      const handlePageSpeedComplete = (initialData: SEOAnalysisResult) => {
        console.log('PageSpeed analysis complete, showing initial results')
        
        // Convert to UI format and show initial results
        const analysisForUI: AnalysisData = {
          url: initialData.url,
          performance: initialData.metrics.performance,
          accessibility: initialData.metrics.accessibility,
          bestPractices: initialData.metrics.bestPractices,
          seo: initialData.metrics.seo,
          suggestions: initialData.suggestions,
          issues: initialData.issues,
          isAiAnalysisComplete: false
        }
        
        setAnalysisData(analysisForUI)
        setCurrentStep('contact') // Move to contact form while AI loads
        setIsAiLoading(true)
      }
      
      // Start staged analysis
      const finalResult = await performStagedAudit(url, handlePageSpeedComplete)
      
      // Update with final AI-enhanced results
      const finalAnalysisForUI: AnalysisData = {
        url: finalResult.url,
        performance: finalResult.metrics.performance,
        accessibility: finalResult.metrics.accessibility,
        bestPractices: finalResult.metrics.bestPractices,
        seo: finalResult.metrics.seo,
        suggestions: finalResult.suggestions,
        issues: finalResult.issues,
        isAiAnalysisComplete: true
      }
      
      setAnalysisData(finalAnalysisForUI)
      setIsAiLoading(false)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Ett oväntat fel inträffade')
      setIsAiLoading(false)
      // Stay on loading screen but show error
    }
  }

  const handleContactSubmit = (data: UserData) => {
    setUserData(data)
    // Use the real analysis data we already have
    setCurrentStep('report')
  }

  const handleStartOver = () => {
    setCurrentStep('intro')
    setWebsiteUrl('')
    setUserData(null)
    setAnalysisData(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Semantic HTML structure for SEO */}
      <header style={{ position: 'absolute', left: '-9999px' }}>
        <h1>Gratis SEO Analys | Effektiv Media</h1>
        <nav aria-label="Huvudnavigation">
          <ul>
            <li><a href="https://effektivmedia.nu/">Hem</a></li>
            <li><a href="https://effektivmedia.nu/tjanster/">Tjänster</a></li>
            <li><a href="https://effektivmedia.nu/kontakt/">Kontakt</a></li>
          </ul>
        </nav>
      </header>

      <main role="main">
        {currentStep === 'intro' && (
          <section aria-labelledby="intro-heading">
            <IntroScreen onGetStarted={handleGetStarted} />
          </section>
        )}
        {currentStep === 'urlInput' && (
          <section aria-labelledby="url-input-heading">
            <UrlInputScreen onUrlSubmit={handleUrlSubmit} onBack={handleBackToIntro} />
          </section>
        )}
        {currentStep === 'loading' && (
          <section aria-labelledby="loading-heading" aria-live="polite">
            <LoadingScreen 
              websiteUrl={websiteUrl} 
              error={error} 
              onRetry={() => handleUrlSubmit(websiteUrl)}
              onBack={() => setCurrentStep('urlInput')}
            />
          </section>
        )}
        {currentStep === 'contact' && (
          <section aria-labelledby="contact-heading">
            <ContactForm onSubmit={handleContactSubmit} websiteUrl={websiteUrl} />
          </section>
        )}
        {currentStep === 'report' && analysisData && userData && (
          <section aria-labelledby="report-heading">
            <SEOReport 
              analysisData={analysisData} 
              userData={userData} 
              onStartOver={handleStartOver}
              isAiLoading={isAiLoading}
            />
          </section>
        )}
      </main>

      <footer style={{ position: 'absolute', left: '-9999px' }}>
        <p>&copy; 2025 Effektiv Media. Alla rättigheter förbehållna.</p>
        <address>
          <a href="mailto:info@effektivmedia.nu">info@effektivmedia.nu</a>
        </address>
      </footer>
    </div>
  )
}

export default App
