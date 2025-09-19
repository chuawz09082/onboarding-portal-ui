import axios from 'axios';

const BASE = 'http://localhost:9000/application-service/api/application';

function mapApiToApp(item) {
  if (!item) return null;
  return {
    awf_id: item.id,
    employee_id: item.employeeId || '',
    legal_full_name: item.legalFullName || 'Unknown',
    create_date: item.createDate,
    last_modification_date: item.lastModificationDate,
    status: item.status,
    comment: item.comment,
    application_type: item.applicationType,
    documents: item.documents || [],
  };
}

export const applicationService = {
  async getAll() {
    try {
      const res = await axios.get(BASE, { headers: { Accept: 'application/json' } });
      const payload = res?.data?.data || [];
      return payload.map(mapApiToApp);
    } catch (err) {
      console.error('getAll applications error:', err?.response || err);
      throw err;
    }
  },

  async getById(id) {
    try {
      const res = await axios.get(`${BASE}/${encodeURIComponent(id)}`, { headers: { Accept: 'application/json' } });
      const payload = res?.data?.data;
      return mapApiToApp(payload);
    } catch (err) {
      console.error('getById application error:', err?.response || err);
      throw err;
    }
  },
};

export default applicationService;


