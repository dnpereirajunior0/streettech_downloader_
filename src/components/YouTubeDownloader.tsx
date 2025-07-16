import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Video, Loader2, ExternalLink, History, Trash2, Copy, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QualityOption {
  value: string;
  label: string;
  resolution: string;
}

const qualityOptions: QualityOption[] = [
  { value: '2160p', label: '4K Ultra HD', resolution: '3840x2160' },
  { value: '1440p', label: '2K Quad HD', resolution: '2560x1440' },
  { value: '1080p', label: 'Full HD', resolution: '1920x1080' },
  { value: '720p', label: 'HD', resolution: '1280x720' },
  { value: '480p', label: 'SD', resolution: '854x480' },
  { value: '360p', label: 'Low Quality', resolution: '640x360' }
];

interface DownloadHistory {
  id: string;
  url: string;
  title: string;
  quality: string;
  timestamp: string;
  thumbnail: string;
}

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar histórico do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('streettech-download-history');
    if (saved) {
      setDownloadHistory(JSON.parse(saved));
    }
  }, []);

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
    return youtubeRegex.test(url);
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Validações avançadas
  const validateVideo = async (videoId: string) => {
    // Simular validações específicas
    const errors = [];
    
    // Verificar se vídeo existe
    if (videoId === 'fake-error') {
      errors.push('Vídeo não encontrado ou foi removido');
    }
    
    // Verificar se vídeo é privado
    if (videoId === 'private-video') {
      errors.push('Este vídeo é privado e não pode ser baixado');
    }
    
    // Verificar duração (simular limite de 1 hora)
    if (videoId === 'long-video') {
      errors.push('Vídeo muito longo (máximo 1 hora)');
    }
    
    return errors;
  };

  const handleProcess = async () => {
    setError(null);
    
    if (!url.trim()) {
      setError("URL obrigatória");
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL do YouTube.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError("URL inválida");
      toast({
        title: "URL inválida",
        description: "Formato de URL do YouTube não reconhecido.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setVideoInfo(null);
    
    try {
      const videoId = extractVideoId(url);
      
      // Validações avançadas
      const validationErrors = await validateVideo(videoId!);
      
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        setIsLoading(false);
        toast({
          title: "Erro de validação",
          description: validationErrors[0],
          variant: "destructive"
        });
        return;
      }
      
      // Simular busca de informações do vídeo
      setTimeout(() => {
        const mockVideoInfo = {
          id: videoId,
          title: `Vídeo Incrível do YouTube - ${videoId}`,
          duration: "8:45",
          views: "1.2M",
          uploadDate: "2024-01-15",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          availableQualities: ['2160p', '1440p', '1080p', '720p', '480p', '360p']
        };
        
        setVideoInfo(mockVideoInfo);
        setIsLoading(false);
        
        toast({
          title: "✅ Sucesso!",
          description: "Informações do vídeo carregadas. Clique em 'Baixar' para prosseguir.",
        });
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      setError("Erro ao processar vídeo");
      toast({
        title: "Erro",
        description: "Não foi possível processar o vídeo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const addToHistory = (videoInfo: any) => {
    const newEntry: DownloadHistory = {
      id: Date.now().toString(),
      url,
      title: videoInfo.title,
      quality,
      timestamp: new Date().toISOString(),
      thumbnail: videoInfo.thumbnail
    };
    
    const updatedHistory = [newEntry, ...downloadHistory.slice(0, 9)]; // Keep last 10
    setDownloadHistory(updatedHistory);
    localStorage.setItem('streettech-download-history', JSON.stringify(updatedHistory));
  };

  const handleDownload = () => {
    if (!videoInfo) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simular progresso de download
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          
          // Adicionar ao histórico
          addToHistory(videoInfo);
          
          toast({
            title: "✅ Download concluído!",
            description: `Arquivo salvo em qualidade ${quality}`,
          });
          
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    toast({
      title: "📥 Download iniciado",
      description: `Baixando "${videoInfo.title}" em ${quality}`,
    });
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    localStorage.removeItem('streettech-download-history');
    toast({
      title: "Histórico limpo",
      description: "Todos os registros foram removidos.",
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: "Link copiado para a área de transferência.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent">
            <Video className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">StreetTech Downloader</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Baixe vídeos do YouTube em alta qualidade, até 4K. Cole a URL, escolha a qualidade e baixe instantaneamente.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Download className="w-6 h-6 text-primary" />
              Baixar Vídeo
            </CardTitle>
            <CardDescription>
              Cole a URL do YouTube e selecione a qualidade desejada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                URL do YouTube
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`flex-1 ${error ? 'border-destructive' : ''}`}
                />
                <Button
                  onClick={handleProcess}
                  disabled={isLoading}
                  variant="hero"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  {isLoading ? 'Processando...' : 'Processar'}
                </Button>
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  size="lg"
                >
                  <History className="w-4 h-4" />
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Quality Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Qualidade do Vídeo
              </label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a qualidade" />
                </SelectTrigger>
                <SelectContent>
                  {qualityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {option.resolution}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress Bar */}
            {isDownloading && (
              <Card className="border border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Download em andamento...</span>
                      <span className="text-sm text-muted-foreground">{Math.round(downloadProgress)}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Baixando "{videoInfo?.title}" em qualidade {quality}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Preview */}
            {videoInfo && (
              <Card className="border border-primary/10 bg-background/50">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={videoInfo.thumbnail}
                        alt="Thumbnail"
                        className="w-32 h-20 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-md" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {videoInfo.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {videoInfo.duration}
                        </Badge>
                        <Badge variant="outline">
                          👁️ {videoInfo.views}
                        </Badge>
                        <Badge variant="outline">
                          📅 {videoInfo.uploadDate}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleDownload}
                          disabled={isDownloading}
                          variant="hero"
                          size="sm"
                        >
                          {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {isDownloading ? 'Baixando...' : `Baixar em ${quality}`}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ver no YouTube
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Download History */}
            {showHistory && (
              <Card className="border border-secondary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Histórico de Downloads
                    </CardTitle>
                    {downloadHistory.length > 0 && (
                      <Button
                        onClick={clearHistory}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Limpar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {downloadHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum download realizado ainda</p>
                    </div>
                  ) : (
                    downloadHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                      >
                        <img
                          src={item.thumbnail}
                          alt="Thumbnail"
                          className="w-16 h-10 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.quality}</span>
                            <span>•</span>
                            <span>{new Date(item.timestamp).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => copyUrl(item.url)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => window.open(item.url, '_blank')}
                            variant="ghost"
                            size="sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center p-6 border-0 bg-gradient-card shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">4K</div>
            <div className="text-sm text-muted-foreground">
              Qualidade máxima suportada
            </div>
          </Card>
          <Card className="text-center p-6 border-0 bg-gradient-card shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">∞</div>
            <div className="text-sm text-muted-foreground">
              Downloads ilimitados
            </div>
          </Card>
          <Card className="text-center p-6 border-0 bg-gradient-card shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">⚡</div>
            <div className="text-sm text-muted-foreground">
              Download rápido
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}