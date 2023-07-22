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

  let color = 'Syntax';

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
    let f = 'Syntax';
    const { searchParams } = useUrl();
    console.log(searchParams);
    let fs = [];
    searchParams.forEach((value, key) => {
      fs.push({ key, value });
    });
    fs.push({ Color: 'Syntax' });
    let m = products;
    let a = [];
    a = m.filter((item) => {
      if (
        item.options.map((op) => {
          for (var count = 0; count < fs.length; count++) {
            console.log('op:', op.name);
            console.log('fop:', Object.keys(fs[count])[0]);
            console.log('opfop:', op.name === Object.keys(fs[count])[0]);
            if (
              op.name == Object.keys(fs[count])[0] //&&
              //op.values.includes(Object.values(fop)[0])
            ) {
              return item;
            }
          }
          return;
        })
      )
        return item;
    });
    console.log(typeof a);
    console.log(a, fs);
    //products = a;
  }

  return (
    <>
      <Grid layout="products">
        {products.map((product, i) => (
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
