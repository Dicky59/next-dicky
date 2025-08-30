export const generateApiKey = () => {
  const prefix = 'pk_';
  const randomPart = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
  return prefix + randomPart.toUpperCase();
};
