const azure = require('azure-storage');

module.exports = async function (context, req) {
    const { codigo, confirmaciones } = req.body;
    
    // Validar datos
    if (!codigo || !confirmaciones || !Array.isArray(confirmaciones)) {
        context.res = {
            status: 400,
            body: { error: "Datos inválidos" }
        };
        return;
    }
    
    try {
        const connectionString = process.env.AzureWebJobsStorage;
        const tableService = azure.createTableService(connectionString);
        
        // Verificar que el código existe
        const invitacion = await new Promise((resolve, reject) => {
            tableService.retrieveEntity(
                'invitaciones',
                'familia',
                codigo,
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
        
        // Actualizar invitados con las confirmaciones
        const invitadosActuales = JSON.parse(invitacion.invitados._);
        
        confirmaciones.forEach(conf => {
            const invitado = invitadosActuales.find(i => i.id === conf.id);
            if (invitado) {
                invitado.asiste = conf.asiste;
                invitado.confirmado = true;
            }
        });
        
        // Preparar entidad actualizada
        const entGen = azure.TableUtilities.entityGenerator;
        const entidadActualizada = {
            PartitionKey: entGen.String('familia'),
            RowKey: entGen.String(codigo),
            nombreFamilia: entGen.String(invitacion.nombreFamilia._),
            email: entGen.String(invitacion.email ? invitacion.email._ : ''),
            invitados: entGen.String(JSON.stringify(invitadosActuales)),
            fechaConfirmacion: entGen.DateTime(new Date())
        };
        
        // Actualizar en Table Storage
        await new Promise((resolve, reject) => {
            tableService.replaceEntity(
                'invitaciones',
                entidadActualizada,
                (error) => {
                    if (error) reject(error);
                    else resolve();
                }
            );
        });
        
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                mensaje: "¡Confirmación guardada exitosamente!",
                confirmaciones: invitadosActuales
            }
        };
        
    } catch (error) {
        context.log.error('Error al confirmar asistencia:', error);
        context.res = {
            status: 500,
            body: { error: "Error al procesar la confirmación" }
        };
    }
};
