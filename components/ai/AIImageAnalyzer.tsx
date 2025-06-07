'use client';

import { useState } from 'react';
import { 
  Stack, 
  Text, 
  Button, 
  Group, 
  ThemeIcon, 
  Loader, 
  Box,
  Progress,
  Badge,
  Alert,
  Paper,
  Timeline,
  ActionIcon,
  Tooltip,
  Transition
} from '@mantine/core';
import { 
  IconBrain, 
  IconScan, 
  IconWand, 
  IconEdit, 
  IconAlertCircle, 
  IconRefresh,
  IconSparkles,
  IconRobot,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { useAI } from '@/hooks/useAI';
import { MealAnalysisResult } from '@/types/ai';
import MealAnalysisResultComponent from './MealAnalysisResult';

interface AIImageAnalyzerProps {
  imageUrl: string;
  onAnalysisComplete: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    memo?: string;
  }) => void;
  onManualEdit: () => void;
}

export default function AIImageAnalyzer({
  imageUrl,
  onAnalysisComplete,
  onManualEdit
}: AIImageAnalyzerProps) {
  const { analyzing, error, analyzeImage } = useAI();
  const [result, setResult] = useState<MealAnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await analyzeImage({ imageUrl });
      
      if (response.success && response.data) {
        setResult(response.data);
        setHasAnalyzed(true);
        setProgress(100);
      }
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setProgress(100), 300);
    }
  };

  const handleSelectResult = (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    memo?: string;
  }) => {
    onAnalysisComplete(data);
  };

  // 解析中の状態
  if (analyzing) {
    return (
      <Paper radius="lg" p="xl" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Stack align="center" gap="lg">
          <ThemeIcon 
            size={80} 
            radius="xl" 
            variant="white" 
            color="violet"
            style={{ boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)' }}
          >
            <IconBrain size={40} />
          </ThemeIcon>
          
          <Stack align="center" gap="sm">
            <Text fw={700} size="xl" ta="center">
              🤖 AI画像解析中
            </Text>
            <Text ta="center" opacity={0.9}>
              食事の内容を詳しく分析しています...
            </Text>
          </Stack>

          <Box w="100%" maw={300}>
            <Progress 
              value={progress} 
              size="lg" 
              radius="xl"
              color="white"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
            <Text size="xs" ta="center" mt="xs" opacity={0.8}>
              {progress}% 完了
            </Text>
          </Box>

          <Timeline active={2} bulletSize={24} lineWidth={2} color="white">
            <Timeline.Item bullet={<IconScan size={12} />} title="画像解析">
              <Text size="xs" opacity={0.8}>画像から食材を検出中</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconWand size={12} />} title="栄養計算">
              <Text size="xs" opacity={0.8}>カロリーと栄養素を算出中</Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconSparkles size={12} />} title="結果生成">
              <Text size="xs" opacity={0.8}>最終結果をまとめ中</Text>
            </Timeline.Item>
          </Timeline>
        </Stack>
      </Paper>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        title="解析エラーが発生しました" 
        color="red"
        radius="lg"
        p="xl"
      >
        <Stack gap="md">
          <Text size="sm">{error}</Text>
          <Group justify="center" gap="md">
            <Button
              variant="light"
              color="red"
              leftSection={<IconRefresh size={16} />}
              onClick={handleAnalyze}
            >
              再試行
            </Button>
            <Button
              variant="outline"
              color="gray"
              leftSection={<IconEdit size={16} />}
              onClick={onManualEdit}
            >
              手動入力
            </Button>
          </Group>
        </Stack>
      </Alert>
    );
  }

  // 結果表示
  if (result) {
    return (
      <Transition mounted={true} transition="slide-up" duration={400}>
        {(styles) => (
          <div style={styles}>
            <MealAnalysisResultComponent
              result={result}
              onSelect={handleSelectResult}
              onEdit={onManualEdit}
            />
          </div>
        )}
      </Transition>
    );
  }

  // 初期状態（解析開始前）
  if (!hasAnalyzed) {
    return (
      <Paper 
        radius="lg" 
        p="xl"
        style={{ 
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 背景の装飾 */}
        <Box
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />

        <Stack align="center" gap="xl" style={{ position: 'relative', zIndex: 1 }}>
          {/* メインアイコン */}
          <ThemeIcon 
            size={100} 
            radius="xl" 
            variant="white" 
            color="blue"
            style={{ 
              boxShadow: '0 12px 48px rgba(116, 185, 255, 0.4)',
              animation: 'pulse 2s infinite'
            }}
          >
            <IconRobot size={60} />
          </ThemeIcon>
          
          {/* タイトルとバッジ */}
          <Stack align="center" gap="sm">
            <Group gap="sm">
              <Badge size="lg" variant="white" color="blue">
                🚀 最新AI技術
              </Badge>
              <Badge size="lg" variant="white" color="green">
                ⚡ 高速解析
              </Badge>
            </Group>
            
            <Text fw={700} size="xl" ta="center">
              AI画像解析
            </Text>
            <Text ta="center" opacity={0.9} maw={400}>
              最先端の人工知能が写真から食事内容を自動認識し、
              カロリーや栄養成分を瞬時に算出します
            </Text>
          </Stack>

          {/* 機能説明 */}
          <Group justify="center" gap="xl">
            <Stack align="center" gap="xs">
              <ThemeIcon size={40} radius="xl" variant="white" color="orange">
                <IconScan size={20} />
              </ThemeIcon>
              <Text size="sm" fw={500}>食材認識</Text>
            </Stack>
            <Stack align="center" gap="xs">
              <ThemeIcon size={40} radius="xl" variant="white" color="green">
                <IconWand size={20} />
              </ThemeIcon>
              <Text size="sm" fw={500}>栄養計算</Text>
            </Stack>
            <Stack align="center" gap="xs">
              <ThemeIcon size={40} radius="xl" variant="white" color="violet">
                <IconSparkles size={20} />
              </ThemeIcon>
              <Text size="sm" fw={500}>自動入力</Text>
            </Stack>
          </Group>

          {/* アクションボタン */}
          <Group gap="md">
            <Button
              size="lg"
              variant="white"
              color="blue"
              leftSection={<IconBrain size={20} />}
              onClick={handleAnalyze}
              style={{
                fontWeight: 600,
                boxShadow: '0 8px 32px rgba(255,255,255,0.3)',
              }}
            >
              AI解析を開始
            </Button>
            
            <Tooltip label="手動で栄養情報を入力">
              <ActionIcon 
                size="lg" 
                variant="white" 
                color="gray"
                onClick={onManualEdit}
                style={{ boxShadow: '0 4px 16px rgba(255,255,255,0.2)' }}
              >
                <IconEdit size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Paper>
    );
  }

  return null;
}