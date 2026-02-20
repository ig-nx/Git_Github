━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 INICIAR PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git init
→ crea un repositorio Git en la carpeta

git clone URL
→ copia un repositorio existente


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 ESTADO Y CAMBIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git status
→ muestra qué archivos cambiaron

git diff
→ muestra cambios no guardados


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 STAGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git add archivo.txt
→ agrega un archivo al staging

git add .
→ agrega todos los cambios


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 GUARDAR (COMMIT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git commit -m "mensaje"
→ guarda los cambios en historial

git commit
→ abre editor para mensaje


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📜 HISTORIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git log
→ historial completo

git log --oneline
→ historial corto

git show
→ ver último commit


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏪ VOLVER ATRÁS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git checkout hash
→ ver versión vieja

git switch master
→ volver al presente

git restore archivo.txt
→ deshacer cambios


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 RAMAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git branch
→ ver ramas

git branch nueva
→ crear rama

git switch nueva
→ cambiar de rama


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☁️ GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git remote add origin URL
→ conectar repositorio

git push -u origin master
→ subir cambios

git pull
→ bajar cambios