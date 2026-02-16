// Script para cargar invitaciones de prueba en Azure Table Storage
// Ejecutar: node cargar-invitaciones.js

const azure = require('azure-storage');

// IMPORTANTE: Reemplazar con tu connection string de Azure
// Lo obtienes en: Azure Portal > Tu Storage Account > Access keys
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || 
    'PEGAR_AQUI_TU_CONNECTION_STRING';

const tableService = azure.createTableService(connectionString);

// Familias de prueba
const familiasDemo = [
    {
        codigo: 'FAM001',
        nombreFamilia: 'Familia García',
        email: 'garcia@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Juan García', asiste: null, confirmado: false },
            { id: 2, nombre: 'María García', asiste: null, confirmado: false }
        ]
    },
    {
        codigo: 'FAM002',
        nombreFamilia: 'Familia López',
        email: 'lopez@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Carlos López', asiste: null, confirmado: false },
            { id: 2, nombre: 'Ana López', asiste: null, confirmado: false },
            { id: 3, nombre: 'Pedro López Jr.', asiste: null, confirmado: false }
        ]
    },
    {
        codigo: 'FAM003',
        nombreFamilia: 'Familia Martínez',
        email: 'martinez@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Roberto Martínez', asiste: null, confirmado: false }
        ]
    },
    {
        codigo: 'FAM004',
        nombreFamilia: 'Familia Rodríguez',
        email: 'rodriguez@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Laura Rodríguez', asiste: null, confirmado: false },
            { id: 2, nombre: 'Miguel Rodríguez', asiste: null, confirmado: false }
        ]
    },
    {
        codigo: 'FAM005',
        nombreFamilia: 'Familia Sánchez',
        email: 'sanchez@ejemplo.com',
        invitados: [
            { id: 1, nombre: 'Patricia Sánchez', asiste: null, confirmado: false },
            { id: 2, nombre: 'Diego Sánchez', asiste: null, confirmado: false },
            { id: 3, nombre: 'Sofía Sánchez', asiste: null, confirmado: false },
            { id: 4, nombre: 'Mateo Sánchez', asiste: null, confirmado: false }
        ]
    }
];

async function crearTabla() {
    return new Promise((resolve, reject) => {
        tableService.createTableIfNotExists('invitaciones', (error, result) => {
            if (error) {
                reject(error);
            } else {
                console.log('✓ Tabla "invitaciones" lista');
                resolve(result);
            }
        });
    });
}

async function insertarInvitacion(familia) {
    const entGen = azure.TableUtilities.entityGenerator;
    
    const entidad = {
        PartitionKey: entGen.String('familia'),
        RowKey: entGen.String(familia.codigo),
        nombreFamilia: entGen.String(familia.nombreFamilia),
        email: entGen.String(familia.email),
        invitados: entGen.String(JSON.stringify(familia.invitados))
    };

    return new Promise((resolve, reject) => {
        tableService.insertOrReplaceEntity('invitaciones', entidad, (error, result) => {
            if (error) {
                reject(error);
            } else {
                console.log(`  ✓ ${familia.nombreFamilia} (${familia.codigo})`);
                resolve(result);
            }
        });
    });
}

async function cargarTodas() {
    try {
        console.log('🚀 Iniciando carga de invitaciones...\n');
        
        // Crear tabla
        await crearTabla();
        
        console.log('\n📝 Insertando familias:');
        
        // Insertar todas las familias
        for (const familia of familiasDemo) {
            await insertarInvitacion(familia);
        }
        
        console.log('\n✅ ¡Todas las invitaciones han sido cargadas!');
        console.log(`\nTotal: ${familiasDemo.length} familias`);
        console.log('\n🔗 URLs de prueba:');
        familiasDemo.forEach(f => {
            console.log(`   ${f.nombreFamilia}: https://tu-sitio.azurestaticapps.net/invitaciones.html?codigo=${f.codigo}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Ejecutar
cargarTodas();
