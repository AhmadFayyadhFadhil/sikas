/**
 * Constants for the application
 */

export const TRANSACTION_CATEGORIES = {
  income: [
    { id: 'iuran', label: 'Iuran Warga', icon: '💰' },
    { id: 'donasi', label: 'Donasi', icon: '🎁' },
    { id: 'bunga', label: 'Bunga Bank', icon: '🏦' },
    { id: 'lainnya_income', label: 'Lainnya', icon: '📌' }
  ],
  expense: [
    { id: 'listrik', label: 'Listrik', icon: '💡' },
    { id: 'air', label: 'Air', icon: '💧' },
    { id: 'pemeliharaan', label: 'Pemeliharaan', icon: '🔧' },
    { id: 'transportasi', label: 'Transportasi', icon: '🚗' },
    { id: 'administrasi', label: 'Administrasi', icon: '📋' },
    { id: 'keamanan', label: 'Keamanan', icon: '🛡️' },
    { id: 'sosial', label: 'Sosial', icon: '🤝' },
    { id: 'lainnya_expense', label: 'Lainnya', icon: '📌' }
  ]
};

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Pemasukan' },
  { value: 'expense', label: 'Pengeluaran' }
];

export const DATE_RANGES = [
  { id: 'today', label: 'Hari Ini' },
  { id: 'week', label: 'Minggu Ini' },
  { id: 'month', label: 'Bulan Ini' },
  { id: 'quarter', label: 'Kuartal Ini' },
  { id: 'year', label: 'Tahun Ini' },
  { id: 'all', label: 'Semua' }
];

export const EXPORT_FORMATS = [
  { id: 'pdf', label: 'PDF', icon: '📄' },
  { id: 'excel', label: 'Excel', icon: '📊' },
  { id: 'csv', label: 'CSV', icon: '📋' }
];

export const USER_ROLES = {
  admin: 'admin',
  ketua_rt: 'ketua_rt',
  warga: 'warga'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
  AUTH_FAILED: 'Email atau password salah.',
  UNAUTHORIZED: 'Anda tidak memiliki akses ke halaman ini.',
  FORBIDDEN: 'Akses ditolak.',
  NOT_FOUND: 'Data tidak ditemukan.',
  VALIDATION_ERROR: 'Data yang Anda kirim tidak valid.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil!',
  LOGOUT_SUCCESS: 'Logout berhasil!',
  CREATE_SUCCESS: 'Data berhasil ditambahkan.',
  UPDATE_SUCCESS: 'Data berhasil diperbarui.',
  DELETE_SUCCESS: 'Data berhasil dihapus.',
  EXPORT_SUCCESS: 'Data berhasil diekspor.'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};
