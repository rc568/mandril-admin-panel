import { CustomPagination } from '@/components/common/custom-pagination';
import { Title } from '@/components/common/title';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { getProductsByPage } from '../actions/get-products-by-page.action';
import { ProductList } from '../components/product-list';
import { ProductPerPageOptions } from '../components/product-per-page-options';
import { ProductsStats } from '../components/products-stats';
import { SearchControls } from '../components/search-controls';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? '1';
  const queryLimit = searchParams.get('limit') ?? '48';

  const page = Number.isNaN(parseInt(queryPage)) || parseInt(queryPage) <= 1 ? 1 : parseInt(queryPage);
  const limit =
    Number.isNaN(parseInt(queryLimit)) || parseInt(queryLimit) > 96 || parseInt(queryLimit) <= 0
      ? 48
      : parseInt(queryLimit);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => getProductsByPage(+page, +limit),
    staleTime: 1000 * 60 * 5
  });

  const pageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const limitChange = (limit: string) => {
    setSearchParams((prev) => {
      prev.set('limit', limit);
      prev.delete('page');
      return prev;
    });
  };

  if (isLoading) return <h1>Cargando página ...</h1>;

  return (
    <>
      <Title title="Productos" subtitle="Catálogo de productos" />

      {isFetching || !data ? (
        <h1>Cargando datos ...</h1>
      ) : (
        <>
          <ProductsStats />
          <SearchControls />
          {data.products.length > 0 ? (
            <ProductList products={data.products}>
              <ProductPerPageOptions
                limit={limit}
                page={page}
                elements="productos"
                totalItems={data.pagination.totalItems}
                handleValueChange={limitChange}
              />
            </ProductList>
          ) : (
            <h2 className="text-center font-medium py-8">No se encontraron productos.</h2>
          )}
          <CustomPagination
            totalPages={data.pagination.totalPages}
            handlePageChange={pageChange}
            currentPage={+page}
            nextPage={data.pagination.nextPage}
            prevPage={data.pagination.prevPage}
          />
        </>
      )}
    </>
  );
};
