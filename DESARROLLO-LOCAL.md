# 🖥️ Guía de Desarrollo Local en Mac

Esta guía te permite probar todo el sistema en tu Mac antes de subirlo a Azure.

## 📋 Requisitos Previos

### 1. Instalar Node.js
```bash
# Verificar si ya lo tienes
node --version

# Si no lo tienes, instalar con Homebrew
brew install node
```

### 2. Instalar Azure Functions Core Tools
```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

### 3. Instalar Azure Static Web Apps CLI
```bash
npm install -g @azure/static-web-apps-cli
```

---

## 🚀 Configuración Inicial

### 1. Instalar dependencias del proyecto
```bash
cd tu-proyecto-boda
cd api
npm install
cd ..
```

### 2. Preparar archivos para desarrollo local

Copia estos archivos a tu proyecto:

**`api/mock-data.js`** - Base de datos simulada
**`api/obtenerInvitacion/index-dev.js`** - Versión desarrollo
**`api/confirmarAsistencia/index-dev.js`** - Versión desarrollo
**`api/obtenerTodasConfirmaciones/index-dev.js`** - Versión desarrollo
**`switch-mode.sh`** - Script para cambiar entre dev/prod

### 3. Crear archivo de configuración local

Crea `api/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ADMIN_PASSWORD": "test123"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*"
  }
}
```

### 4. Activar modo desarrollo
```bash
# Dar permisos al script
chmod +x switch-mode.sh

# Activar modo desarrollo
./switch-mode.sh dev
```

---

## ▶️ Iniciar el servidor local

### Método 1: Con Azure Static Web Apps CLI (RECOMENDADO)

```bash
# Desde la raíz del proyecto
swa start . --api-location api
```

Esto iniciará:
- 🌐 Tu sitio web en: **http://localhost:4280**
- ⚙️ Azure Functions en: **http://localhost:4280/api/**

### Método 2: Servidor separado (alternativa)

**Terminal 1 - Frontend:**
```bash
# Instalar servidor HTTP simple
npm install -g http-server

# Iniciar servidor web
http-server -p 8080
```

**Terminal 2 - Azure Functions:**
```bash
cd api
func start
```

Esto iniciará:
- 🌐 Tu sitio web en: **http://localhost:8080**
- ⚙️ Azure Functions en: **http://localhost:7071/api/**

⚠️ Si usas este método, debes actualizar las URLs en tus archivos HTML:
- Cambiar `/api/obtenerInvitacion` a `http://localhost:7071/api/obtenerInvitacion`

---

## 🧪 Probar el sistema

### 1. Abrir el sitio
```
http://localhost:4280
```

### 2. Probar confirmación de invitados

Ve a:
```
http://localhost:4280/invitaciones.html?codigo=FAM001
```

**Códigos de prueba disponibles:**
- `FAM001` - Familia García (2 invitados)
- `FAM002` - Familia López (3 invitados)
- `FAM003` - Familia Martínez (1 invitado)

### 3. Probar panel de administración

Ve a:
```
http://localhost:4280/admin.html
```

**Contraseña:** `test123` (definida en local.settings.json)

### 4. Probar las APIs directamente

**Obtener invitación:**
```bash
curl "http://localhost:4280/api/obtenerInvitacion?codigo=FAM001"
```

**Confirmar asistencia:**
```bash
curl -X POST http://localhost:4280/api/confirmarAsistencia \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "FAM001",
    "confirmaciones": [
      {"id": 1, "asiste": true},
      {"id": 2, "asiste": false}
    ]
  }'
```

**Ver todas las confirmaciones (admin):**
```bash
curl http://localhost:4280/api/obtenerTodasConfirmaciones \
  -H "x-admin-password: test123"
```

---

## 🔄 Modificar datos de prueba

Edita `api/mock-data.js` para agregar más familias:

```javascript
let invitacionesMock = {
    'FAM001': { ... },
    'FAM002': { ... },
    'FAM004': {  // Nueva familia
        codigo: 'FAM004',
        nombreFamilia: 'Familia Hernández',
        email: 'hernandez@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Luis Hernández', asiste: null, confirmado: false }
        ]
    }
};
```

**No necesitas reiniciar el servidor** - los cambios se reflejan automáticamente.

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@azure/functions'"
```bash
cd api
npm install
```

### Error: "Port 4280 already in use"
```bash
# Detener procesos en ese puerto
lsof -ti:4280 | xargs kill -9

# O usar otro puerto
swa start . --api-location api --port 3000
```

### Error: "func: command not found"
```bash
# Reinstalar Azure Functions Core Tools
brew reinstall azure-functions-core-tools@4
```

### Las Azure Functions no responden
```bash
# Verificar que estén corriendo
curl http://localhost:7071/api/obtenerInvitacion?codigo=FAM001

# Revisar logs en la terminal donde corriste 'swa start'
```

### CORS errors en el navegador
Asegúrate de que `local.settings.json` tenga:
```json
"Host": {
  "CORS": "*"
}
```

---

## 📝 Comandos útiles

```bash
# Ver logs detallados
swa start . --api-location api --verbose

# Limpiar caché
rm -rf api/node_modules
cd api && npm install

# Ver qué puertos están en uso
lsof -i :4280
lsof -i :7071

# Detener todos los procesos de Node
killall node
```

---

## ✅ Checklist antes de subir a Azure

- [ ] Todo funciona en local (invitaciones.html)
- [ ] Panel admin funciona (admin.html)
- [ ] Las 3 familias de prueba funcionan
- [ ] Cambiaste a modo producción: `./switch-mode.sh prod`
- [ ] Verificaste que los archivos `index-dev.js` NO se suban a GitHub
- [ ] Configuraste `.gitignore` correctamente

---

## 🚀 Siguiente paso: Subir a Azure

Una vez que todo funcione en local:

1. Cambiar a modo producción:
```bash
./switch-mode.sh prod
```

2. Hacer commit:
```bash
git add .
git commit -m "Sistema de confirmaciones funcionando"
git push
```

3. Azure detectará los cambios y desplegará automáticamente.

---

## 💡 Notas importantes

- Los datos en `mock-data.js` solo existen mientras el servidor esté corriendo
- Al reiniciar el servidor, se pierden las confirmaciones (es solo para pruebas)
- En Azure usarás Table Storage que SÍ guarda los datos permanentemente
- Los archivos `index-dev.js` son SOLO para desarrollo local
- Nunca uses `mock-data.js` en producción

---

## 🎯 Recursos adicionales

- [Azure Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- [Documentación oficial de Azure](https://docs.microsoft.com/azure/static-web-apps/)
