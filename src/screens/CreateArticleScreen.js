import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilePenLine } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function CreateArticleScreen({ currentUser, navigation, onCreateArticle, theme }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || !category.trim() || !body.trim()) {
      Alert.alert('Incomplete form', 'Title, category, and article body are required.');
      return;
    }

    setIsSubmitting(true);
    const isCreated = await onCreateArticle({
      title: title.trim(),
      category: category.trim(),
      coverImage: coverImage.trim(),
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
    setCoverImage('');
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
            Publish a new post as {currentUser.name}. The backend will add it to the shared feed.
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
            placeholder="Category"
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
            placeholder="Cover image URL (optional)"
            placeholderTextColor={theme.textMuted}
            value={coverImage}
            onChangeText={setCoverImage}
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
