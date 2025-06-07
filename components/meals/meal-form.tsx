'use client';

import { useState, useRef } from 'react';
import { 
  Stack, 
  TextInput, 
  Textarea, 
  NumberInput, 
  Button, 
  Text, 
  Group, 
  FileInput, 
  Image, 
  Card, 
  Grid, 
  Box,
  Center,
  Loader
} from '@mantine/core';
import { IconUpload, IconPhoto, IconFlame, IconActivity, IconTarget, IconAward, IconCalendar, IconNotes } from '@tabler/icons-react';
import { Database } from '@/types/database';
import { MealTypeSelector } from '@/components/meal-types/meal-type-selector';
import { CreateMealTypeModal } from '@/components/meal-types/create-meal-type-modal';
import { useMealTypes } from '@/hooks/use-meal-types';
import { useMeals } from '@/hooks/use-meals';
import { CreateMealData } from '@/hooks/use-meals';
import dynamic from 'next/dynamic';

const AIImageAnalyzer = dynamic(() => import('@/components/ai/AIImageAnalyzer'), {
  loading: () => <Text size="sm">AI解析を読み込み中...</Text>,
  ssr: false
});
import { notifications } from '@mantine/notifications';

type MealType = Database['public']['Tables']['meal_types']['Row'];

interface MealFormData {
  mealTypeId: string;
  mealName: string;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  memo: string;
  recordedAt: string;
  imageUrl?: string;
}

