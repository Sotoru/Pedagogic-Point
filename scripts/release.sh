#!/usr/bin/env bash
# Release semver in un comando: accorpa il bump nell'ultimo commit di develop
# (force-with-lease), poi UN solo commit "vX.Y.Z" (snapshot dell'albero di
# develop) su main + tag, push atomico, GitHub Release.
# Uso: npm run release:patch|minor|major
set -euo pipefail

LEVEL="${1:?uso: patch|minor|major}"
DEV=develop; MAIN=main

# --- guardie: aborta prima di toccare qualsiasi cosa ---
[ "$(git branch --show-current)" = "$DEV" ] || { echo "✗ non sei su $DEV"; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "✗ working tree sporco"; exit 1; }
git fetch -q origin
[ "$(git rev-parse @)" = "$(git rev-parse @{u})" ] || { echo "✗ $DEV non allineato con origin"; exit 1; }

# rete di sicurezza (build fa codegen token + type-check)
npm run lint
npm run build

# --- nuova versione (da package.json) e tag libero ---
TAG=$(npm version "$LEVEL" --no-git-tag-version | tail -1)   # vX.Y.Z; aggiorna package.json + lock, no commit/tag
if git rev-parse "$TAG" >/dev/null 2>&1 || git ls-remote --exit-code --tags origin "$TAG" >/dev/null 2>&1; then
  git checkout -- package.json package-lock.json
  echo "✗ il tag $TAG esiste già"; exit 1
fi

# --- bump accorpato nell'ultimo commit di develop; main = UN commit con l'albero di develop ---
git commit -aq --amend --no-edit          # accorpa il bump nell'ultimo commit (riscrive develop)
NEW=$(git commit-tree "$DEV^{tree}" -p "$(git rev-parse origin/$MAIN)" -m "$TAG")
git branch -f "$MAIN" "$NEW"
git tag -a "$TAG" -m "$TAG" "$NEW"
# ponytail: nessun rollback automatico se il push fallisce (caso raro di rete); in tal caso:
#           git tag -d $TAG && git branch -f main origin/main && git reset --hard origin/develop

# push atomico dei due branch + tag: o tutto o niente (develop riscritto -> force-with-lease)
git push --atomic --force-with-lease=refs/heads/$DEV -q origin "$DEV" "$MAIN" "refs/tags/$TAG"

# --- GitHub Release per ultima: se gh non è autenticato il resto è già consistente ---
gh release create "$TAG" --generate-notes --title "$TAG" || {
  echo "⚠ push ok ma 'gh release' fallita (fai 'gh auth login')."
  echo "  Poi: gh release create $TAG --generate-notes"
}
echo "✓ release $TAG completata (resti su $DEV)"
