import { StyleSheet, Text, View } from 'react-native';
import { MessageSquareText } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function CommentList({ comments, theme }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <MessageSquareText color={theme.textPrimary} size={18} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>Comments</Text>
      </View>

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
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  commentCard: {
    padding: spacing.lg,
    borderRadius: 20,
    gap: spacing.xs,
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
