# 💒 Sistema de Confirmación de Invitaciones - Renata & Sergio

¡Bienvenidos! Este es tu sistema completo de confirmaciones para la boda.

## 📦 Contenido del proyecto

```
proyecto-boda/
├── index.html                    ← Tu página principal (ACTUALIZADA con sección de confirmación)
├── invitaciones.html             ← Página donde los invitados confirman
├── admin.html                    ← Tu panel para ver todas las confirmaciones
├── api/                          ← Azure Functions (backend)
│   ├── mock-data.js             ← Datos de prueba para desarrollo local
│   ├── obtenerInvitacion/
│   ├── confirmarAsistencia/
│   └── obtenerTodasConfirmaciones/
├── staticwebapp.config.json      ← Configuración de Azure
├── switch-mode.sh                ← Script para cambiar dev/prod
├── cargar-invitaciones.js        ← Script para subir familias a Azure
├── DESARROLLO-LOCAL.md           ← Guía detallada de desarrollo
└── README.md                     ← Este archivo
```

## 🚀 INICIO RÁPIDO - Probar en tu Mac

### Paso 1: Instalar herramientas (solo la primera vez)

```bash
# Instalar Node.js
brew install node

# Instalar Azure Functions Core Tools
brew tap azure/functions
brew install azure-functions-core-tools@4

# Instalar Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli
```

### Paso 2: Preparar el proyecto

```bash
# Navegar a la carpeta del proyecto
cd proyecto-boda

# Instalar dependencias de las Azure Functions
cd api
npm install
cd ..

# Crear archivo de configuración local
cp api/local.settings.json.example api/local.settings.json

# Activar modo desarrollo (usa datos de prueba)
chmod +x switch-mode.sh
./switch-mode.sh dev
```

### Paso 3: Iniciar el servidor local

```bash
# Desde la raíz del proyecto
swa start . --api-location api
```

✅ Tu sitio estará en: **http://localhost:4280**

### Paso 4: Probar todo

**Página principal:**
```
http://localhost:4280
```
- Navega hasta la sección "Confirmación"
- Ingresa el código: `FAM001`
- Da clic en "Continuar a Confirmación"

**Códigos de prueba disponibles:**
- `FAM001` - Familia García (2 invitados)
- `FAM002` - Familia López (3 invitados)
- `FAM003` - Familia Martínez (1 invitado)

**Panel de administración:**
```
http://localhost:4280/admin.html
```
Contraseña: `test123`

---

## ☁️ DESPLEGAR EN AZURE

Una vez que todo funcione en local, sigue estos pasos:

### 1️⃣ Crear cuenta de Azure

1. Ve a https://portal.azure.com
2. Crea una cuenta gratuita ($200 USD de crédito gratis)
3. No necesitas tarjeta para el tier gratuito

### 2️⃣ Crear Azure Static Web App

1. En Azure Portal → "Static Web Apps" → "Create"
2. Configuración:
   - **Resource Group**: "boda-renata-sergio"
   - **Name**: "boda-renata-sergio"
   - **Plan**: Free
   - **Region**: Central US
   - **Source**: GitHub
   - **Repository**: Tu repositorio
   - **Branch**: main
   - **Build Presets**: Custom
   - **App location**: `/`
   - **Api location**: `/api`
   - **Output location**: (vacío)

3. Azure tarda 2-3 minutos en crear todo

### 3️⃣ Crear Azure Storage (Base de datos)

1. Azure Portal → "Storage accounts" → "Create"
2. Configuración:
   - **Resource Group**: "boda-renata-sergio" (el mismo)
   - **Storage account name**: "bodarenatasergio" (sin espacios, solo minúsculas)
   - **Region**: Central US (la misma)
   - **Performance**: Standard
   - **Redundancy**: LRS

3. Una vez creado:
   - Ve a "Access keys"
   - Copia el "Connection string"

### 4️⃣ Conectar Storage con Static Web App

1. Ve a tu Static Web App → "Configuration"
2. Clic en "Add" en "Application settings"
3. Añade:

**Variable 1:**
- Name: `AzureWebJobsStorage`
- Value: (pega el connection string)

**Variable 2:**
- Name: `ADMIN_PASSWORD`
- Value: Una contraseña segura (ej: "BodaRenataSergio2026!")

4. Clic en "Save"

### 5️⃣ Subir a GitHub

