import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MessageSquareText, PencilLine } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function CommentList({ comments, onSubmit, theme }) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const isSubmitted = await onSubmit({ author, text });
    setIsSubmitting(false);

    if (!isSubmitted) {
      return;
    }

    setAuthor('');
    setText('');
    setIsComposerOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <MessageSquareText color={theme.textPrimary} size={18} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>Comments</Text>
        </View>

        <Pressable
          onPress={() => setIsComposerOpen((currentValue) => !currentValue)}
          style={({ pressed }) => [
            styles.composeButton,
            {
              backgroundColor: theme.surfaceAlt,
              borderColor: theme.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          disabled={isSubmitting}
        >
          <PencilLine color={theme.accent} size={16} />
          <Text style={[styles.composeText, { color: theme.textPrimary }]}>
            {isComposerOpen ? 'Hide' : 'Write'}
          </Text>
        </Pressable>
      </View>

      {isComposerOpen ? (
        <View style={[styles.commentCard, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={[styles.author, { color: theme.textPrimary }]}>Write a comment</Text>
          <TextInput
            placeholder="Your name"
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            placeholder="Share your thoughts"
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              styles.textarea,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
          />
          <View style={styles.actions}>
            <Pressable
              onPress={() => setIsComposerOpen(false)}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              disabled={isSubmitting}
            >
              <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: pressed ? theme.accentPressed : theme.accent,
                  opacity: isSubmitting ? 0.7 : 1,
                },
              ]}
              disabled={isSubmitting}
            >
              <Text style={[styles.primaryText, { color: theme.surface }]}>
                {isSubmitting ? 'Posting...' : 'Post'}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {comments.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            No comments yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Be the first reader to leave feedback under this article.
          </Text>
        </View>
      ) : null}

      {comments.map((comment) => (
        <View
          key={comment.id}
          style={[styles.commentCard, { backgroundColor: theme.surfaceAlt }]}
        >
          <Text style={[styles.author, { color: theme.textPrimary }]}>{comment.author}</Text>
          <Text style={[styles.text, { color: theme.textSecondary }]}>{comment.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  composeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: spacing.lg,
    borderRadius: 20,
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentCard: {
    padding: spacing.lg,
    borderRadius: 20,
    gap: spacing.xs,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    fontSize: 15,
    marginTop: spacing.sm,
  },
  textarea: {
    minHeight: 110,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  primaryButton: {
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  author: {
    fontSize: 15,
    fontWeight: '700',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
