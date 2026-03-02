// Data repository — all entity access for the Migration Assistant goes through here.
// UI components never call base44.entities directly.
import { base44 } from '@/api/base44Client';

const SOFT_DELETE_FILTER = { deleted_at: null };

export const ProjectRepo = {
  list: () => base44.entities.MigrationProject.filter(SOFT_DELETE_FILTER, '-created_date'),
  get: (id) => base44.entities.MigrationProject.filter({ id, ...SOFT_DELETE_FILTER }).then(r => r[0] || null),
  create: (data) => base44.entities.MigrationProject.create({ ...data, owner_email: data.owner_email }),
  update: (id, data) => base44.entities.MigrationProject.update(id, data),
  softDelete: (id) => base44.entities.MigrationProject.update(id, { deleted_at: new Date().toISOString() }),
};

export const ProfileRepo = {
  listByProject: (project_id) =>
    base44.entities.MigrationProfile.filter({ project_id, ...SOFT_DELETE_FILTER }, '-created_date'),
  get: (id) => base44.entities.MigrationProfile.filter({ id, ...SOFT_DELETE_FILTER }).then(r => r[0] || null),
  create: (data) => base44.entities.MigrationProfile.create({ ...data, is_snapshot: false }),
  update: (id, data) => base44.entities.MigrationProfile.update(id, data),
  snapshot: (id) => base44.entities.MigrationProfile.update(id, { is_snapshot: true }),
  softDelete: (id) => base44.entities.MigrationProfile.update(id, { deleted_at: new Date().toISOString() }),
};

export const ArtifactRepo = {
  listByProfile: (profile_id) =>
    base44.entities.GeneratedArtifact.filter({ profile_id, ...SOFT_DELETE_FILTER }, '-created_date'),
  create: (data) => base44.entities.GeneratedArtifact.create(data),
  softDelete: (id) => base44.entities.GeneratedArtifact.update(id, { deleted_at: new Date().toISOString() }),
};

export const VerificationRepo = {
  listByProject: (project_id) =>
    base44.entities.VerificationRun.filter({ project_id, ...SOFT_DELETE_FILTER }, '-created_date'),
  listByProfile: (profile_id) =>
    base44.entities.VerificationRun.filter({ profile_id, ...SOFT_DELETE_FILTER }, '-created_date'),
  create: (data) => base44.entities.VerificationRun.create({ ...data, status: 'in_progress' }),
  update: (id, data) => base44.entities.VerificationRun.update(id, data),
  softDelete: (id) => base44.entities.VerificationRun.update(id, { deleted_at: new Date().toISOString() }),
};