```bash
# Cambiar a modo producción
./switch-mode.sh prod

# Inicializar Git
git init

# Añadir archivos
git add .
git commit -m "Sistema de confirmaciones Renata & Sergio"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/boda-renata-sergio.git
git branch -M main
git push -u origin main
```

Azure detectará el push y desplegará automáticamente en 2-3 minutos.

### 6️⃣ Cargar tus invitaciones reales

Edita `cargar-invitaciones.js` con tus familias:

```javascript
const familiasReales = [
    {
        codigo: 'FAM001',
        nombreFamilia: 'Familia García',
        email: 'garcia@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Juan García', asiste: null, confirmado: false },
            { id: 2, nombre: 'María García', asiste: null, confirmado: false }
        ]
    },
    // ... más familias
];
```

Luego ejecuta:

```bash
# Configurar connection string (cópialo de Azure)
export AZURE_STORAGE_CONNECTION_STRING="tu_connection_string_aqui"

# Ejecutar script
node cargar-invitaciones.js
```

---

## 📱 ENVIAR INVITACIONES A TUS INVITADOS

Después de cargar las familias, envía por WhatsApp:

```
¡Hola! Renata y Sergio se casan 💒

Estás invitado a nuestra boda el 25 de abril de 2026

Por favor confirma tu asistencia aquí:
https://TU-SITIO.azurestaticapps.net/?codigo=FAM001

¡Nos vemos! 🎉
```

Cada familia tendrá su código único.

---

## 🎯 URLs IMPORTANTES (después del deploy)

- **Sitio principal**: https://boda-renata-sergio.azurestaticapps.net
- **Confirmación**: https://boda-renata-sergio.azurestaticapps.net/?codigo=FAM001
- **Panel Admin**: https://boda-renata-sergio.azurestaticapps.net/admin.html

---

## 💰 COSTOS

Para ~200 invitados:
- Azure Static Web App: **$0** (gratis)
- Azure Functions: **$0** (dentro del límite gratuito)
- Azure Storage: **~$2 USD** para todo el evento
- **TOTAL: ~$2 USD**

---

## 🔧 PERSONALIZACIÓN

### Cambiar familias de prueba (desarrollo local)

Edita `api/mock-data.js`:

```javascript
let invitacionesMock = {
    'FAM001': { ... },
    'FAM004': {  // Nueva familia
        codigo: 'FAM004',
        nombreFamilia: 'Tu Familia',
        email: 'email@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Nombre Completo', asiste: null, confirmado: false }
        ]
    }
};
```

### Cambiar colores o textos

Todos los archivos HTML usan Bootstrap y tus clases personalizadas:
- `bg-beige`, `olivo-regular`, `libre-caslon-display`
- Edita los textos directamente en los archivos HTML

---

## 🆘 PROBLEMAS COMUNES

### Error: "Port 4280 already in use"
```bash
lsof -ti:4280 | xargs kill -9
swa start . --api-location api
```

### No aparecen las familias en admin
```bash
# Verificar que estés en modo dev
./switch-mode.sh dev

# Reiniciar servidor
# Ctrl+C y luego
swa start . --api-location api
```

### Azure Functions no responden
```bash
cd api
npm install
cd ..
swa start . --api-location api
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **DESARROLLO-LOCAL.md**: Guía detallada de desarrollo local
- **README original**: Documentación técnica completa

---

## ✅ CHECKLIST FINAL

Antes de lanzar en producción:

- [ ] Probaste todo en local (index.html, invitaciones.html, admin.html)
- [ ] Los 3 códigos de prueba funcionan
- [ ] Cambiaste a modo prod: `./switch-mode.sh prod`
- [ ] Configuraste las variables en Azure
- [ ] Subiste a GitHub
- [ ] Azure desplegó correctamente
- [ ] Cargaste tus familias reales con `cargar-invitaciones.js`
- [ ] Probaste con un código real
- [ ] El panel admin funciona con tu contraseña nueva

---

## 💕 ¡Felicidades por su boda!

Este sistema les permitirá:
- ✅ Ver quién confirmó en tiempo real
- ✅ Cada familia solo ve sus invitados
- ✅ Exportar todo a Excel
- ✅ Sin costos (casi)
- ✅ Profesional y seguro

**¿Dudas?** Revisa DESARROLLO-LOCAL.md o contacta a tu desarrollador.

---

**Renata & Sergio - 25 de abril 2026** 💒
