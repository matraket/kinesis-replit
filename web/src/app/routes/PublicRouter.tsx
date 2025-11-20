import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { HomeRoute } from './HomeRoute';
import { AboutRoute } from './AboutRoute';
import { BusinessModelsRoute } from './BusinessModelsRoute';
import { ProgramsRoute } from './ProgramsRoute';
import { ProgramDetailRoute } from './ProgramDetailRoute';
import { TeamRoute } from './TeamRoute';
import { SchedulePricingRoute } from './SchedulePricingRoute';
import { LegalNoticeRoute } from './LegalNoticeRoute';
import { PrivacyPolicyRoute } from './PrivacyPolicyRoute';

export function PublicRouter() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomeRoute />} />
        <Route path="quienes-somos" element={<AboutRoute />} />
        <Route path="modelos-de-negocio" element={<BusinessModelsRoute />} />
        <Route path="programas" element={<ProgramsRoute />} />
        <Route path="programas/:slug" element={<ProgramDetailRoute />} />
        <Route path="equipo" element={<TeamRoute />} />
        <Route path="horarios-tarifas" element={<SchedulePricingRoute />} />
        <Route path="legal/aviso" element={<LegalNoticeRoute />} />
        <Route path="legal/privacidad" element={<PrivacyPolicyRoute />} />
      </Route>
    </Routes>
  );
}
