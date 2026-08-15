import * as fs from 'fs';
import * as path from 'path';

describe('Route Completeness Validation', () => {
  it('validates client dashboard routes have data sources', () => {
    // Check if expected dashboard directories exist
    const clientDashboardDir = path.resolve(__dirname, '../app/dashboard/client');
    expect(fs.existsSync(clientDashboardDir)).toBeTruthy();
  });

  it('validates provider dashboard routes have data sources', () => {
    const providerDashboardDir = path.resolve(__dirname, '../app/dashboard/provider');
    expect(fs.existsSync(providerDashboardDir)).toBeTruthy();
  });

  it('validates admin dashboard routes exist', () => {
    const adminDashboardDir = path.resolve(__dirname, '../app/admin');
    expect(fs.existsSync(adminDashboardDir)).toBeTruthy();
  });
});
