import { CustomPagination } from '@/components/common/custom-pagination';
import { Title } from '@/components/common/title';
import { useQuery } from '@tanstack/react-query';

import { getProductsByPage } from '../actions/get-products-by-page.action';
import { ProductList } from '../components/product-list';
import { ProductListFilters } from '../components/product-list-filters';
import { ProductListOrderBy } from '../components/product-list-order-by';
import { ProductPerPageOptions } from '../components/product-per-page-options';
import { ProductsStats } from '../components/products-stats';
import { useProductsParams } from '../hooks/use-products-params';

export const ProductListPage = () => {
  const { filters, setFilters, setLimit, setPage, setOrderBy } = useProductsParams();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProductsByPage(filters),
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) return <h1>Cargando página ...</h1>;

  return (
    <>
      <Title title="Productos" subtitle="Catálogo de productos" />

      {isFetching || !data ? (
        <h1>Cargando datos ...</h1>
      ) : (
        <>
          <ProductsStats />
          <div className="flex gap-2 pt-2 pb-4">
            <ProductListFilters
              initialFilters={{
                catalogId: filters.catalogId,
                categoryId: filters.categoryId,
                isActive: filters.isActive,
                maxPrice: filters.maxPrice,
                minPrice: filters.minPrice
              }}
              applyFilters={setFilters}
            />
            <ProductListOrderBy orderBy={filters.orderBy} handleClick={setOrderBy} />
          </div>
          {data.products.length > 0 ? (
            <ProductList products={data.products}>
              <ProductPerPageOptions
                limit={filters.limit}
                page={filters.page}
                elements="productos"
                totalItems={data.pagination.totalItems}
                handleValueChange={setLimit}
              />
            </ProductList>
          ) : (
            <h2 className="text-center font-medium py-8">No se encontraron productos.</h2>
          )}
          <CustomPagination
            totalPages={data.pagination.totalPages}
            handlePageChange={setPage}
            currentPage={filters.page}
            nextPage={data.pagination.nextPage}
            prevPage={data.pagination.prevPage}
          />
        </>
      )}
    </>
  );
};
