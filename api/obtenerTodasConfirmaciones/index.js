const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    context.log('Obteniendo todas las confirmaciones...');

    // Validar contraseña de admin
    const password = req.query.password || (req.body && req.body.password);
    const adminPassword = process.env.ADMIN_PASSWORD || 'test123';

    if (password !== adminPassword) {
        context.res = {
            status: 401,
            body: { error: "Contraseña incorrecta" }
        };
        return;
    }

    try {
        const connectionString = process.env.AzureWebJobsStorage;
        const tableClient = TableClient.fromConnectionString(connectionString, "invitaciones");

        // Obtener todas las entidades
        const entities = tableClient.listEntities({
            queryOptions: { filter: `PartitionKey eq 'familia'` }
        });

        const invitaciones = [];
        
        for await (const entity of entities) {
            const invitados = typeof entity.invitados === 'string' 
                ? JSON.parse(entity.invitados) 
                : entity.invitados;

            invitaciones.push({
                codigo: entity.rowKey,
                nombreFamilia: entity.nombreFamilia,
                invitados: invitados,
                fechaConfirmacion: entity.fechaConfirmacion || null
            });
        }

        // Calcular estadísticas
        let totalInvitados = 0;
        let totalAsisten = 0;
        let totalNoAsisten = 0;
        let totalPendientes = 0;
        let familiasConfirmadas = 0;

        invitaciones.forEach(inv => {
            let familiaConfirmada = false;
            
            inv.invitados.forEach(invitado => {
                totalInvitados++;
                if (invitado.confirmado) {
                    familiaConfirmada = true;
                    if (invitado.asiste) {
                        totalAsisten++;
                    } else {
                        totalNoAsisten++;
                    }
                } else {
                    totalPendientes++;
                }
            });

            if (familiaConfirmada) {
                familiasConfirmadas++;
            }
        });

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                invitaciones: invitaciones,
                estadisticas: {
                    totalFamilias: invitaciones.length,
                    totalInvitados: totalInvitados,
                    totalAsisten: totalAsisten,
                    totalNoAsisten: totalNoAsisten,
                    totalPendientes: totalPendientes,
                    familiasConfirmadas: familiasConfirmadas
                }
            }
        };

    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: { error: "Error al obtener las confirmaciones" }
        };
    }
};