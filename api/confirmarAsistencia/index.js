const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('Confirmando asistencia...');

    const { codigo, invitados } = req.body;

    if (!codigo || !invitados) {
        context.res = {
            status: 400,
            body: { error: "Código e invitados son requeridos" }
        };
        return;
    }

    try {
        const connectionString = process.env.AzureWebJobsStorage;
        const tableClient = TableClient.fromConnectionString(connectionString, "invitaciones");

        // Obtener la entidad existente
        const entity = await tableClient.getEntity("familia", codigo);

        if (!entity) {
            context.res = {
                status: 404,
                body: { error: "Código de invitación no válido" }
            };
            return;
        }

        // Actualizar invitados
        entity.invitados = JSON.stringify(invitados);
        entity.fechaConfirmacion = new Date().toISOString();

        // Actualizar en Table Storage
        await tableClient.updateEntity(entity, "Replace");

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                success: true,
                mensaje: "Confirmación guardada exitosamente"
            }
        };

    } catch (error) {
        context.log.error('Error:', error);
        
        if (error.statusCode === 404) {
            context.res = {
                status: 404,
                body: { error: "Código de invitación no válido" }
            };
        } else {
            context.res = {
                status: 500,
                body: { error: "Error al guardar la confirmación" }
            };
        }
    }
};