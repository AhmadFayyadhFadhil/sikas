/**
 * Validation helpers for form inputs
 */

export const validators = {
  /**
   * Check if amount is valid (positive number)
   */
  isValidAmount: (amount) => {
    const num = Number(amount);
    return !isNaN(num) && num > 0;
  },

  /**
   * Check if amount is within range
   */
  isAmountInRange: (amount, min = 1000, max = 999999999) => {
    const num = Number(amount);
    return num >= min && num <= max;
  },

  /**
   * Check if required field is filled
   */
  isRequired: (value) => {
    return value && value.toString().trim().length > 0;
  },

  /**
   * Check if text length is valid
   */
  isValidLength: (text, min = 1, max = 255) => {
    const len = text?.toString().trim().length || 0;
    return len >= min && len <= max;
  },

  /**
   * Check if date is valid and not in future
   */
  isValidDate: (date) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d <= today && !isNaN(d);
  },

  /**
   * Check if date is valid
   */
  isDateValid: (date) => {
    const d = new Date(date);
    return !isNaN(d);
  },

  /**
   * Check email format
   */
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Check Indonesian phone number
   */
  isValidPhoneNumber: (phone) => {
    const regex = /^(\+62|62|0)[0-9]{9,12}$/;
    return regex.test(phone?.replace(/\s/g, ''));
  },

  /**
   * Check if text contains only letters and spaces
   */
  isAlphabeticOnly: (text) => {
    const regex = /^[a-zA-Z\s'-]+$/i;
    return regex.test(text);
  }
};

/**
 * Validation rules for different form fields
 */
export const formRules = {
  /**
   * Validate transaction form
   */
  transaction: (data) => {
    const errors = {};

    if (!validators.isRequired(data.amount)) {
      errors.amount = 'Nominal wajib diisi';
    } else if (!validators.isValidAmount(data.amount)) {
      errors.amount = 'Nominal harus berupa angka positif';
    } else if (!validators.isAmountInRange(data.amount, 1000, 999999999)) {
      errors.amount = 'Nominal harus antara Rp 1.000 - Rp 999.999.999';
    }

    if (!validators.isRequired(data.category)) {
      errors.category = 'Kategori wajib dipilih';
    }

    if (!validators.isRequired(data.date)) {
      errors.date = 'Tanggal wajib diisi';
    } else if (!validators.isValidDate(data.date)) {
      errors.date = 'Tanggal tidak boleh di masa depan';
    }

    if (data.description && !validators.isValidLength(data.description, 1, 500)) {
      errors.description = 'Deskripsi maksimal 500 karakter';
    }

    return errors;
  },

  /**
   * Validate warga form
   */
  warga: (data) => {
    const errors = {};

    if (!validators.isRequired(data.nama)) {
      errors.nama = 'Nama Kepala Keluarga wajib diisi';
    } else if (!validators.isValidLength(data.nama, 3, 100)) {
      errors.nama = 'Nama harus 3-100 karakter';
    } else if (!validators.isAlphabeticOnly(data.nama)) {
      errors.nama = 'Nama hanya boleh berisi huruf dan spasi';
    }

    if (!validators.isRequired(data.blok)) {
      errors.blok = 'Blok wajib diisi';
    } else if (!validators.isValidLength(data.blok, 1, 20)) {
      errors.blok = 'Blok maksimal 20 karakter';
    }

    if (!validators.isRequired(data.nomorRumah)) {
      errors.nomorRumah = 'Nomor Rumah wajib diisi';
    } else if (!validators.isValidLength(data.nomorRumah, 1, 20)) {
      errors.nomorRumah = 'Nomor Rumah maksimal 20 karakter';
    }

    if (data.noHp && !validators.isValidPhoneNumber(data.noHp)) {
      errors.noHp = 'Format nomor WhatsApp tidak valid (contoh: 0812...  atau +628...)';
    }

    return errors;
  },

  /**
   * Validate login form
   */
  login: (data) => {
    const errors = {};

    if (!validators.isRequired(data.email)) {
      errors.email = 'Email wajib diisi';
    } else if (!validators.isValidEmail(data.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!validators.isRequired(data.password)) {
      errors.password = 'Password wajib diisi';
    } else if (!validators.isValidLength(data.password, 6, 100)) {
      errors.password = 'Password minimal 6 karakter';
    }

    return errors;
  }
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Get first error message
 */
export const getFirstError = (errors) => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};
