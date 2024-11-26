// Formata CPF (12345678909 -> 123.456.789-09)
export const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");
};

// Formata Telefone (11912345678 -> (11) 91234-5678)
export const formatPhone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

// Formata Data de Nascimento (25042002 -> 25/04/2002)
export const formatDate = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\/\d{4})\d+?$/, "$1");
};

// Remove formatação de CPF, Telefone ou Data
export const removeFormatting = (value: string): string => {
  return value.replace(/\D/g, "");
};
