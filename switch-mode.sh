#!/bin/bash
# Script para cambiar entre modo desarrollo (mock data) y producción (Azure Storage)

MODE=$1

if [ "$MODE" = "dev" ]; then
    echo "🔧 Cambiando a modo DESARROLLO (mock data)..."
    
    # Renombrar archivos de producción
    mv api/obtenerInvitacion/index.js api/obtenerInvitacion/index-prod.js 2>/dev/null || true
    mv api/confirmarAsistencia/index.js api/confirmarAsistencia/index-prod.js 2>/dev/null || true
    mv api/obtenerTodasConfirmaciones/index.js api/obtenerTodasConfirmaciones/index-prod.js 2>/dev/null || true
    
    # Usar archivos de desarrollo
    cp api/obtenerInvitacion/index-dev.js api/obtenerInvitacion/index.js
    cp api/confirmarAsistencia/index-dev.js api/confirmarAsistencia/index.js
    cp api/obtenerTodasConfirmaciones/index-dev.js api/obtenerTodasConfirmaciones/index.js
    
    echo "✅ Modo desarrollo activado - usando mock data"
    echo "📝 Familias de prueba disponibles: FAM001, FAM002, FAM003"
    
elif [ "$MODE" = "prod" ]; then
    echo "☁️ Cambiando a modo PRODUCCIÓN (Azure Storage)..."
    
    # Restaurar archivos de producción
    mv api/obtenerInvitacion/index-prod.js api/obtenerInvitacion/index.js 2>/dev/null || true
    mv api/confirmarAsistencia/index-prod.js api/confirmarAsistencia/index.js 2>/dev/null || true
    mv api/obtenerTodasConfirmaciones/index-prod.js api/obtenerTodasConfirmaciones/index.js 2>/dev/null || true
    
    echo "✅ Modo producción activado - usando Azure Storage"
    
else
    echo "❌ Uso: ./switch-mode.sh [dev|prod]"
    echo ""
    echo "Ejemplos:"
    echo "  ./switch-mode.sh dev   - Activar modo desarrollo"
    echo "  ./switch-mode.sh prod  - Activar modo producción"
fi
