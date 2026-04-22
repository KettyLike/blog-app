import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, UserPlus } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function LoginScreen({ onLogin, onRegister, theme }) {
  const [mode, setMode] = useState('login');
  const isRegisterMode = mode === 'register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('maria@example.com');
  const [password, setPassword] = useState('12345678');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        Alert.alert('Incomplete form', 'Name, email, and password are required.');
        return;
      }

      setIsSubmitting(true);
      const isRegistered = await onRegister({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        bio: bio.trim(),
      });
      setIsSubmitting(false);

      if (!isRegistered) {
        Alert.alert(
          'Registration failed',
          'This email may already be in use. Check the backend server and try again.'
        );
      }

      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Incomplete form', 'Enter email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    const isLoggedIn = await onLogin({
      email: email.trim(),
      password: password.trim(),
    });
    setIsSubmitting(false);

    if (!isLoggedIn) {
      Alert.alert('Login failed', 'Check the backend server and demo credentials.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={[styles.badge, { backgroundColor: theme.surfaceAlt }]}>
          {isRegisterMode ? (
            <UserPlus color={theme.accent} size={22} />
          ) : (
            <LogIn color={theme.accent} size={22} />
          )}
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {isRegisterMode ? 'Create account' : 'Welcome back'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isRegisterMode
            ? 'Register a new demo account to publish articles and comment from your profile.'
            : 'Demo login to open the blog dashboard, write articles, and manage your profile.'}
        </Text>
        {!isRegisterMode ? (
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Demo: `maria@example.com` / `12345678`
          </Text>
        ) : null}

        {isRegisterMode ? (
          <>
            <TextInput
              placeholder="Name"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
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
              placeholder="Bio (optional)"
              placeholderTextColor={theme.textMuted}
              value={bio}
              onChangeText={setBio}
              style={[
                styles.input,
                {
                  backgroundColor: theme.surfaceAlt,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
            />
          </>
        ) : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
          placeholder="Password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            {
              backgroundColor: theme.surfaceAlt,
              color: theme.textPrimary,
              borderColor: theme.border,
            },
          ]}
        />

        <Pressable
          onPress={handleSubmit}
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
            {isSubmitting
              ? isRegisterMode
                ? 'Creating...'
                : 'Signing in...'
              : isRegisterMode
                ? 'Create account'
                : 'Sign in'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode(isRegisterMode ? 'login' : 'register')}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.linkButton,
            {
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: 28,
    padding: spacing.xl,
    gap: spacing.md,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  hint: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
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
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
