'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Alert,
  Divider,
  Anchor,
  Center,
  Box
} from '@mantine/core'
import { IconAlertCircle, IconBrandGoogle } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'
import { notifications } from '@mantine/notifications'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      notifications.show({
        title: 'ログイン成功',
        message: 'ダッシュボードにリダイレクトしています...',
        color: 'green',
      })

      router.push('/')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
      <Container size={420} py={80}>
        <Center>
          <Stack gap="xl" w="100%">
            <Stack align="center" gap="sm">
              <Title order={1} ta="center">
                ログイン
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                または{' '}
                <Anchor component={Link} href="/auth/register" size="sm">
                  新規登録はこちら
                </Anchor>
              </Text>
            </Stack>

            <Paper withBorder shadow="md" p={30} radius="md">
              <form onSubmit={handleLogin}>
                <Stack gap="md">
                  {error && (
                    <Alert 
                      icon={<IconAlertCircle size={16} />} 
                      color="red"
                      title="エラー"
                    >
                      {error}
                    </Alert>
                  )}

                  <TextInput
                    label="メールアドレス"
                    placeholder="mail@example.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    disabled={loading || googleLoading}
                  />

                  <PasswordInput
                    label="パスワード"
                    placeholder="パスワードを入力"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    disabled={loading || googleLoading}
                  />

                  <Group justify="flex-end">
                    <Anchor 
                      component={Link} 
                      href="/auth/reset-password" 
                      size="sm"
                    >
                      パスワードを忘れた方
                    </Anchor>
                  </Group>

                  <Button 
                    type="submit" 
                    fullWidth 
                    loading={loading}
                    disabled={googleLoading}
                  >
                    ログイン
                  </Button>

                  <Divider label="または" labelPosition="center" my="lg" />

                  <Button
                    variant="outline"
                    fullWidth
                    leftSection={<IconBrandGoogle size={16} />}
                    onClick={handleGoogleLogin}
                    loading={googleLoading}
                    disabled={loading}
                  >
                    Googleでログイン
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Stack>
        </Center>
      </Container>
    </Box>
  )
}