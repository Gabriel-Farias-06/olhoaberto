#!/usr/bin/env bash

# deploy.sh - Script para subir containers, buildar o app e executar em background
# Uso: bash deploy.sh

set -e

echo "🌐 Executando docker-compose up -d..."
docker compose up -d

echo "✅ Containers iniciados."

echo "🔨 Executando npm run build..."
cd olhoabertofrontend
npm run build

echo "✅ Build concluído."

echo "🚀 Iniciando npm start com nohup..."
nohup npm start > nohup.out 2>&1 &

echo "✅ Aplicação iniciada em background. Processo nohup registrado (ver nohup.out)."
