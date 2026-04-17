import { Image, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/spacing';

export default function ContentRenderer({ content, theme }) {
  return (
    <View style={styles.wrapper}>
      {content.map((block) => {
        if (block.type === 'heading') {
          return (
            <Text key={block.id} style={[styles.heading, { color: theme.textPrimary }]}>
              {block.text}
            </Text>
          );
        }

        if (block.type === 'image') {
          return <Image key={block.id} source={{ uri: block.url }} style={styles.image} />;
        }

        return (
          <Text key={block.id} style={[styles.paragraph, { color: theme.textSecondary }]}>
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginTop: spacing.sm,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 22,
  },
});
