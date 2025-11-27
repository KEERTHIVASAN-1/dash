import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Format date for forms
export const formatDateForInput = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format role display
export const formatRole = (role) => {
  const roleMap = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Administrator'
  };
  return roleMap[role] || capitalize(role);
};

// Get role color
export const getRoleColor = (role) => {
  const colorMap = {
    student: 'blue',
    teacher: 'green',
    admin: 'purple'
  };
  return colorMap[role] || 'gray';
};

// Format priority
export const formatPriority = (priority) => {
  const priorityMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  };
  return priorityMap[priority] || capitalize(priority);
};

// Get priority color
export const getPriorityColor = (priority) => {
  const colorMap = {
    low: 'gray',
    medium: 'blue',
    high: 'orange',
    urgent: 'red'
  };
  return colorMap[priority] || 'gray';
};

// Format category
export const formatCategory = (category) => {
  const categoryMap = {
    academic: 'Academic',
    general: 'General',
    technical: 'Technical',
    administrative: 'Administrative',
    other: 'Other'
  };
  return categoryMap[category] || capitalize(category);
};

// Get category color
export const getCategoryColor = (category) => {
  const colorMap = {
    academic: 'blue',
    general: 'gray',
    technical: 'green',
    administrative: 'purple',
    other: 'orange'
  };
  return colorMap[category] || 'gray';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate avatar initials
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Lightweight MD5 for gravatar hashing
const md5 = (str) => {
  const utf8 = unescape(encodeURIComponent(str));
  const makeWordArray = (s) => {
    const len = s.length;
    const words = [];
    for (let i = 0; i < len; i++) words[(i >> 2)] |= s.charCodeAt(i) << ((i % 4) * 8);
    words[len >> 2] |= 0x80 << ((len % 4) * 8);
    words[(((len + 8) >> 6) * 16) + 14] = len * 8;
    return words;
  };
  const add = (x, y) => (((x & 0xffff) + (y & 0xffff)) | 0) + ((((x >> 16) + (y >> 16)) & 0xffff) << 16);
  const rol = (n, c) => (n << c) | (n >>> (32 - c));
  const cmn = (q, a, b, x, s, t) => add(rol(add(add(a, q), add(x, t)), s), b);
  const ff = (a, b, c, d, x, s, t) => cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a, b, c, d, x, s, t) => cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a, b, c, d, x, s, t) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a, b, c, d, x, s, t) => cmn(c ^ (b | ~d), a, b, x, s, t);
  const x = makeWordArray(utf8);
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const oa = a, ob = b, oc = c, od = d;
    a = ff(a, b, c, d, x[i+0], 7, -680876936);
    d = ff(d, a, b, c, x[i+1], 12, -389564586);
    c = ff(c, d, a, b, x[i+2], 17, 606105819);
    b = ff(b, c, d, a, x[i+3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+4], 7, -176418897);
    d = ff(d, a, b, c, x[i+5], 12, 1200080426);
    c = ff(c, d, a, b, x[i+6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+7], 22, -45705983);
    a = ff(a, b, c, d, x[i+8], 7, 1770035416);
    d = ff(d, a, b, c, x[i+9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7, 1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22, 1236535329);
    a = gg(a, b, c, d, x[i+1], 5, -165796510);
    d = gg(d, a, b, c, x[i+6], 9, -1069501632);
    c = gg(c, d, a, b, x[i+11], 14, 643717713);
    b = gg(b, c, d, a, x[i+0], 20, -373897302);
    a = gg(a, b, c, d, x[i+5], 5, -701558691);
    d = gg(d, a, b, c, x[i+10], 9, 38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+4], 20, -405537848);
    a = gg(a, b, c, d, x[i+9], 5, 568446438);
    d = gg(d, a, b, c, x[i+14], 9, -1019803690);
    c = gg(c, d, a, b, x[i+3], 14, -187363961);
    b = gg(b, c, d, a, x[i+8], 20, 1163531501);
    a = gg(a, b, c, d, x[i+13], 5, -1444681467);
    d = gg(d, a, b, c, x[i+2], 9, -51403784);
    c = gg(c, d, a, b, x[i+7], 14, 1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    a = hh(a, b, c, d, x[i+5], 4, -378558);
    d = hh(d, a, b, c, x[i+8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16, 1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+1], 4, -1530992060);
    d = hh(d, a, b, c, x[i+4], 11, 1272893353);
    c = hh(c, d, a, b, x[i+7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = ii(a, b, c, d, x[i+0], 6, 681279174);
    d = ii(d, a, b, c, x[i+7], 10, -358537222);
    c = ii(c, d, a, b, x[i+14], 15, -722521979);
    b = ii(b, c, d, a, x[i+5], 21, 76029189);
    a = ii(a, b, c, d, x[i+12], 6, -640364487);
    d = ii(d, a, b, c, x[i+3], 10, -421815835);
    c = ii(c, d, a, b, x[i+10], 15, 530742520);
    b = ii(b, c, d, a, x[i+1], 21, -995338651);
    a = add(a, oa);
    b = add(b, ob);
    c = add(c, oc);
    d = add(d, od);
  }
  const r = [a, b, c, d];
  let out = '';
  for (let i = 0; i < r.length; i++) {
    for (let j = 0; j < 4; j++) {
      const byte = (r[i] >> (j * 8)) & 255;
      out += ('0' + byte.toString(16)).slice(-2);
    }
  }
  return out;
};

export const getAvatarUrl = (avatar, email) => {
  if (avatar) return avatar;
  if (email && isValidEmail(email)) {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  }
  return '';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Check if user can edit resource
export const canEdit = (resource, user) => {
  if (!user || !resource) return false;
  
  // Admin and teachers can edit anything
  if (user.role === 'admin' || user.role === 'teacher') return true;
  
  // Users can edit their own resources
  return resource.author?._id === user.id || resource.author === user.id;
};

// Check if user can delete resource
export const canDelete = (resource, user) => {
  if (!user || !resource) return false;
  
  // Only admins can delete anything
  if (user.role === 'admin') return true;
  
  // Users can delete their own resources
  return resource.author?._id === user.id || resource.author === user.id;
};
