const azure = require('azure-storage');

module.exports = async function (context, req) {
    // Validar contraseña de administrador (opcional pero recomendado)
    const password = req.headers['x-admin-password'];
    const adminPassword = process.env.ADMIN_PASSWORD || 'cambiar-esto-123'; // Configurar en Azure
    
    if (password !== adminPassword) {
        context.res = {
            status: 401,
            body: { error: "No autorizado" }
        };
        return;
    }
    
    try {
        const connectionString = process.env.AzureWebJobsStorage;
        const tableService = azure.createTableService(connectionString);
        
        // Obtener todas las invitaciones
        const invitaciones = await new Promise((resolve, reject) => {
            const query = new azure.TableQuery()
                .where('PartitionKey eq ?', 'familia');
            
            tableService.queryEntities('invitaciones', query, null, (error, result) => {
                if (error) reject(error);
                else resolve(result.entries);
            });
        });
        
        // Formatear datos
        const datos = invitaciones.map(inv => {
            const invitados = JSON.parse(inv.invitados._);
            const totalInvitados = invitados.length;
            const confirmados = invitados.filter(i => i.confirmado).length;
            const asisten = invitados.filter(i => i.asiste === true).length;
            const noAsisten = invitados.filter(i => i.asiste === false).length;
            
            return {
                codigo: inv.RowKey._,
                nombreFamilia: inv.nombreFamilia._,
                email: inv.email ? inv.email._ : '',
                invitados: invitados,
                totalInvitados: totalInvitados,
                confirmados: confirmados,
                asisten: asisten,
                noAsisten: noAsisten,
                pendientes: totalInvitados - confirmados,
                fechaConfirmacion: inv.fechaConfirmacion ? inv.fechaConfirmacion._ : null
            };
        });
        
        // Estadísticas generales
        const estadisticas = {
            totalFamilias: datos.length,
            familiasConfirmadas: datos.filter(d => d.confirmados > 0).length,
            familiasPendientes: datos.filter(d => d.confirmados === 0).length,
            totalInvitados: datos.reduce((sum, d) => sum + d.totalInvitados, 0),
            totalAsisten: datos.reduce((sum, d) => sum + d.asisten, 0),
            totalNoAsisten: datos.reduce((sum, d) => sum + d.noAsisten, 0),
            totalPendientes: datos.reduce((sum, d) => sum + d.pendientes, 0)
        };
        
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                estadisticas: estadisticas,
                invitaciones: datos
            }
        };
        
    } catch (error) {
        context.log.error('Error al obtener confirmaciones:', error);
        context.res = {
            status: 500,
            body: { error: "Error al procesar la solicitud" }
        };
    }
};
