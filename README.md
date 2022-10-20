# FeatureBased

Application d'aide à la conception de projet informatique basé sur les features du projet.

## Fonctionnalités

- Peut indiquer si une feature dépend d'une autre feature A->B.
- Peut ajouter des questions sur les features.
- Une question peut avoir une discussion.
- Indiquer un élément de discussion comme réponse à la question ou écrire la réponse.
- Visualiser les features sous forme de graph à nœud.
- Recherche d'une feature par text (Regexp).

### Format texte

```markdown
# Feature

> description

## Présentation

## Implique

## Questions
```

### Format typescript

```typescript
interface Data {
  projects: { [id: Project["id"]]: Project };
  features: { [id: Feature["id"]]: Feature };
  questions: { [id: Question["id"]]: Question };
}

interface Project {
  id: string;
  name: string;
  features: Feature["id"][];
}

interface Feature {
  id: string;
  name: string;
  description: string | null;
  presentation: string[];
  implies: Feature["id"][];
  questions: Question["id"][];
}

interface Question {
  id: string;
  content: string;
  discussion: { [timestamp: string]: string }[];
  answer: string | null;
}
```

### Format JSON

```json
{
  "projects": {
    "d66ba447-33e8-4440-a11f-6f7d3ed64519": {
      "id": "d66ba447-33e8-4440-a11f-6f7d3ed64519",
      "name": "Un super projet",
      "features": []
    }
  },
  "features": {
    "472f73cc-e67f-4cc5-b3dc-dbc55a0de7e7": {
      "id": "472f73cc-e67f-4cc5-b3dc-dbc55a0de7e7",
      "name": "Ma super feature 1",
      "description": null,
      "presentation": [],
      "implies": ["49a9152a-c118-440d-8ff7-94e36d94fef4"],
      "questions": ["73401d1c-df69-4153-8e3d-b1dd350ecb95"]
    },
    "49a9152a-c118-440d-8ff7-94e36d94fef4": {
      "id": "49a9152a-c118-440d-8ff7-94e36d94fef4",
      "name": "Ma super feature 2",
      "description": null,
      "presentation": [],
      "implies": [],
      "questions": ["73401d1c-df69-4153-8e3d-b1dd350ecb95"]
    }
  },
  "questions": {
    "73401d1c-df69-4153-8e3d-b1dd350ecb95": {
      "id": "73401d1c-df69-4153-8e3d-b1dd350ecb95",
      "content": "L'utilisateur doit-il être inscrit ?",
      "discussion": {
        "1666274887538": "Tu es sur de ça ?",
        "1666274913362": "Oui certain"
      },
      "answer": "Oui"
    }
  }
}
```
