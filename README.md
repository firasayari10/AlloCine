# Cinema Collection

Application web de gestion de films developpee avec Angular. Elle permet aux utilisateurs de parcourir, ajouter, modifier et supprimer des films, ainsi que de laisser des avis et notes.

---

## Table des matieres

1. [Description du projet](#description-du-projet)
2. [Fonctionnalites](#fonctionnalites)
3. [Technologies utilisees](#technologies-utilisees)
4. [Pre-requis](#pre-requis)
5. [Installation](#installation)
6. [Lancement de l'application](#lancement-de-lapplication)
7. [Structure du projet](#structure-du-projet)
8. [Configuration](#configuration)
9. [API Endpoints](#api-endpoints)

---

## Description du projet

Cinema Collection est une application Angular permettant de gerer une collection de films. Les utilisateurs peuvent creer un compte, se connecter, parcourir les films populaires via l'API TMDB, ajouter leurs propres films a la base de donnees locale, et laisser des avis avec des notes.

L'application dispose d'un systeme d'authentification complet avec reinitialisation de mot de passe par email, un tableau de bord administrateur avec des statistiques, et un support bilingue francais/anglais.

---

## Fonctionnalites

### Gestion des films
- Affichage de la liste des films avec pagination
- Recherche de films par titre
- Ajout de nouveaux films avec upload d'image
- Modification et suppression de films existants
- Details complets de chaque film (synopsis, acteurs, note)

### Authentification
- Inscription avec validation de mot de passe (8 caracteres, majuscule, chiffre)
- Connexion et deconnexion
- Reinitialisation de mot de passe par email (via EmailJS)
- Protection des routes avec guards Angular

### Avis et notes
- Systeme de notation par etoiles (1-5)
- Ajout de commentaires sur les films
- Visualisation de ses propres avis
- Note moyenne calculee automatiquement

### Interface utilisateur
- Theme sombre et clair avec basculement
- Design responsive (mobile, tablette, desktop)
- Animations de transition entre les pages
- Notifications toast pour les actions
- Support bilingue francais/anglais

### Administration
- Tableau de bord avec statistiques
- Graphiques des genres de films
- Liste des derniers avis
- Gestion des utilisateurs

---

## Technologies utilisees

| Categorie | Technologie |
|-----------|-------------|
| Framework | Angular 20 |
| Langage | TypeScript |
| Styles | SCSS |
| API Films | TMDB (The Movie Database) |
| Backend Mock | JSON Server |
| Emails | EmailJS |
| Icones | Bootstrap Icons |
| Notifications | ngx-sonner |
| Graphiques | Chart.js |

---

## Pre-requis

Avant de commencer, assurez-vous d'avoir installe :

- Node.js (version 18 ou superieure)
- npm (installe avec Node.js)
- Angular CLI (version 20)

Pour verifier les versions installees :

```bash
node --version
npm --version
ng version
```

Si Angular CLI n'est pas installe :

```bash
npm install -g @angular/cli
```

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repository>
cd first_angular_project
```

### 2. Installer les dependances

```bash
npm install
```

### 3. Installer JSON Server (backend mock)

```bash
npm install -g json-server
```

### 4. Creer le fichier de base de donnees

Creer un fichier `db.json` a la racine du projet avec le contenu suivant :

```json
{
  "movies": [],
  "users": [],
  "reviews": []
}
```

---

## Lancement de l'application

### 1. Demarrer le serveur backend (JSON Server)

Dans un premier terminal :

```bash
json-server --watch db.json --port 8080
```

Le serveur backend sera accessible sur : http://localhost:8080

### 2. Demarrer l'application Angular

Dans un second terminal :

```bash
ng serve
```

L'application sera accessible sur : http://localhost:4200

### Commande combinee (optionnel)

Vous pouvez lancer les deux en parallele avec :

```bash
npm run start
```

Note : Vous devrez toujours lancer JSON Server separement.

---

## Structure du projet

```
src/
├── app/
│   ├── add-movie/          # Composant ajout de film
│   ├── admin/              # Tableau de bord administrateur
│   ├── auth/               # Authentification
│   │   ├── login/          # Page de connexion
│   │   ├── register/       # Page d'inscription
│   │   ├── forgot-password/# Mot de passe oublie
│   │   └── reset-password/ # Reinitialisation mot de passe
│   ├── footer/             # Pied de page
│   ├── guards/             # Guards de protection des routes
│   ├── home/               # Page d'accueil
│   │   └── movie-card/     # Carte de film
│   ├── interceptors/       # Intercepteurs HTTP
│   ├── models/             # Interfaces TypeScript
│   ├── movie-detail/       # Details d'un film
│   ├── movies-list/        # Liste des films
│   ├── my-reviews/         # Mes avis
│   ├── navbar/             # Barre de navigation
│   ├── profile/            # Page de profil
│   ├── services/           # Services Angular
│   │   ├── auth.service.ts       # Authentification
│   │   ├── email.service.ts      # Envoi d'emails
│   │   ├── movies-api.ts         # API films locale
│   │   ├── theme.service.ts      # Gestion du theme
│   │   ├── tmdb.service.ts       # API TMDB
│   │   └── translation.service.ts# Traductions
│   ├── sidebar/            # Menu lateral
│   └── update-movie/       # Modification de film
├── environments/           # Configuration par environnement
├── assets/                 # Images et ressources statiques
└── styles.scss             # Styles globaux
```

---

## Configuration

### Configuration de l'API TMDB

L'application utilise l'API TMDB pour recuperer les informations des films populaires. Les cles API sont configurees dans :

```
src/environments/environment.ts
```

### Configuration de EmailJS (optionnel)

Pour activer l'envoi d'emails de reinitialisation de mot de passe :

1. Creer un compte sur https://www.emailjs.com/
2. Ajouter un service email (Gmail, Outlook, etc.)
3. Creer un template d'email avec les variables : to_email, to_name, subject, message, reset_link
4. Completer les informations dans `environment.ts` :

```typescript
emailjs: {
  serviceId: 'votre_service_id',
  templateId: 'votre_template_id',
  publicKey: 'votre_public_key'
}
```

---

## API Endpoints

### JSON Server (localhost:8080)

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | /movies | Liste tous les films |
| GET | /movies/:id | Recupere un film par ID |
| POST | /movies | Ajoute un nouveau film |
| PUT | /movies/:id | Modifie un film |
| DELETE | /movies/:id | Supprime un film |
| GET | /users | Liste tous les utilisateurs |
| GET | /users/byEmail/:email | Recupere un utilisateur par email |
| POST | /users | Cree un nouvel utilisateur |
| PUT | /users/:id | Modifie un utilisateur |
| GET | /reviews | Liste tous les avis |
| GET | /reviews?movieId=:id | Avis d'un film specifique |
| POST | /reviews | Ajoute un avis |
| DELETE | /reviews/:id | Supprime un avis |

### TMDB API

| Endpoint | Description |
|----------|-------------|
| /movie/popular | Films populaires |
| /movie/top_rated | Films les mieux notes |
| /movie/upcoming | Films a venir |
| /movie/:id | Details d'un film |
| /movie/:id/credits | Casting d'un film |
| /search/movie | Recherche de films |

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'application en mode developpement |
| `npm run build` | Compile l'application pour la production |
| `npm test` | Execute les tests unitaires |
| `npm run watch` | Compile en mode watch |

---

## Auteur

Projet developpe dans le cadre d'un apprentissage Angular.

---

## Licence

Ce projet est a usage educatif.
