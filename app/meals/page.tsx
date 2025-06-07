'use client'

import { useState, useEffect } from 'react'
import {
  Title,
  Card,
  Group,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Badge,
  ActionIcon,
  Image,
  Box,
  Divider,
  Progress,
  Center,
  Skeleton,
  Select,
  TextInput,
  SegmentedControl,
  ThemeIcon,
  Paper
} from '@mantine/core'
import {
  IconSearch,
  IconFilter,
  IconCalendar,
  IconGridDots,
  IconEdit,
  IconTrash,
  IconCamera,
  IconFlame,
  IconActivity,
  IconTarget,
  IconAward,
  IconPlus
} from '@tabler/icons-react'
import Link from 'next/link'
import AppLayout from '../components/layout/AppLayout'
import { useMeals, Meal } from '@/hooks/use-meals'

interface MealWithType extends Meal {
  meal_type: {
    name: string
    id: string
  }
}

function MealCard({ meal }: { meal: Meal }) {
  const recordedDate = new Date(meal.recorded_at)
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={meal.image_url || '/placeholder-meal.jpg'}
          height={200}
          alt={meal.meal_name}
          fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Text fw={600} size="lg" lineClamp={1}>
              {meal.meal_name}
            </Text>
            <Group gap="xs" mt={4}>
              <Badge color="green" variant="light" size="sm">
                {meal.meal_types?.name || '不明'}
              </Badge>
              <Text size="xs" c="dimmed">
                {recordedDate.toLocaleDateString('ja-JP', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </Group>
          </Box>
          
          <Group gap={4}>
            <ActionIcon 
              component={Link}
              href={`/meals/${meal.id}`}
              variant="subtle" 
              color="blue"
              size="sm"
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" size="sm">
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Group>

        {/* 栄養情報 */}
        <SimpleGrid cols={2} spacing="xs">
          {meal.calories && (
            <Group gap="xs">
              <ThemeIcon size="xs" color="red" variant="light">
                <IconFlame size={12} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                {meal.calories} kcal
              </Text>
            </Group>
          )}
          
          {meal.protein && (
            <Group gap="xs">
              <ThemeIcon size="xs" color="blue" variant="light">
                <IconActivity size={12} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                P: {meal.protein}g
              </Text>
            </Group>
          )}
          
          {meal.fat && (
            <Group gap="xs">
              <ThemeIcon size="xs" color="green" variant="light">
                <IconAward size={12} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                F: {meal.fat}g
              </Text>
            </Group>
          )}
          
          {meal.carbs && (
            <Group gap="xs">
              <ThemeIcon size="xs" color="yellow" variant="light">
                <IconTarget size={12} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                C: {meal.carbs}g
              </Text>
            </Group>
          )}
        </SimpleGrid>
      </Stack>
    </Card>
  )
}

function EmptyState() {
  return (
    <Paper p="xl" style={{ textAlign: 'center' }}>
      <Stack align="center" gap="md">
        <ThemeIcon size={80} radius="xl" color="gray" variant="light">
          <IconCamera size={40} />
        </ThemeIcon>
        <Box>
          <Title order={3} size="h4" c="dimmed">
            まだ食事が記録されていません
          </Title>
          <Text c="dimmed" mt="xs">
            最初の食事を記録して、健康管理を始めましょう
          </Text>
        </Box>
        <Button 
          component={Link}
          href="/meals/new"
          size="lg"
          variant="gradient"
          gradient={{ from: 'green', to: 'blue' }}
          leftSection={<IconPlus size={20} />}
        >
          食事を記録する
        </Button>
      </Stack>
    </Paper>
  )
}

function StatsCard({ title, value, unit, color, icon }: {
  title: string
  value: number
  unit: string
  color: string
  icon: React.ReactNode
}) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
        <ThemeIcon size="sm" color={color} variant="light">
          {icon}
        </ThemeIcon>
      </Group>
      <Text fw={700} size="xl">
        {value} {unit}
      </Text>
    </Card>
  )
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null)
  const { fetchMeals, loading } = useMeals()
  
  // 今日の統計
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  })

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const mealsData = await fetchMeals()
        setMeals(mealsData)
        
        // 統計計算
        const stats = mealsData.reduce((acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0),
          fat: acc.fat + (meal.fat || 0),
          carbs: acc.carbs + (meal.carbs || 0)
        }), { calories: 0, protein: 0, fat: 0, carbs: 0 })
        
        setTodayStats(stats)
      } catch (error) {
        console.error('Failed to fetch meals:', error)
      }
    }
    
    loadMeals()
  }, [fetchMeals])

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.meal_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedMealType || meal.meal_types?.id === selectedMealType
    return matchesSearch && matchesType
  })

  return (
    <AppLayout>
      <Stack gap="xl">
        {/* ヘッダー */}
        <Group justify="space-between" align="center">
          <Box>
            <Title order={1} size="h2" mb="xs">
              食事履歴 📊
            </Title>
            <Text size="lg" c="dimmed">
              記録された食事と栄養分析
            </Text>
          </Box>
          
          <Button 
            component={Link}
            href="/meals/new"
            size="lg" 
            radius="xl"
            variant="gradient"
            gradient={{ from: 'green', to: 'blue' }}
            leftSection={<IconPlus size={24} />}
          >
            食事を記録
          </Button>
        </Group>

        {/* 今日の統計サマリー */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <StatsCard
            title="カロリー"
            value={todayStats.calories}
            unit="kcal"
            color="red"
            icon={<IconFlame size={16} />}
          />
          <StatsCard
            title="たんぱく質"
            value={todayStats.protein}
            unit="g"
            color="blue"
            icon={<IconActivity size={16} />}
          />
          <StatsCard
            title="脂質"
            value={todayStats.fat}
            unit="g"
            color="green"
            icon={<IconAward size={16} />}
          />
          <StatsCard
            title="炭水化物"
            value={todayStats.carbs}
            unit="g"
            color="yellow"
            icon={<IconTarget size={16} />}
          />
        </SimpleGrid>

        {/* フィルター・検索バー */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Group flex={1} gap="md">
              <TextInput
                placeholder="食事名で検索..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, maxWidth: 300 }}
              />
              
              <Select
                placeholder="食事タイプ"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: '1', label: '朝食' },
                  { value: '2', label: '昼食' },
                  { value: '3', label: '夕食' },
                  { value: '4', label: '間食' },
                  { value: '5', label: 'プロテイン' },
                ]}
                value={selectedMealType}
                onChange={setSelectedMealType}
                clearable
                style={{ width: 160 }}
              />
            </Group>
            
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as 'grid' | 'calendar')}
              data={[
                {
                  label: (
                    <div className="flex items-center gap-2">
                      <IconGridDots size={16} />
                      <span>グリッド</span>
                    </div>
                  ),
                  value: 'grid',
                },
                {
                  label: (
                    <div className="flex items-center gap-2">
                      <IconCalendar size={16} />
                      <span>カレンダー</span>
                    </div>
                  ),
                  value: 'calendar',
                },
              ]}
            />
          </Group>
        </Card>

        {/* メイン コンテンツ */}
        {loading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Skeleton height={200} />
                </Card.Section>
                <Stack gap="sm" mt="md">
                  <Skeleton height={20} />
                  <Skeleton height={16} width="60%" />
                  <Group gap="xs">
                    <Skeleton height={12} width={60} />
                    <Skeleton height={12} width={60} />
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        ) : filteredMeals.length === 0 ? (
          <EmptyState />
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {filteredMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </AppLayout>
  )
}