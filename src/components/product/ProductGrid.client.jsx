import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, flattenConnection, useUrl } from '@shopify/hydrogen';
import { Button, Grid, ProductCard } from '~/components';
import { getImageLoadingPriority } from '~/lib/const';
export function ProductGrid({ url, collection }) {
  const nextButtonRef = useRef(null);
  const initialProducts = collection?.products?.nodes || [];
  const { hasNextPage, endCursor } = collection?.products?.pageInfo ?? {};
  let [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(endCursor ?? '');
  const [nextPage, setNextPage] = useState(hasNextPage);
  const [pending, setPending] = useState(false);
  const haveProducts = initialProducts.length > 0;
  let filteredProducts = new Set();
  const [filter, setFilter] = useState('');
  let search = useUrl().searchParams;
  let params = [];
  let filts = [];

  useEffect(() => {
    for (const [key, value] of search.entries()) {
      let p = { name: key, value: value };
      params.push(p);
    }
    params.forEach((item) => {
      var existing = filts.filter((v, i) => {
        return v.name == item.name;
      });
      if (existing.length) {
        var existingIndex = filts.indexOf(existing[0]);
        filts[existingIndex].value = filts[existingIndex].value.concat(
          item.value
        );
      } else {
        if (typeof item.value == 'string') item.value = [item.value];
        filts.push(item);
      }
    }), [];
    
    setFilter(filts);
    prodmem = products;
    function filterByType(value) {
      filts.map((fil) => {
        if (fil.name === 'Product Type') {
          if (Object.values(fil)[1].includes(value.productType)) {
            filteredProducts.add(value);
            console.log(fil.name);
          }
          prodmem = Array.from(filteredProducts);
        }
      });
    }
    function filterByColor(value) {
      filts.map((fil) => {
        if (fil.name === 'Color') {
          let p = value?.options?.filter((k) => k.name === 'Color')[0]?.values;
          let f = filts.filter((k) => k.name === 'Color')[0].value;
          p?.map((pval) => {
            f?.includes(pval) ? filteredProducts.add(value) : '';
          });
          prodmem = Array.from(filteredProducts);
          //console.log(f);
          //console.log(p);
        }
      });
    }
    filts.map((fil) => {
    fil.name==='Color'?products.filter(filterByColor):fil.name==='Color'?products.filter(filterByType):''
    })
    console.log('ama: ', prodmem);
    localStorage.setItem('prodCount', prodmem.length||0)
    window.dispatchEvent(new Event("storage"));
  }, [search]);



  const fetchProducts = useCallback(async () => {
    setPending(true);
    const postUrl = new URL(window.location.origin + url);
    postUrl.searchParams.set('cursor', cursor);

    const response = await fetch(postUrl, {
      method: 'POST',
    });
    const { data } = await response.json();
    console.log('products:', data);
    // ProductGrid can paginate collection, products and search routes
    // @ts-ignore TODO: Fix types
    const newProducts = flattenConnection(
      data?.collection?.products || data?.products || []
    );
    const { endCursor, hasNextPage } = data?.collection?.products?.pageInfo ||
      data?.products?.pageInfo || { endCursor: '', hasNextPage: false };

    setProducts([...products, ...newProducts]);

    setCursor(endCursor);

    setNextPage(hasNextPage);
    setPending(false);
  }, [cursor, url, products]);

  const handleIntersect = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchProducts();
          console.log(products);
        }
      });
    },
    [fetchProducts]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '100%',
    });

    const nextButton = nextButtonRef.current;

    if (nextButton) observer.observe(nextButton);

    return () => {
      if (nextButton) observer.unobserve(nextButton);
    };
  }, [nextButtonRef, cursor, handleIntersect]);

  if (!haveProducts) {
    return (
      <>
        <p>No products found on this collection</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  } else {
  }

  return (
    <>
      <Grid layout="products">
        {prodmem?.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            loading={getImageLoadingPriority(i)}
          />
        ))}
      </Grid>

      {nextPage && (
        <div
          className="flex items-center justify-center mt-6"
          ref={nextButtonRef}
        >
          <Button
            variant="secondary"
            disabled={pending}
            onClick={fetchProducts}
            width="full"
          >
            {pending ? 'Loading...' : 'Load more products'}
          </Button>
        </div>
      )}
    </>
  );
}
let prodmem;