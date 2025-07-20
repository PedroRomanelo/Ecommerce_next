export const formatPrice = (price: number | null) => {
  if (price === null ) return "Não encontrado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price/100);
};