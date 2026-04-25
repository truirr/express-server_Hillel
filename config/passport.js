import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const users = [];

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      const user = users.find(
        (item) => item.email === email && item.password === password
      );

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((item) => item.id === id);

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
});

export function addUser(email, password) {
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return null;
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
  };

  users.push(newUser);
  return newUser;
}

export default passport;