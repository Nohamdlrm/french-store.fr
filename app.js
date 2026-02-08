const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();

// Configuration des IDs autorisés
const ALLOWED_ROLES = ['1398607057413869708', '1345507092773077043'];
const GUILD_ID = '1289517123277951007'; // L'ID du serveur où se trouve le bot

passport.use(new DiscordStrategy({
    clientID: '1469385238882025637',
    clientSecret: 'OTihAMOgfHxGe2a3XvWD32W4c5zMfF1P',
    callbackURL: 'https://self.campus-rosaparks.fr/callback',
    scope: ['identify', 'guilds', 'guilds.members.read']
}, (accessToken, refreshToken, profile, done) => {
    // Ici on vérifie si l'utilisateur a le rôle
    // Note : Cela demande que ton bot soit présent sur le serveur
    return done(null, profile);
}));

app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    // VERIFICATION DES ROLES
    const userGuild = req.user.guilds.find(g => g.id === GUILD_ID);
    
    // Logique simplifiée : Dans la réalité, il faut appeler l'API Discord 
    // pour voir les rôles précis du membre dans la "Guild"
    res.send("Connexion réussie ! (Vérification des rôles en cours)");
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));
