# Audit RGAA 4.1.2 — portfolio Mathis Certenais

**Date :** 22 octobre 2026
**Référentiel :** RGAA 4.1.2 (106 critères, 13 thématiques), source officielle DINUM.
**Périmètre :** 10 routes canoniques (FR/EN), thèmes clair et sombre, desktop et mobile, états vidéo (modale, article).
**Méthode :** axe-core (WCAG 2.1 A/AA), validateur HTML Nu (vnu), scripts Playwright (structure, clavier, reflow, 200 %, espacement, sans CSS) et vérifications manuelles.

## Résultat

| Statut | Critères |
| --- | ---: |
| Conformes (C) | 77 |
| Non conformes (NC) | 0 |
| Non applicables (NA) | 27 |
| À vérifier | 2 |
| **Applicables (C + NC + à vérifier)** | **79** |
| **Taux de conformité (C / applicables)** | **97,5 %** |
| Taux sur les critères évalués (C / (C + NC)) | **100 %** |
| Couverture (applicables / 106) | 74,5 % |

Les 2 critères en attente sont **4.5 et 4.6** (audiodescription synchronisée des médias pré-enregistrés) : l'audiodescription des diapositives du webinaire doit être validée ou déclarée non nécessaire.

## Détail par thématique

| Thème | C | NC | NA | À vérifier |
| --- | ---: | ---: | ---: | ---: |
| 1. Images | 6 | 0 | 3 | 0 |
| 2. Cadres | 2 | 0 | 0 | 0 |
| 3. Couleurs | 3 | 0 | 0 | 0 |
| 4. Multimédia | 7 | 0 | 4 | 2 |
| 5. Tableaux | 0 | 0 | 8 | 0 |
| 6. Liens | 2 | 0 | 0 | 0 |
| 7. Scripts | 5 | 0 | 0 | 0 |
| 8. Éléments obligatoires | 9 | 0 | 1 | 0 |
| 9. Structuration | 4 | 0 | 0 | 0 |
| 10. Présentation | 14 | 0 | 0 | 0 |
| 11. Formulaires | 8 | 0 | 5 | 0 |
| 12. Navigation | 8 | 0 | 3 | 0 |
| 13. Consultation | 9 | 0 | 3 | 0 |
| **Total** | **77** | **0** | **27** | **2** |

## Critères non applicables (27)

1.4, 1.5, 1.8 (CAPTCHA et images texte), 4.8 à 4.10 et 4.12 (médias non temporels),
5.1 à 5.8 (aucun tableau), 8.10 (aucun changement de sens de lecture),
11.5 à 11.8 et 11.12 (aucun regroupement de champs ni liste de choix, pas de modification de données),
12.3 à 12.5 (pas de plan du site ni de moteur de recherche),
13.4 à 13.6 (aucun document bureautique en téléchargement, aucun contenu cryptique).

## Preuves principales

- **axe-core : 0 violation** sur les routes auditées, dans les deux thèmes et aux deux viewports.
- **Validateur Nu : 0 erreur** sur les pages validées (index, contact, accessibilité, recherche, deux articles, contact FR).
- **Contraste AA** vérifié dans les deux thèmes, y compris les composants d'interface (bordure des champs).
- **Reflow** : aucun débordement horizontal à 320 px, 200 % de texte ni avec l'espacement WCAG.
- **Clavier / lecteur d'écran** : skip-link, `aria-current` FR/EN, focus rendu au déclencheur après fermeture des dialogues, formulaire annoncé (`aria-invalid`, `aria-describedby`).
- **Formulaires** : étiquettes, obligatoires indiqués, erreurs en ligne, suggestion email, `autocomplete`.
- **Vidéos** : sous-titres et transcriptions (entretien, hackathon, webinaire), alternative textuelle pour la démo MCP muette, CC natif PeerTube.
- **Sans CSS** : aucune perte de contenu sur 8 routes.

## Validation humaine restante

- Audiodescription du webinaire (critères 4.5 et 4.6) : à valider ou déclarer non nécessaire.
- Session réelle avec lecteur d'écran (VoiceOver, NVDA) : l'arbre d'accessibilité et le clavier ont été testés, mais une session vocale réelle reste recommandée.
- Relecture finale de la transcription du webinaire (noms propres et termes techniques déjà corrigés).
