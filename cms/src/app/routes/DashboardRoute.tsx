import { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { DataTable } from '../../../../shared/ui/data-table/DataTable';
import type { Column } from '../../../../shared/ui/data-table/types';
import { adminApi, Lead, LeadType, LeadStatus } from '../api/adminApi';
import { Mail, UserCheck, Phone, TrendingUp } from 'lucide-react';

interface DashboardStats {
  newLeadsLast7Days: number;
  leadsByType: Record<LeadType, number>;
  leadsByStatus: Record<LeadStatus, number>;
}

const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  contact: 'Contacto',
  pre_enrollment: 'Pre-inscripción',
  elite_booking: 'Elite Booking',
};

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Cualificado',
  converted: 'Convertido',
  lost: 'Perdido',
};

const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-admin-info text-white',
  contacted: 'bg-admin-warning text-white',
  qualified: 'bg-blue-500 text-white',
  converted: 'bg-admin-success text-white',
  lost: 'bg-admin-error text-white',
};

export function DashboardRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    newLeadsLast7Days: 0,
    leadsByType: { contact: 0, pre_enrollment: 0, elite_booking: 0 },
    leadsByStatus: { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 },
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    loadDashboardData();
  }, [page]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [newLeadsResponse, allLeadsLast30Days, recentLeadsResponse] = await Promise.all([
        adminApi.leads.list({
          lead_status: 'new',
          created_after: sevenDaysAgo.toISOString(),
        }),
        adminApi.leads.list({
          created_after: thirtyDaysAgo.toISOString(),
          pageSize: 1000,
        }),
        adminApi.leads.list({
          page,
          pageSize,
        }),
      ]);

      const leadsByType: Record<LeadType, number> = {
        contact: 0,
        pre_enrollment: 0,
        elite_booking: 0,
      };

      const leadsByStatus: Record<LeadStatus, number> = {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        lost: 0,
      };

      const leadsData = (allLeadsLast30Days as any).data || [];
      leadsData.forEach((lead: Lead) => {
        leadsByType[lead.lead_type] = (leadsByType[lead.lead_type] || 0) + 1;
        leadsByStatus[lead.lead_status] = (leadsByStatus[lead.lead_status] || 0) + 1;
      });

      setStats({
        newLeadsLast7Days: newLeadsResponse.total,
        leadsByType,
        leadsByStatus,
      });

      setRecentLeads((recentLeadsResponse as any).data || []);
      setTotal(recentLeadsResponse.total);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: Column<Lead>[] = [
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (value) => formatDate(value),
      className: 'w-32',
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'lead_type',
      label: 'Tipo',
      sortable: true,
      render: (value: LeadType) => LEAD_TYPE_LABELS[value],
      className: 'w-40',
    },
    {
      key: 'lead_status',
      label: 'Estado',
      sortable: true,
      render: (value: LeadStatus) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${LEAD_STATUS_COLORS[value]}`}>
          {LEAD_STATUS_LABELS[value]}
        </span>
      ),
      className: 'w-36',
    },
    {
      key: 'source',
      label: 'Origen',
      render: (value, row) => value || row.utm_campaign || '-',
      className: 'w-32',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-admin-white mb-2">
          Dashboard
        </h1>
        <p className="text-admin-muted">
          Vista general de leads y métricas del CMS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-muted mb-1">Leads nuevos</p>
              <p className="text-2xl font-bold text-admin-white">
                {isLoading ? '-' : stats.newLeadsLast7Days}
              </p>
              <p className="text-xs text-admin-muted mt-1">Últimos 7 días</p>
            </div>
            <div className="p-2 bg-admin-info/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-admin-info" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-muted mb-1">Contacto</p>
              <p className="text-2xl font-bold text-admin-white">
                {isLoading ? '-' : stats.leadsByType.contact}
              </p>
              <p className="text-xs text-admin-muted mt-1">Últimos 30 días</p>
            </div>
            <div className="p-2 bg-admin-accent/10 rounded-lg">
              <Mail className="h-5 w-5 text-admin-accent" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-muted mb-1">Pre-inscripción</p>
              <p className="text-2xl font-bold text-admin-white">
                {isLoading ? '-' : stats.leadsByType.pre_enrollment}
              </p>
              <p className="text-xs text-admin-muted mt-1">Últimos 30 días</p>
            </div>
            <div className="p-2 bg-admin-warning/10 rounded-lg">
              <UserCheck className="h-5 w-5 text-admin-warning" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-admin-muted mb-1">Elite Booking</p>
              <p className="text-2xl font-bold text-admin-white">
                {isLoading ? '-' : stats.leadsByType.elite_booking}
              </p>
              <p className="text-xs text-admin-muted mt-1">Últimos 30 días</p>
            </div>
            <div className="p-2 bg-admin-success/10 rounded-lg">
              <Phone className="h-5 w-5 text-admin-success" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-admin-white mb-4">
          Embudo de conversión
        </h2>
        <div className="space-y-3">
          {Object.entries(stats.leadsByStatus).map(([status, count]) => {
            const total = Object.values(stats.leadsByStatus).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-admin-white">
                    {LEAD_STATUS_LABELS[status as LeadStatus]}
                  </span>
                  <span className="text-sm text-admin-muted">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-admin-navy rounded-full overflow-hidden">
                  <div
                    className="h-full bg-admin-accent rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-admin-white mb-4">
          Leads recientes
        </h2>
        <DataTable
          columns={columns}
          data={recentLeads}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          emptyMessage="No hay leads registrados"
        />
      </div>
    </div>
  );
}
