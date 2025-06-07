'use client';

import { useState } from 'react';
import { 
  Stack, 
  Text, 
  Button, 
  Group, 
  Badge, 
  Paper, 
  SimpleGrid,
  Card,
  Progress,
  Divider,
  ActionIcon,
  Tooltip,
  Transition,
  ThemeIcon,
  Box,
  Title,
  Alert,
  Pill,
  RingProgress,
  Center
} from '@mantine/core';
import { 
  IconCheck, 
  IconEdit, 
  IconSparkles, 
  IconFlame,
  IconActivity,
  IconTarget,
  IconAward,
  IconTrendingUp,
  IconBrain,
  IconStar,
  IconChefHat,
  IconEye
} from '@tabler/icons-react';
import { MealAnalysisResult, MealAnalysisAlternative, PastMealSuggestion } from '@/types/ai';

interface MealAnalysisResultProps {
  result: MealAnalysisResult;
  onSelect: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    memo?: string;
  }) => void;
  onEdit: () => void;
}

export default function MealAnalysisResultComponent({
  result,
  onSelect,
  onEdit,
}: MealAnalysisResultProps) {
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [selectedPastMeal, setSelectedPastMeal] = useState<string | null>(null);

  const handleSelectMain = () => {
    setSelectedAlternative(null);
    setSelectedPastMeal(null);
    onSelect({
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat
    });
  };

  const handleSelectAlternative = (alternative: MealAnalysisAlternative) => {
    setSelectedPastMeal(null); // 過去の食事選択をクリア
    onSelect({
      name: alternative.name,
      calories: alternative.calories,
      protein: alternative.protein || 0,
      carbs: alternative.carbs || 0,
      fat: alternative.fat || 0
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'green';
    if (confidence >= 0.6) return 'yellow';
    return 'red';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '高精度';
    if (confidence >= 0.6) return '中精度';
    return '低精度';
  };

  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <Transition mounted={true} transition="slide-up" duration={400}>
      {(styles) => (
        <div style={styles}>
          <Paper radius="lg" p="xl" style={{ background: 'linear-gradient(145deg, #f8f9ff 0%, #e8f5e8 100%)' }}>
            <Stack gap="xl">
              {/* ヘッダー */}
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <ThemeIcon size={50} radius="xl" variant="gradient" gradient={{ from: 'green', to: 'blue' }}>
                    <IconBrain size={30} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Title order={3} size="h4" c="dark">
                      🎉 AI解析完了！
                    </Title>
                    <Group gap="xs">
                      <Badge 
                        size="lg" 
                        variant="light" 
                        color={getConfidenceColor(result.confidence)}
                        leftSection={<IconStar size={14} />}
                      >
                        {getConfidenceText(result.confidence)} ({confidencePercentage}%)
                      </Badge>
                    </Group>
                  </Stack>
                </Group>
                
                <Group gap="sm">
                  <RingProgress
                    size={60}
                    thickness={8}
                    sections={[{ value: confidencePercentage, color: getConfidenceColor(result.confidence) }]}
                    label={
                      <Center>
                        <Text size="xs" fw={700}>{confidencePercentage}%</Text>
                      </Center>
                    }
                  />
                </Group>
              </Group>

              {/* メイン結果 */}
              <Card 
                radius="lg" 
                p="xl" 
                withBorder 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                      <Group gap="sm">
                        <ThemeIcon size={40} radius="xl" variant="white" color="violet">
                          <IconChefHat size={20} />
                        </ThemeIcon>
                        <Stack gap={0}>
                          <Title order={2} c="white">
                            {result.name}
                          </Title>
                          {result.description && (
                            <Text size="sm" opacity={0.9}>
                              {result.description}
                            </Text>
                          )}
                        </Stack>
                      </Group>
                      
                      {result.portionSize && (
                        <Text size="sm" opacity={0.8}>
                          📏 目安量: {result.portionSize}
                        </Text>
                      )}
                    </Stack>

                    <Button
                      size="lg"
                      variant="white"
                      color="violet"
                      leftSection={<IconCheck size={20} />}
                      onClick={handleSelectMain}
                      style={{ fontWeight: 600 }}
                    >
                      この結果を使用
                    </Button>
                  </Group>

                  <Divider color="rgba(255,255,255,0.3)" />

                  {/* 栄養成分表示 */}
                  <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                    <Card radius="md" p="md" bg="rgba(255,255,255,0.15)">
                      <Stack align="center" gap="xs">
                        <ThemeIcon size={30} radius="xl" variant="white" color="red">
                          <IconFlame size={16} />
                        </ThemeIcon>
                        <Text fw={700} size="xl" c="white">
                          {result.calories}
                        </Text>
                        <Text size="xs" opacity={0.9}>kcal</Text>
                      </Stack>
                    </Card>

                    <Card radius="md" p="md" bg="rgba(255,255,255,0.15)">
                      <Stack align="center" gap="xs">
                        <ThemeIcon size={30} radius="xl" variant="white" color="blue">
                          <IconActivity size={16} />
                        </ThemeIcon>
                        <Text fw={700} size="xl" c="white">
                          {result.protein.toFixed(1)}g
                        </Text>
                        <Text size="xs" opacity={0.9}>たんぱく質</Text>
                      </Stack>
                    </Card>

                    <Card radius="md" p="md" bg="rgba(255,255,255,0.15)">
                      <Stack align="center" gap="xs">
                        <ThemeIcon size={30} radius="xl" variant="white" color="yellow">
                          <IconTarget size={16} />
                        </ThemeIcon>
                        <Text fw={700} size="xl" c="white">
                          {result.carbs.toFixed(1)}g
                        </Text>
                        <Text size="xs" opacity={0.9}>炭水化物</Text>
                      </Stack>
                    </Card>

                    <Card radius="md" p="md" bg="rgba(255,255,255,0.15)">
                      <Stack align="center" gap="xs">
                        <ThemeIcon size={30} radius="xl" variant="white" color="green">
                          <IconAward size={16} />
                        </ThemeIcon>
                        <Text fw={700} size="xl" c="white">
                          {result.fat.toFixed(1)}g
                        </Text>
                        <Text size="xs" opacity={0.9}>脂質</Text>
                      </Stack>
                    </Card>
                  </SimpleGrid>

                  {/* 主な材料 */}
                  {result.ingredients && result.ingredients.length > 0 && (
                    <Box>
                      <Text size="sm" fw={500} mb="xs" opacity={0.9}>
                        🥗 主な材料:
                      </Text>
                      <Group gap="xs">
                        {result.ingredients.map((ingredient, index) => (
                          <Pill
                            key={index}
                            size="sm"
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white'
                            }}
                          >
                            {ingredient}
                          </Pill>
                        ))}
                      </Group>
                    </Box>
                  )}
                </Stack>
              </Card>

              {/* 選択肢セクション */}
              <Stack gap="xl">
                {/* AI解析の代替候補 */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <Box>
                    <Card withBorder p="lg" radius="lg" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
                      <Group mb="lg" gap="sm">
                        <ThemeIcon size={40} radius="xl" color="blue" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                          <IconBrain size={20} />
                        </ThemeIcon>
                        <Box>
                          <Text fw={700} size="lg" c="blue.8">
                            🤖 AI解析の候補
                          </Text>
                          <Text size="sm" c="dimmed">
                            画像から推測された可能性の高い候補
                          </Text>
                        </Box>
                      </Group>
                      
                      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                        {result.alternatives.slice(0, 3).map((alternative, index) => (
                          <Card
                            key={index}
                            radius="md"
                            p="md"
                            withBorder
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              background: selectedAlternative === index ? 'var(--mantine-color-blue-1)' : 'white',
                              borderColor: selectedAlternative === index ? 'var(--mantine-color-blue-4)' : undefined,
                              transform: selectedAlternative === index ? 'translateY(-2px)' : undefined,
                              boxShadow: selectedAlternative === index ? '0 4px 20px rgba(33, 150, 243, 0.3)' : undefined
                            }}
                            onClick={() => {
                              setSelectedAlternative(index);
                              handleSelectAlternative(alternative);
                            }}
                          >
                            <Stack gap="sm">
                              <Group justify="space-between" align="flex-start">
                                <Text fw={600} size="sm" lineClamp={2} flex={1}>
                                  {alternative.name}
                                </Text>
                                <Badge size="sm" color="blue" variant="light">
                                  {Math.round(alternative.confidence * 100)}%
                                </Badge>
                              </Group>
                              
                              <SimpleGrid cols={2} spacing="xs">
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="red.6">{alternative.calories}</Text>
                                  <Text c="dimmed">kcal</Text>
                                </Text>
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="blue.6">{alternative.protein?.toFixed(1) || 0}g</Text>
                                  <Text c="dimmed">P</Text>
                                </Text>
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="yellow.6">{alternative.carbs?.toFixed(1) || 0}g</Text>
                                  <Text c="dimmed">C</Text>
                                </Text>
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="green.6">{alternative.fat?.toFixed(1) || 0}g</Text>
                                  <Text c="dimmed">F</Text>
                                </Text>
                              </SimpleGrid>
                              
                              {selectedAlternative === index && (
                                <Badge color="blue" variant="filled" size="sm" style={{ alignSelf: 'center' }}>
                                  ✓ 選択中
                                </Badge>
                              )}
                            </Stack>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </Card>
                  </Box>
                )}

                {/* 過去の類似食事サジェスト */}
                {result.pastMealSuggestions && result.pastMealSuggestions.length > 0 && (
                  <Box>
                    <Card withBorder p="lg" radius="lg" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #e8f5e8 100%)' }}>
                      <Group mb="lg" gap="sm">
                        <ThemeIcon size={40} radius="xl" color="violet" variant="gradient" gradient={{ from: 'violet', to: 'purple' }}>
                          <IconStar size={20} />
                        </ThemeIcon>
                        <Box>
                          <Text fw={700} size="lg" c="violet.8">
                            📸 画像が類似した過去の記録
                          </Text>
                          <Text size="sm" c="dimmed">
                            見た目が似ている過去の食事記録
                          </Text>
                        </Box>
                      </Group>
                      
                      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                        {result.pastMealSuggestions.slice(0, 3).map((suggestion) => (
                          <Card
                            key={suggestion.id}
                            radius="md"
                            p="md"
                            withBorder
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              background: selectedPastMeal === suggestion.id ? 'var(--mantine-color-violet-1)' : 'white',
                              borderColor: selectedPastMeal === suggestion.id ? 'var(--mantine-color-violet-4)' : undefined,
                              transform: selectedPastMeal === suggestion.id ? 'translateY(-2px)' : undefined,
                              boxShadow: selectedPastMeal === suggestion.id ? '0 4px 20px rgba(139, 69, 199, 0.3)' : undefined
                            }}
                            onClick={() => {
                              setSelectedPastMeal(suggestion.id);
                              setSelectedAlternative(null); // 他の選択をクリア
                              onSelect({
                                name: suggestion.meal_name,
                                calories: suggestion.calories || 0,
                                protein: suggestion.protein || 0,
                                carbs: suggestion.carbs || 0,
                                fat: suggestion.fat || 0,
                                memo: suggestion.memo || ''
                              });
                            }}
                          >
                            <Stack gap="sm">
                              <Group justify="space-between" align="flex-start">
                                <Box flex={1}>
                                  <Text fw={600} size="sm" lineClamp={2}>
                                    {suggestion.meal_name}
                                  </Text>
                                  <Group gap="xs" mt={4}>
                                    <Badge size="xs" color="violet" variant="light">
                                      {suggestion.meal_types?.name || '不明'}
                                    </Badge>
                                    <Badge size="xs" color="blue" variant="light">
                                      類似度: {Math.round(suggestion.similarity_score * 100)}%
                                    </Badge>
                                  </Group>
                                  <Text size="xs" c="dimmed" mt={2}>
                                    {new Date(suggestion.recorded_at).toLocaleDateString('ja-JP', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </Text>
                                  {suggestion.memo && (
                                    <Text size="xs" c="gray.6" mt={2} lineClamp={2} style={{ fontStyle: 'italic' }}>
                                      📝 {suggestion.memo}
                                    </Text>
                                  )}
                                  {suggestion.similarity_reasoning && (
                                    <Text size="xs" c="dimmed" mt={2} lineClamp={2}>
                                      💭 {suggestion.similarity_reasoning}
                                    </Text>
                                  )}
                                </Box>
                              </Group>
                              
                              <SimpleGrid cols={2} spacing="xs">
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="red.6">{suggestion.calories || 0}</Text>
                                  <Text c="dimmed">kcal</Text>
                                </Text>
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="blue.6">{suggestion.protein?.toFixed(1) || 0}g</Text>
                                  <Text c="dimmed">P</Text>
                                </Text>
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="yellow.6">{suggestion.carbs?.toFixed(1) || 0}g</Text>
                                  <Text c="dimmed">C</Text>
                                </Text>
                                <Text size="xs" ta="center">
                                  <Text fw={600} c="green.6">{suggestion.fat?.toFixed(1) || 0}g</Text>
                                  <Text c="dimmed">F</Text>
                                </Text>
                              </SimpleGrid>
                              
                              {selectedPastMeal === suggestion.id && (
                                <Badge color="violet" variant="filled" size="sm" style={{ alignSelf: 'center' }}>
                                  ✓ 選択中
                                </Badge>
                              )}
                            </Stack>
                          </Card>
                        ))}
                      </SimpleGrid>
                      
                      <Text size="xs" c="dimmed" ta="center" mt="md">
                        📷 AI が画像の見た目から類似度を判定しました。クリックして栄養情報をコピーできます。
                      </Text>
                    </Card>
                  </Box>
                )}
              </Stack>

              {/* フッターアクション */}
              <Group justify="center" pt="md">
                <Button
                  variant="outline"
                  color="gray"
                  leftSection={<IconEdit size={16} />}
                  onClick={onEdit}
                >
                  手動で編集
                </Button>
              </Group>
            </Stack>
          </Paper>
        </div>
      )}
    </Transition>
  );
}