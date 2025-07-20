import { ProductType } from "@/types/ProductType";
import Product from "./components/Product";

async function getProducts() {
  const res = await fetch('https://fakestoreapi.com/products')
  if (!res.ok) { //.ok é uma propriedade booleana do objeto Response retornado pelo fetch. Indica se a resposta foi bem-sucedida (status HTTP entre 200 e 299).
    throw new Error('failed to fetch data')
  }
  return res.json() //.json() é um método do objeto Response que lê o corpo da resposta e o transforma em um objeto JavaScript (caso o conteúdo seja JSON). 
  //Converte os dados da API (que vêm em formato JSON como texto) em algo que o JavaScript possa manipular diretamente, como arrays ou objetos.
  //retorna uma promisse, que se resolve com os dados convertidos.
}


export default async function Home() {
  const products = await getProducts();

  return (
    <div className="max-w-7x1 mx-auto pt-8 px-8 xl:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 xl:gap-6">
        {products.map((product: ProductType) => (
          <Product key={product.id} product={product}></Product>
        ))}
      </div>  
    </div>
  );
}
