const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('Obteniendo invitación...');

    const codigo = req.query.codigo || (req.body && req.body.codigo);

    if (!codigo) {
        context.res = {
            status: 400,
            body: { error: "Por favor, proporciona un código de invitación" }
        };
        return;
    }

    try {
        const connectionString = process.env.AzureWebJobsStorage;
        const tableClient = TableClient.fromConnectionString(connectionString, "invitaciones");

        // Buscar la invitación por código
        const entity = await tableClient.getEntity("familia", codigo);

        if (!entity) {
            context.res = {
                status: 404,
                body: { error: "Código de invitación no válido" }
            };
            return;
        }

        // Parsear invitados (guardados como JSON string)
        const invitados = typeof entity.invitados === 'string' 
            ? JSON.parse(entity.invitados) 
            : entity.invitados;

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                codigo: entity.rowKey,
                nombreFamilia: entity.nombreFamilia,
                invitados: invitados
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
                body: { error: "Error al obtener la invitación" }
            };
        }
    }
};