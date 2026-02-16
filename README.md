# 💒 Sistema de Confirmación de Invitaciones para Boda

Sistema completo para gestionar confirmaciones de asistencia a bodas usando Azure Static Web Apps + Azure Functions + Table Storage.

## 📁 Estructura del Proyecto

```
mi-boda/
├── index.html                  # Página principal de tu boda
├── invitaciones.html          # Página de confirmación (para invitados)
├── admin.html                 # Panel de administración (para ti)
├── css/
│   ├── styles.css
│   └── bootstrap.min.css
├── js/
│   ├── script.js
│   └── bootstrap.min.js
├── assets/
│   └── images/
├── api/                       # Azure Functions (Backend)
│   ├── package.json
│   ├── obtenerInvitacion/
│   ├── confirmarAsistencia/
│   └── obtenerTodasConfirmaciones/
├── staticwebapp.config.json   # Configuración de Azure
└── cargar-invitaciones.js     # Script para subir invitaciones
```

## 🚀 Guía de Configuración en Azure

### PASO 1: Crear cuenta de Azure

1. Ve a https://portal.azure.com
2. Crea una cuenta gratuita (te dan $200 USD de crédito)
3. No necesitas tarjeta para empezar con el tier gratuito

### PASO 2: Crear Azure Static Web App

1. En Azure Portal, busca "Static Web Apps"
2. Clic en "Create"
3. Configuración:
   - **Subscription**: Tu suscripción
   - **Resource Group**: Crea uno nuevo "boda-recursos"
   - **Name**: "mi-boda-2024" (o el nombre que quieras)
   - **Plan type**: Free
   - **Region**: Central US (o la más cercana)
   - **Deployment details**: 
     - Source: GitHub
     - Autoriza tu cuenta de GitHub
     - Selecciona tu repositorio
     - Branch: main
     - Build Presets: Custom
     - App location: `/`
     - Api location: `/api`
     - Output location: (dejar vacío)

4. Clic en "Review + Create" y luego "Create"

⏱️ Azure tardará 2-3 minutos en desplegar tu sitio.

### PASO 3: Configurar Azure Storage (Base de datos)

1. En Azure Portal, busca "Storage accounts"
2. Clic en "Create"
3. Configuración:
   - **Resource Group**: Usa el mismo "boda-recursos"
   - **Storage account name**: "bodainvitaciones2024" (solo minúsculas y números)
   - **Region**: La misma que usaste antes
   - **Performance**: Standard
   - **Redundancy**: LRS (la más barata)

4. Clic en "Review + Create" y "Create"

5. Una vez creado, ve a:
   - Storage account > Access keys
   - Copia el "Connection string" (lo necesitarás después)

### PASO 4: Conectar Storage con Static Web App

1. Ve a tu Static Web App en Azure Portal
2. En el menú izquierdo: "Configuration"
3. Clic en "Add" en "Application settings"
4. Añade estas variables:
   - **Name**: `AzureWebJobsStorage`
   - **Value**: Pega el connection string que copiaste

5. Añade otra variable:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Una contraseña segura para tu panel admin (ej: "MiBoda2024!")

6. Clic en "Save"

### PASO 5: Subir código a GitHub

```bash
# En tu terminal, desde la carpeta del proyecto:

# Inicializar git (si no lo has hecho)
git init

# Añadir todos los archivos
git add .

# Commit
git commit -m "Sistema de confirmaciones listo"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

Azure detectará el push y comenzará a desplegar automáticamente.

### PASO 6: Cargar invitaciones de prueba

En tu computadora:

```bash
# Instalar dependencias
cd api
npm install
cd ..

# Configurar connection string como variable de entorno
# En Windows (PowerShell):
$env:AZURE_STORAGE_CONNECTION_STRING="TU_CONNECTION_STRING_AQUI"

# En Mac/Linux:
export AZURE_STORAGE_CONNECTION_STRING="TU_CONNECTION_STRING_AQUI"

# Ejecutar script
node cargar-invitaciones.js
```

Esto creará 5 familias de prueba en tu base de datos.

## 🔗 URLs Importantes

Después del despliegue, tendrás:

- **Sitio principal**: https://TU-SITIO.azurestaticapps.net
- **Confirmaciones**: https://TU-SITIO.azurestaticapps.net/invitaciones.html?codigo=FAM001
- **Panel Admin**: https://TU-SITIO.azurestaticapps.net/admin.html

## 📱 Cómo enviar invitaciones

1. Cada familia tiene un código único (ej: FAM001, FAM002, etc.)
2. Envíales por WhatsApp/Email el link:
   ```
   ¡Están invitados a nuestra boda! 🎉
   Confirmen aquí: https://TU-SITIO.azurestaticapps.net/invitaciones.html?codigo=FAM001
   ```

3. Ellos entrarán y verán solo sus nombres
4. Confirman si asisten o no
5. Tú ves todo en tiempo real en el panel admin

## 🔐 Panel de Administración

1. Entra a: https://TU-SITIO.azurestaticapps.net/admin.html
2. Ingresa la contraseña que configuraste en ADMIN_PASSWORD
3. Verás:
   - Estadísticas generales
   - Lista de todas las familias
   - Quién ha confirmado y quién no
   - Botón para exportar todo a CSV/Excel

## 📊 Cargar tus invitaciones reales

Edita el archivo `cargar-invitaciones.js` y reemplaza las familias de prueba con tus invitados reales:

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
node cargar-invitaciones.js
```

## 💰 Costos Esperados

Para una boda de ~200 invitados:

- **Azure Static Web Apps**: $0 (Tier gratuito)
- **Azure Functions**: $0 (Dentro del millón gratuito)
- **Azure Storage**: ~$1-2 USD/mes
- **TOTAL**: ~$2 USD para todo el evento

## 🛠️ Desarrollo Local

Para probar en tu computadora antes de subir a Azure:

```bash
# Instalar Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Ejecutar localmente
swa start . --api-location api

# Tu sitio estará en: http://localhost:4280
```

## 🆘 Solución de Problemas

### Error: "Código inválido"
- Verifica que el código en la URL coincida con uno en la base de datos
- Revisa que la función `obtenerInvitacion` esté funcionando

### Error 500 en las funciones
- Revisa los logs en Azure Portal > Static Web App > Functions
- Verifica que AzureWebJobsStorage esté configurado correctamente

### No aparecen las invitaciones
- Ejecuta `cargar-invitaciones.js` de nuevo
- Verifica el connection string

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Azure Portal
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el código esté en GitHub y desplegado

## ✨ Características

✅ Sistema de códigos únicos por familia
✅ Privacidad (cada familia solo ve sus invitados)
✅ Panel de administración en tiempo real
✅ Exportación a CSV/Excel
✅ Responsive (funciona en celular, tablet, PC)
✅ Sin costo prácticamente
✅ Despliegue automático desde GitHub
✅ Seguro y escalable

---

¡Felicidades por tu boda! 🎉💒
