const azure = require('azure-storage');

module.exports = async function (context, req) {
    const codigo = req.query.codigo;
    
    // Validar que se envió el código
    if (!codigo) {
        context.res = {
            status: 400,
            body: { error: "Código de invitación requerido" }
        };
        return;
    }
    
    try {
        // Conectar a Table Storage
        const connectionString = process.env.AzureWebJobsStorage;
        const tableService = azure.createTableService(connectionString);
        
        // Crear tabla si no existe (solo en primera ejecución)
        await new Promise((resolve, reject) => {
            tableService.createTableIfNotExists('invitaciones', (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        
        // Buscar invitación por código
        const invitacion = await new Promise((resolve, reject) => {
            tableService.retrieveEntity(
                'invitaciones',
                'familia', // PartitionKey
                codigo,    // RowKey
                (error, result) => {
                    if (error) {
                        if (error.statusCode === 404) {
                            resolve(null);
                        } else {
                            reject(error);
                        }
                    } else {
                        resolve(result);
                    }
                }
            );
        });
        
        if (!invitacion) {
            context.res = {
                status: 404,
                body: { error: "Código de invitación no válido" }
            };
            return;
        }
        
        // Parsear invitados (están guardados como JSON string)
        const invitados = JSON.parse(invitacion.invitados._);
        
        // Devolver solo los datos necesarios
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                codigo: invitacion.RowKey._,
                nombreFamilia: invitacion.nombreFamilia._,
                invitados: invitados,
                email: invitacion.email ? invitacion.email._ : null
            }
        };
        
    } catch (error) {
        context.log.error('Error al obtener invitación:', error);
        context.res = {
            status: 500,
            body: { error: "Error al procesar la solicitud" }
        };
    }
};
