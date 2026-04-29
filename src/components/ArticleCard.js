import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clock3 } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function ArticleCard({ article, onPress, theme }) {
  const hasCover = Boolean(article.coverImage);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
    >
      {hasCover ? (
        <Image source={{ uri: article.coverImage }} style={styles.cover} />
      ) : null}
      <View style={styles.body}>
        {article.category ? (
          <Text style={[styles.category, { color: theme.accent }]}>{article.category}</Text>
        ) : null}
        <Text style={[styles.title, { color: theme.textPrimary }]}>{article.title}</Text>
        <Text style={[styles.preview, { color: theme.textSecondary }]} numberOfLines={3}>
          {article.preview}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.author, { color: theme.textMuted }]}>{article.author}</Text>
          <View style={styles.readTime}>
            <Clock3 size={14} color={theme.textMuted} />
            <Text style={[styles.author, { color: theme.textMuted }]}>{article.readTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cover: {
    width: '100%',
    height: 200,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  preview: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    fontWeight: '500',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
