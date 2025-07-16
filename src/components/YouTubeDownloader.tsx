import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Video, Loader2, ExternalLink } from 'lucide-react';
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

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const { toast } = useToast();

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
    return youtubeRegex.test(url);
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleProcess = async () => {
    if (!url) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL do YouTube.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular busca de informações do vídeo
      const videoId = extractVideoId(url);
      
      // Em um app real, você faria uma chamada para uma API backend
      // que usaria uma biblioteca como youtube-dl ou yt-dlp
      setTimeout(() => {
        setVideoInfo({
          id: videoId,
          title: "Vídeo do YouTube",
          duration: "5:30",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          availableQualities: ['2160p', '1440p', '1080p', '720p', '480p', '360p']
        });
        setIsLoading(false);
        
        toast({
          title: "Sucesso!",
          description: "Informações do vídeo carregadas. Clique em 'Baixar' para prosseguir.",
        });
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erro",
        description: "Não foi possível processar o vídeo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: `Baixando em qualidade ${quality}. Em um app real, isso iniciaria o download.`,
    });
    
    // Em um app real, você faria uma chamada para a API de download
    console.log('Download would start here:', { url, quality });
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent">
            <Video className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">YouTube Downloader</h1>
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
                  className="flex-1"
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
              </div>
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
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Duração: {videoInfo.duration}
                        </Badge>
                        <Badge variant="outline">
                          ID: {videoInfo.id}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleDownload}
                          variant="hero"
                          size="sm"
                        >
                          <Download className="w-4 h-4" />
                          Baixar em {quality}
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