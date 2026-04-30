import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Clock3, Share2 } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function ArticleCard({ article, onPress, onShare, theme }) {
  const hasCover = Boolean(article.coverImage);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.shadow,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
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
          <View style={styles.footerActions}>
            <View style={styles.readTime}>
              <Clock3 size={14} color={theme.textMuted} />
              <Text style={[styles.author, { color: theme.textMuted }]}>{article.readTime}</Text>
            </View>
            <Pressable
              accessibilityLabel={`Share ${article.title}`}
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                onShare?.(article);
              }}
              style={({ pressed }) => [
                styles.shareButton,
                {
                  backgroundColor: theme.surfaceAlt,
                  opacity: pressed ? 0.72 : 1,
                },
              ]}
            >
              <Share2 size={16} color={theme.textPrimary} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
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
    gap: spacing.md,
  },
  author: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shareButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
