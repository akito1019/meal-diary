'use client'

import Link from 'next/link'
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  SimpleGrid, 
  Button,
  Group,
  Stack,
  List,
  ThemeIcon,
  Box,
  Center
} from '@mantine/core'
import { 
  IconLogin, 
  IconUserPlus, 
  IconCamera, 
  IconBrain,
  IconChartBar,
  IconCalendar
} from '@tabler/icons-react'

export default function Home() {
  return (
    <Box style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
      <Container size="lg" py="xl">
        <Center>
          <Stack align="center" gap="xl">
            {/* Header */}
            <Stack align="center" gap="md">
              <Title order={1} size={48} fw={700} c="dark">
                Meal Diary
              </Title>
              <Text size="xl" c="dimmed" ta="center">
                AI画像認識付き食事記録アプリ
              </Text>
            </Stack>

            {/* Mantine Test Card */}
            <Card shadow="lg" padding="xl" radius="md" withBorder w="100%" maw={600}>
              <Title order={2} size="h3" c="green.6" ta="center" mb="md">
                スタイルテスト - Mantine UI
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Card bg="green.0" radius="md" p="md">
                  <Text fw={500} c="green.8">カラー1</Text>
                  <Text size="sm" c="green.6">Green 0</Text>
                </Card>
                <Card bg="green.6" radius="md" p="md">
                  <Text fw={500} c="white">カラー2</Text>
                  <Text size="sm" c="white">Green 6</Text>
                </Card>
                <Card bg="green.9" radius="md" p="md">
                  <Text fw={500} c="white">カラー3</Text>
                  <Text size="sm" c="white">Green 9</Text>
                </Card>
              </SimpleGrid>
            </Card>

            {/* Navigation Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" w="100%" maw={800}>
              <Card 
                component={Link} 
                href="/auth/login" 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Group gap="md">
                  <ThemeIcon size="lg" color="blue" variant="light">
                    <IconLogin size={24} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Title order={3} size="h4">ログイン</Title>
                    <Text size="sm" c="dimmed">
                      アカウントにサインインして食事記録を始めましょう
                    </Text>
                  </Stack>
                </Group>
              </Card>

              <Card 
                component={Link} 
                href="/auth/register" 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                bg="green.6"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <Group gap="md">
                  <ThemeIcon size="lg" color="white" variant="filled">
                    <IconUserPlus size={24} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Title order={3} size="h4" c="white">新規登録</Title>
                    <Text size="sm" c="white">
                      新しくアカウントを作成して始める
                    </Text>
                  </Stack>
                </Group>
              </Card>

              <Card 
                component={Link} 
                href="/meals/new" 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Group gap="md">
                  <ThemeIcon size="lg" color="orange" variant="light">
                    <IconCamera size={24} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Title order={3} size="h4">食事を記録</Title>
                    <Text size="sm" c="dimmed">
                      新しい食事を写真付きで記録する
                    </Text>
                  </Stack>
                </Group>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} size="h4" mb="md">機能一覧</Title>
                <List size="sm" spacing={4}>
                  <List.Item 
                    icon={
                      <ThemeIcon size="sm" color="blue" variant="light">
                        <IconCamera size={16} />
                      </ThemeIcon>
                    }
                  >
                    写真アップロード
                  </List.Item>
                  <List.Item 
                    icon={
                      <ThemeIcon size="sm" color="purple" variant="light">
                        <IconBrain size={16} />
                      </ThemeIcon>
                    }
                  >
                    AI画像認識
                  </List.Item>
                  <List.Item 
                    icon={
                      <ThemeIcon size="sm" color="green" variant="light">
                        <IconChartBar size={16} />
                      </ThemeIcon>
                    }
                  >
                    栄養情報記録
                  </List.Item>
                  <List.Item 
                    icon={
                      <ThemeIcon size="sm" color="red" variant="light">
                        <IconCalendar size={16} />
                      </ThemeIcon>
                    }
                  >
                    カレンダー表示
                  </List.Item>
                </List>
              </Card>
            </SimpleGrid>
          </Stack>
        </Center>
      </Container>
    </Box>
  )
}