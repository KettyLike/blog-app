import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilePenLine, ImagePlus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { spacing } from '../theme/spacing';
import { imageAssetToDataUrl } from '../utils/imageProcessing';

export default function CreateArticleScreen({ currentUser, navigation, onCreateArticle, theme }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickCover = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Allow photo library access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Image error', 'Could not read the selected image.');
      return;
    }

    try {
      const dataUrl = await imageAssetToDataUrl(asset, { maxWidth: 1200, compress: 0.7 });
      setCoverImage(dataUrl);
    } catch (error) {
      console.warn(error);
      Alert.alert('Image error', 'Could not process the selected image.');
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Incomplete form', 'Title and article body are required.');
      return;
    }

    setIsSubmitting(true);
    const isCreated = await onCreateArticle({
      title: title.trim(),
      category: category.trim() || null,
      coverImage,
      body: body.trim(),
      userId: currentUser.id,
    });
    setIsSubmitting(false);

    if (!isCreated) {
      Alert.alert('Publish failed', 'Check the backend server and try again.');
      return;
    }

    setTitle('');
    setCategory('');
    setCoverImage(null);
    setBody('');
    Alert.alert('Article published', 'The new article is now available in the feed.');
    navigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: theme.surfaceAlt }]}>
            <FilePenLine color={theme.accent} size={22} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Write article</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Publish a new post as {currentUser.name}.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <TextInput
            placeholder="Title"
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
            style={[
              styles.input,
              {
                backgroundColor: theme.surfaceAlt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <TextInput
            placeholder="Category (optional)"
            placeholderTextColor={theme.textMuted}
            value={category}
            onChangeText={setCategory}
            style={[
              styles.input,
              {
                backgroundColor: theme.surfaceAlt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <TextInput
            editable={false}
            style={styles.hiddenField}
          />

          <View style={styles.imageRow}>
            <Pressable
              onPress={handlePickCover}
              style={({ pressed }) => [
                styles.imageButton,
                {
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ImagePlus color={theme.accent} size={18} />
              <Text style={[styles.imageButtonText, { color: theme.textPrimary }]}>
                {coverImage ? 'Change cover' : 'Upload cover'}
              </Text>
            </Pressable>

            {coverImage ? (
              <Pressable
                onPress={() => setCoverImage(null)}
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Trash2 color={theme.textSecondary} size={18} />
              </Pressable>
            ) : null}
          </View>

          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverPreview} />
          ) : null}

          <TextInput
            placeholder="Article body"
            placeholderTextColor={theme.textMuted}
            multiline
            textAlignVertical="top"
            value={body}
            onChangeText={setBody}
            style={[
              styles.input,
              styles.textarea,
              {
                backgroundColor: theme.surfaceAlt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />

          <Pressable
            onPress={handlePublish}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed ? theme.accentPressed : theme.accent,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.surface }]}>
              {isSubmitting ? 'Publishing...' : 'Publish article'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.md,
  },
  hiddenField: {
    height: 0,
    padding: 0,
    margin: 0,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
  },
  textarea: {
    minHeight: 180,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPreview: {
    width: '100%',
    height: 190,
    borderRadius: 22,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
