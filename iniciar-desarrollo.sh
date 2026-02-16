#!/bin/bash
# 🚀 INICIO RÁPIDO - Boda Renata & Sergio

echo "💒 Sistema de Confirmaciones - Renata & Sergio"
echo "=============================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instala con: brew install node"
    exit 1
fi
echo "✅ Node.js instalado: $(node --version)"

# Verificar Azure Functions Core Tools
if ! command -v func &> /dev/null; then
    echo "❌ Azure Functions Core Tools no instaladas"
    echo "   Instala con:"
    echo "   brew tap azure/functions"
    echo "   brew install azure-functions-core-tools@4"
    exit 1
fi
echo "✅ Azure Functions Core Tools instaladas"

# Verificar Static Web Apps CLI
if ! command -v swa &> /dev/null; then
    echo "❌ Azure Static Web Apps CLI no instalada"
    echo "   Instala con: npm install -g @azure/static-web-apps-cli"
    exit 1
fi
echo "✅ Azure Static Web Apps CLI instalada"

echo ""
echo "📦 Instalando dependencias..."
cd api
npm install
cd ..

echo ""
echo "⚙️ Configurando proyecto..."

# Crear local.settings.json si no existe
if [ ! -f "api/local.settings.json" ]; then
    cp api/local.settings.json.example api/local.settings.json
    echo "✅ Archivo local.settings.json creado"
else
    echo "ℹ️  local.settings.json ya existe"
fi

# Activar modo desarrollo
chmod +x switch-mode.sh
./switch-mode.sh dev

echo ""
echo "=============================================="
echo "✨ ¡TODO LISTO!"
echo "=============================================="
echo ""
echo "Para iniciar el servidor local ejecuta:"
echo ""
echo "  swa start . --api-location api"
echo ""
echo "Luego abre en tu navegador:"
echo "  http://localhost:4280"
echo ""
echo "Códigos de prueba:"
echo "  FAM001 - Familia García (2 invitados)"
echo "  FAM002 - Familia López (3 invitados)"
echo "  FAM003 - Familia Martínez (1 invitado)"
echo ""
echo "Panel admin:"
echo "  http://localhost:4280/admin.html"
echo "  Contraseña: test123"
echo ""
echo "=============================================="
