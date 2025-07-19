// Form validation utilities

// TC Kimlik No validation (Turkish ID number)
export const validateTCKimlikNo = (tcNo: string): boolean => {
  // TC Kimlik No must be exactly 11 digits
  if (!tcNo || tcNo.length !== 11 || !/^\d{11}$/.test(tcNo)) {
    return false;
  }

  // First digit cannot be 0
  if (tcNo[0] === '0') {
    return false;
  }

  // TC Kimlik No algorithm validation
  const digits = tcNo.split('').map(Number);
  
  // Calculate 10th digit
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const tenthDigit = ((oddSum * 7) - evenSum) % 10;
  
  if (tenthDigit !== digits[9]) {
    return false;
  }
  
  // Calculate 11th digit
  const firstTenSum = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0);
  const eleventhDigit = firstTenSum % 10;
  
  return eleventhDigit === digits[10];
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Turkish mobile)
export const validatePhone = (phone: string): boolean => {
  // Remove spaces and special characters
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  
  // Turkish mobile numbers: 10 digits starting with 5
  const phoneRegex = /^5\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

// Credit card number validation (basic Luhn algorithm)
export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  // Must be 16 digits
  if (!/^\d{16}$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// CVV validation
export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Expiry date validation (MM/YY format)
export const validateExpiryDate = (expiryDate: string): boolean => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  // Check if card is expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

// Tax number validation (Turkish tax number algorithm)
export const validateTaxNumber = (taxNo: string): boolean => {
  // Turkish tax numbers must be exactly 10 digits
  if (!taxNo || taxNo.length !== 10 || !/^\d{10}$/.test(taxNo)) {
    return false;
  }

  // Turkish tax number algorithm
  const digits = taxNo.split('').map(Number);
  
  // Calculate check digit
  let v1 = 0, v2 = 0, v3 = 0, v4 = 0, v5 = 0, v6 = 0, v7 = 0;
  const lastDigit = digits[9];
  
  for (let i = 0; i < 9; i++) {
    const temp = (digits[i] + (9 - i)) % 10;
    v1 += temp;
    v2 += temp * Math.pow(2, 9 - i) % 9;
    if (temp !== 0) {
      v3 = 1;
    }
  }
  
  v1 = v1 % 10;
  v2 = v2 % 10;
  v4 = (10 - v1) % 10;
  v5 = (10 - v2) % 10;
  
  if (v3 === 1) {
    v6 = v4;
    v7 = v5;
  } else {
    v6 = 0;
    v7 = 0;
  }
  
  return lastDigit === v6 || lastDigit === v7;
};

// Name validation (at least 2 characters, letters only)
export const validateName = (name: string): boolean => {
  return /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,}$/.test(name.trim());
};

// Address validation (at least 10 characters)
export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 10;
};

// Error messages
export const validationMessages = {
  tcNo: 'Geçerli bir TC Kimlik No giriniz',
  email: 'Geçerli bir e-posta adresi giriniz',
  phone: 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX)',
  cardNumber: 'Geçerli bir kart numarası giriniz',
  cvv: 'Geçerli bir CVV giriniz',
  expiryDate: 'Geçerli bir son kullanma tarihi giriniz (AA/YY)',
  taxNumber: 'Geçerli bir vergi numarası giriniz (10 hane)',
  name: 'En az 2 karakter giriniz',
  address: 'Adres en az 10 karakter olmalıdır',
  required: 'Bu alan zorunludur',
  city: 'Lütfen şehir seçiniz',
  district: 'Lütfen ilçe seçiniz'
};