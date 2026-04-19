import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleUserRound, LogOut } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function ProfileScreen({ currentUser, onLogout, theme }) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: theme.surfaceAlt }]}>
          <CircleUserRound color={theme.accent} size={28} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{currentUser.name}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{currentUser.email}</Text>
          <Text style={[styles.bio, { color: theme.textSecondary }]}>{currentUser.bio}</Text>

          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: theme.textMuted }]}>Role</Text>
            <Text style={[styles.metaValue, { color: theme.textPrimary }]}>{currentUser.role}</Text>
          </View>
        </View>

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? theme.accentPressed : theme.accent,
            },
          ]}
        >
          <LogOut color={theme.surface} size={18} />
          <Text style={[styles.buttonText, { color: theme.surface }]}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
  },
  email: {
    fontSize: 15,
    lineHeight: 22,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  metaRow: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
