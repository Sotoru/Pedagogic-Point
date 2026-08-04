#!/usr/bin/env bash
# Release semver in un comando: accorpa il bump nell'ultimo commit di develop
# (force-with-lease), poi UN commit di merge "vX.Y.Z" (albero di develop, secondo
# parent = develop) su main + tag, push atomico, GitHub Release.
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
# I contrasti dei token non li vede nessun linter: check:contrast è istantaneo e
# senza dipendenze, quindi sta nel cancello. check:a11y no, di proposito: pretende
# chromium e il DB raggiungibili, e farebbe fallire il rilascio per un motivo
# ambientale invece che per un difetto (si lancia a mano). Vedi ADR 0011.
npm run check:contrast

# --- nuova versione (da package.json) e tag libero ---
TAG=$(npm version "$LEVEL" --no-git-tag-version | tail -1)   # vX.Y.Z; aggiorna package.json + lock, no commit/tag
if git rev-parse "$TAG" >/dev/null 2>&1 || git ls-remote --exit-code --tags origin "$TAG" >/dev/null 2>&1; then
  git checkout -- package.json package-lock.json
  echo "✗ il tag $TAG esiste già"; exit 1
fi

# --- bump accorpato nell'ultimo commit di develop; main = UN commit di merge ---
git commit -aq --amend --no-edit          # accorpa il bump nell'ultimo commit (riscrive develop)
# Due parent: il primo è main (così `git log --first-parent main` resta il log dei
# soli rilasci, uno per versione), il secondo è develop, che rende la sua storia
# granulare raggiungibile da main invece di perderla. L'albero resta esattamente
# quello di develop, e restiamo su develop senza fare checkout di main. Si continua
# a usare commit-tree e non `git merge --no-ff` per evitare i conflitti-fantasma dei
# merge-base obsoleti nei rilasci ripetuti. Vedi ADR 0007.
NEW=$(git commit-tree "$DEV^{tree}" \
  -p "$(git rev-parse "origin/$MAIN")" \
  -p "$(git rev-parse "$DEV")" \
  -m "$TAG")
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