interface MealFormProps {
  initialData?: Partial<MealFormData>;
  onSubmit: (data: CreateMealData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function MealForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '保存',
  loading = false,
}: MealFormProps) {
  const { mealTypes, createMealType, refetch } = useMealTypes();
  const { uploadImage } = useMeals();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<MealFormData>({
    mealTypeId: initialData?.mealTypeId || '',
    mealName: initialData?.mealName || '',
    calories: initialData?.calories || null,
    protein: initialData?.protein || null,
    fat: initialData?.fat || null,
    carbs: initialData?.carbs || null,
    memo: initialData?.memo || '',
    recordedAt: initialData?.recordedAt || new Date().toISOString().slice(0, 16),
    imageUrl: initialData?.imageUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleInputChange = (field: keyof MealFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      notifications.show({
        title: 'エラー',
        message: '画像ファイルを選択してください',
        color: 'red',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: 'エラー',
        message: 'ファイルサイズは5MB以下にしてください',
        color: 'red',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload image
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      notifications.show({
        title: '成功',
        message: '画像をアップロードしました',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'エラー',
        message: '画像のアップロードに失敗しました',
        color: 'red',
      });
      setPreviewUrl('');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalysisComplete = (data: { name: string; calories: number; protein: number; carbs: number; fat: number; memo?: string }) => {
    setFormData(prev => ({
      ...prev,
      mealName: data.name,
      calories: data.calories || prev.calories,
      protein: data.protein || prev.protein,
      fat: data.fat || prev.fat,
      carbs: data.carbs || prev.carbs,
      memo: data.memo || prev.memo,
    }));
  };

  const handleManualEdit = () => {
    // AIアナライザーを非表示にして手動入力を促す
    // 既にフォームが表示されているので、特に何もしない
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.imageUrl) {
      newErrors.imageUrl = '食事の写真をアップロードしてください';
    }

    if (!formData.mealTypeId) {
      newErrors.mealTypeId = '食事タイプを選択してください';
    }

    if (!formData.mealName.trim()) {
      newErrors.mealName = '食事名を入力してください';
    }

    if (formData.calories !== null && formData.calories < 0) {
      newErrors.calories = 'カロリーは0以上で入力してください';
    }

    if (formData.protein !== null && formData.protein < 0) {
      newErrors.protein = 'たんぱく質は0以上で入力してください';
    }

    if (formData.fat !== null && formData.fat < 0) {
      newErrors.fat = '脂質は0以上で入力してください';
    }

    if (formData.carbs !== null && formData.carbs < 0) {
      newErrors.carbs = '炭水化物は0以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        meal_type_id: formData.mealTypeId,
        image_url: formData.imageUrl!,
        meal_name: formData.mealName,
        calories: formData.calories ?? undefined,
        protein: formData.protein ?? undefined,
        fat: formData.fat ?? undefined,
        carbs: formData.carbs ?? undefined,
        memo: formData.memo,
        recorded_at: formData.recordedAt,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };


  const handleCreateMealType = async (name: string) => {
    try {
      console.log('Creating meal type:', name);
      const newType = await createMealType({ name });
      console.log('Created meal type:', newType);
      await refetch();
      setFormData(prev => ({ ...prev, mealTypeId: newType.id }));
      notifications.show({
        title: '成功',
        message: `食事タイプ「${name}」を作成しました`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error creating meal type:', error);
      const errorMessage = error instanceof Error ? error.message : '食事タイプの作成に失敗しました';
      notifications.show({
        title: 'エラー',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  };

  return (
    <Stack gap="xl">
      <form onSubmit={handleSubmit}>
        <Stack gap="xl">
        {/* Image Upload Section */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconPhoto size={20} color="var(--mantine-color-green-6)" />
              <Text fw={600} size="lg">
                食事の写真 <Text component="span" c="red">*</Text>
              </Text>
            </Group>
          </Group>
          
          {previewUrl ? (
            <Stack gap="md">
              <Card withBorder>
                <Box pos="relative">
                  <Image
                    src={previewUrl}
                    alt="食事の写真"
                    h={264}
                    fit="cover"
                    radius="md"
                  />
                  {uploading && (
                    <Box
                      pos="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="rgba(0, 0, 0, 0.5)"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--mantine-radius-md)'
                      }}
                    >
                      <Group gap="xs">
                        <Loader size="sm" color="white" />
                        <Text c="white" size="sm">アップロード中...</Text>
                      </Group>
                    </Box>
                  )}
                </Box>
              </Card>
              
              {formData.imageUrl && !uploading && (
                <Card withBorder bg="blue.0" p="md">
                  <AIImageAnalyzer
                    imageUrl={formData.imageUrl}
                    onAnalysisComplete={handleAnalysisComplete}
                    onManualEdit={handleManualEdit}
                  />
                </Card>
              )}
              
              <Group justify="center">
                <Button
                  variant="light"
                  color="green"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  leftSection={<IconPhoto size={16} />}
                >
                  写真を変更
                </Button>
              </Group>
            </Stack>
          ) : (
            <Card
              withBorder
              h={264}
              style={{
                cursor: 'pointer',
                borderStyle: 'dashed',
                borderColor: 'var(--mantine-color-green-4)',
                backgroundColor: 'var(--mantine-color-green-0)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Center h="100%">
                <Stack align="center" gap="lg">
                  <IconUpload size={64} color="var(--mantine-color-green-6)" />
                  <Stack align="center" gap={8}>
                    <Text fw={600} size="lg" c="green.7" ta="center">
                      写真をアップロード
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                      クリックまたはドラッグ&ドロップ
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      JPEG, PNG, WebP (最大5MB)
                    </Text>
                  </Stack>
                </Stack>
              </Center>
            </Card>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            disabled={uploading || loading}
          />
          
          {errors.imageUrl && (
            <Text size="sm" c="red" mt="xs">{errors.imageUrl}</Text>
          )}
        </Card>

        {/* Meal Type & Basic Info */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconTarget size={20} color="var(--mantine-color-blue-6)" />
              <Text fw={600} size="lg">基本情報</Text>
            </Group>
          </Group>
          
          <Stack gap="md">
            <Box>
              <Text size="sm" fw={500} mb="xs">
                食事タイプ <Text component="span" c="red">*</Text>
              </Text>
              <MealTypeSelector
                mealTypes={mealTypes}
                value={formData.mealTypeId}
                onChange={(value) => handleInputChange('mealTypeId', value)}
                onCreateNew={() => setShowCreateModal(true)}
                error={errors.mealTypeId}
                placeholder="食事タイプを選択してください"
              />
            </Box>

            <TextInput
              label={
                <>
                  食事名 <Text component="span" c="red">*</Text>
                </>
              }
              placeholder="例：チキンサラダ、パスタ"
              value={formData.mealName}
              onChange={(e) => handleInputChange('mealName', e.target.value)}
              disabled={loading}
              error={errors.mealName}
            />

            <TextInput
              label="記録日時"
              type="datetime-local"
              value={formData.recordedAt}
              onChange={(e) => handleInputChange('recordedAt', e.target.value)}
              disabled={loading}
              leftSection={<IconCalendar size={16} />}
            />
          </Stack>
        </Card>

        {/* Nutrition Information */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconFlame size={20} color="var(--mantine-color-red-6)" />
              <Text fw={600} size="lg">栄養情報</Text>
            </Group>
          </Group>
          
          <Grid>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <NumberInput
                label="カロリー (kcal)"
                placeholder="0"
                value={formData.calories || ''}
                onChange={(value) => handleInputChange('calories', typeof value === 'number' ? value : null)}
                disabled={loading}
                error={errors.calories}
                min={0}
                step={0.1}
                decimalScale={1}
                leftSection={<IconFlame size={16} />}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 6, md: 3 }}>
              <NumberInput
                label="たんぱく質 (g)"
                placeholder="0"
                value={formData.protein || ''}
                onChange={(value) => handleInputChange('protein', typeof value === 'number' ? value : null)}
                disabled={loading}
                error={errors.protein}
                min={0}
                step={0.1}
                decimalScale={1}
                leftSection={<IconActivity size={16} />}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 6, md: 3 }}>
              <NumberInput
                label="脂質 (g)"
                placeholder="0"
                value={formData.fat || ''}
                onChange={(value) => handleInputChange('fat', typeof value === 'number' ? value : null)}
                disabled={loading}
                error={errors.fat}
                min={0}
                step={0.1}
                decimalScale={1}
                leftSection={<IconAward size={16} />}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 6, md: 3 }}>
              <NumberInput
                label="炭水化物 (g)"
                placeholder="0"
                value={formData.carbs || ''}
                onChange={(value) => handleInputChange('carbs', typeof value === 'number' ? value : null)}
                disabled={loading}
                error={errors.carbs}
                min={0}
                step={0.1}
                decimalScale={1}
                leftSection={<IconTarget size={16} />}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Memo Section */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Group gap="sm">
              <IconNotes size={20} color="var(--mantine-color-gray-6)" />
              <Text fw={600} size="lg">メモ</Text>
            </Group>
          </Group>
          
          <Textarea
            placeholder="食事に関するメモがあれば記入してください"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            disabled={loading}
            autosize
            minRows={4}
          />
        </Card>

        {/* Action Buttons */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="flex-end" gap="md">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                size="lg"
              >
                キャンセル
              </Button>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              size="lg"
              variant="gradient"
              gradient={{ from: 'green', to: 'blue' }}
            >
              {submitLabel}
            </Button>
          </Group>
        </Card>
        </Stack>
      </form>

      {/* Create Meal Type Modal */}
      <CreateMealTypeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMealType}
      />
    </Stack>
  );
}
