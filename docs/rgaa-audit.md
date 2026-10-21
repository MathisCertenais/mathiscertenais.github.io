# Audit RGAA 4.1 — portfolio Mathis Certenais

**Date :** 22 octobre 2026
**Périmètre :** 10 routes canoniques (FR/EN), thèmes clair et sombre, desktop et mobile, plus les états vidéo (modale, article).
**Méthode :** axe-core (WCAG 2.1 A/AA), scripts Playwright (structure, clavier, reflow, texte à 200 %, espacement du texte) et vérifications manuelles ciblées.

## Résultat synthétique

- **axe-core : 0 violation** sur les routes auditées, dans les deux thèmes et aux deux viewports.
- **Aucun débordement horizontal** à 320 px, à 200 % de texte, ni avec les réglages d'espacement WCAG.
- **Contraste AA** vérifié dans les deux thèmes (texte, liens, boutons, états du formulaire).
- **Structure :** un seul `h1` par page, aucune rupture de niveau, landmarks étiquetés, `lang` correct.
- **Navigation :** lien d'évitement, `aria-current` sur la page courante (FR/EN), ordre de tabulation logique, gestion du focus dans les menus et dialogues.
- **Formulaires :** étiquettes associées, champs obligatoires indiqués, erreurs en ligne avec `aria-invalid` / `aria-describedby`, focus sur le premier champ invalide, suggestion pour l'email.
- **Vidéos :** sous-titres (interview, hackathon), transcription (démo MCP muette), sous-titres natifs PeerTube (webinaire).
- **Liens `target="_blank"` :** avertissement textuel pour les lecteurs d'écran.

## Scorecard par thème

| Thème | Statut | Preuves / réserves |
| --- | --- | --- |
| 1. Images | Conforme (périmètre) | `alt` présents, images décoratives `alt=""`, SVG `aria-hidden` |
| 2. Cadres | Conforme | `iframe` avec `title` |
| 3. Couleurs | Conforme | contraste AA des tokens, information non portée par la couleur seule |
| 4. Multimédia | Partiel | sous-titres/transcriptions ; le webinaire dépend des CC PeerTube ; relecture de la transcription en cours |
| 5. Tableaux | Non applicable | aucun tableau de données |
| 6. Liens | Conforme | liens explicites et cohérents, avertissement nouvel onglet (13.2) |
| 7. Scripts | Conforme (périmètre) | clavier, pas de piège, focus géré, changements d'état annoncés |
| 8. Éléments obligatoires | Conforme | doctype, `lang`, `title`, charset, identifiants uniques |
| 9. Structuration | Conforme | titres, landmarks, listes |
| 10. Présentation | Conforme (périmètre) | reflow, 200 %, espacement du texte, focus visible ; page sans CSS non testée |
| 11. Formulaires | Conforme (périmètre) | étiquettes, obligatoires, erreurs en ligne, suggestion email |
| 12. Navigation | Conforme | deux systèmes de navigation, lien d'évitement, `aria-current`, ordre logique |
| 13. Consultation | Partiel | 13.2 fait ; zoom navigateur 200 % et lecteur d'écran à valider |

## Taux de conformité

Sur les critères **effectivement évalués**, aucune non-conformité n'a été détectée. Le taux de conformité sur les 106 critères du RGAA ne peut pas être annoncé tant que les tests manuels restants n'ont pas été réalisés. Il s'agit donc d'un **audit partiel**, pas d'une certification.

## Tests manuels restants

1. Revue complète avec lecteur d'écran (VoiceOver, NVDA) sur les parcours principaux.
2. Zoom navigateur à 200 % (au-delà du test de taille de police).
3. Page sans CSS.
4. Relecture de la transcription du webinaire et validation des contenus tiers (PeerTube).
