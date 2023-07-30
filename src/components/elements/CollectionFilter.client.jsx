import { Section } from '~/components';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useUrl } from '@shopify/hydrogen';
import './css/custom.css';
import { FaArrowDown } from './FaArrowDown';
export function CollectionFilter({ minPrice, maxPrice, filterObj }) {
  const [minPriceRange, setminPriceRange] = useState(minPrice);
  const [maxPriceRange, setmaxPriceRange] = useState(maxPrice);
  const [prodCount, setProdCount] = useState();
  let item;

  let search = useUrl().searchParams;
  window.addEventListener('storage', () => {
    item = localStorage.getItem('prodCount');
    setProdCount(item);
  });
  let typeL = search.getAll('Product Type').length;
  let colorL = search.getAll('Color').length;
  // useEffect(() => {
  //   let totalChanges = 0;
  //   for (const [key, value] of search.entries()) {
  //     if (key === 'Color' || key === 'Product Type') {
  //       let temp = document.getElementsByClassName('main' + value);
  //       if (temp.length) {
  //         totalChanges++;
  //       }
  //     }
  //   }
  // }, [search]);

  // useEffect(() => {
  //   for (const [key, value] of search.entries()) {
  //     if (key === 'Color' || key === 'Product Type') {
  //       let temp = document.getElementsByClassName('main' + value);

  //         temp[0].classList.add('font-bold');
  //     }
  //   }
  // }, [search]);
  setTimeout(() => {
    for (const [key, value] of search.entries()) {
      if (key === 'Color') {
        let temp = document.getElementsByClassName('main' + value);
        if (temp.length) {
          temp[0].classList.add('font-bold');
        }
      } else if (key === 'Product Type') {
        let temp = document.getElementsByClassName('main' + value);
        temp[0]?.classList.add('font-bold');
      }
    }
  }, 0);

  const OnClickFilter = (event) => {
    if (event.target.closest('.filter-title')) {
      event.target
        .closest('.collection-filter-container')
        .classList.toggle('show');
    }
  };

  const onFilterParam = (event) => {
    let closeAll = document.getElementsByClassName('show');
    if (closeAll.length >= 1) {
      if (!event.target.closest('.nested-list').classList.contains('show'))
        for (var i = 0; i < closeAll.length; i++) {
          closeAll[i].classList.remove('show');
        }
    }
    event.target.closest('.nested-list').classList.toggle('show');
  };

  const OnResetColor = (event) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('Color');
    window.location.href = url.toString();
  };

  const OnResetType = (event) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('Product Type');
    window.location.href = url.toString();
  };

  const OnResetPrice = (event) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('price');
    url.searchParams.delete('min');
    url.searchParams.delete('max');
    window.location.href = url.toString();
  };

  const onFilterAvailabilityParam = (event) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const filterName = event.target.closest('li').getAttribute('filter-name');
    const filterValue = event.target
      .closest('li')
      .getAttribute('data-filter-value');

    if (params.getAll(filterName).includes(filterValue)) {
      let temp = params.getAll(filterName).filter((el) => el !== filterValue);

      url.searchParams.delete(filterName);
      temp.map((el) => {
        url.searchParams.append(filterName, el);
      });
    } else {
      url.searchParams.append(filterName, filterValue);
    }

    // if (params.has(filterName, filterValue)) {
    //   url.searchParams.delete(filterName, filterValue);
    // } else {
    //   url.searchParams.set(filterName, filterValue);
    //   //url.searchParams.append('Color', 'Reactive Blue');
    // }
    //if (event.target.closest('.nested-list').classList.contains('show')) {
    window.location.href = url.toString();
    // }
  };

  const onChangeMin = (event) => {
    event.target.value = setminPriceRange(event.target.value);
  };

  const onChangeMax = (event) => {
    event.target.value = setmaxPriceRange(event.target.value);
  };

  const onFilterPriceParam = (event) => {
    if (event.target.closest('.filter-price')) {
      let closeAll = document.getElementsByClassName('show');
      if (closeAll.length >= 1) {
        if (
          !event.target
            .closest('.collection-price-container')
            .classList.contains('show')
        )
          for (var i = 0; i < closeAll.length; i++) {
            closeAll[i].classList.remove('show');
          }
      }
      event.target
        .closest('.collection-price-container')
        .classList.toggle('show');
    }
  };

  const onSubmitFilter = (event) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('availability');
    url.searchParams.set('price', true);
    url.searchParams.set(
      'min',
      event.target
        .closest('.price-range-container')
        .querySelector('#mininputrange').value
    );
    url.searchParams.set(
      'max',
      event.target
        .closest('.price-range-container')
        .querySelector('#maxinputrange').value
    );
    if (
      event.target
        .closest('.collection-price-container')
        .classList.contains('show')
    ) {
      window.location.href = url.toString();
    }
  };

  const Total = (m) => {
    if (m.m === 'Color' && colorL > 0)
      return (
        <li className="bg-gj border-1">
          {colorL} Selected{' '}
          <div
            className="reset text-gray-500 float-right mr-4"
            onClick={OnResetColor}
          >
            Reset
          </div>
        </li>
      );
    if (m.m == 'Product Type' && typeL > 0)
      return (
        <li className="bg-gj border-1">
          {typeL} Selected{' '}
          <div
            className="reset text-gray-500 float-right mr-4"
            onClick={OnResetType}
          >
            Reset
          </div>
        </li>
      );
    return;
  };

  const List = ({ data }) =>
    Object.entries(data).map(([key, value]) => {
      return (
        <ul className="ml-4 shadow-opts ul-inline w-full whitespace-nowrap text-center hover:ring-offset-2 hover:ring-2 hover:ring-blue-500 rounded-md h-7">
          <div className="nested-list solo">
            <p className="li-cap ">
              <span>{key}</span>
              <span className="svg-sp">
                <FaArrowDown />
              </span>
            </p>
            <Total m={key} />
            {value.map((value) => (
              <li
                className={'main' + value}
                data-filter-value={value}
                filter-name={key}
                onClick={onFilterAvailabilityParam}
              >
                {value}
              </li>
            ))}
          </div>
        </ul>
      );
    });

  return (
    <Section>
      <div className="collection-filter-sorting-container shadow-filts relative pr-4">
        <div
          className="flex flex-col sm:flex-row gap-y-3 sm:gap-0"
          onClick={OnClickFilter}
        >
          <p className="filter-title ml-4 sm:ml-0 ">Filter:</p>
          <div className="nested-availability-filter flex-col flex gap-y-3 sm:flex-row sm:gap-0 items-start sm:items-center">
            <div
              className="ml-4 shadow-opts collection-price-container hover:ring-offset-2 hover:ring-2 hover:ring-blue-500 rounded-md text-center h-7 w-20"
              onClick={onFilterPriceParam}
            >
              <div className="filter-price">
                Price{' '}
                <span className="svg-sp">
                  <FaArrowDown />
                </span>
              </div>
              <div className="price-range-container">
                <label htmlFor="mininputrange">Min (0 to 2000):</label>
                <input
                  type="range"
                  id="mininputrange"
                  name="mininputrange"
                  min="0"
                  value={minPriceRange}
                  max="2000"
                  step={1}
                  onChange={onChangeMin}
                />
                <p>{minPriceRange}</p>
                <label htmlFor="mininputrange">Max (2000 to 10000):</label>
                <input
                  type="range"
                  id="maxinputrange"
                  name="maxinputrange"
                  min="2000"
                  value={maxPriceRange}
                  max="10000"
                  step={1}
                  onChange={onChangeMax}
                />
                <p>{maxPriceRange}</p>
                <button type="button" onClick={onSubmitFilter}>
                  Apply
                </button>
                <div
                  className="text-gray-500 float-right mr-4 top-13 relative"
                  onClick={OnResetPrice}
                >
                  Reset
                </div>
              </div>
            </div>
            <div
              className="nested-list flex-col flex sm:flex-row gap-y-3 sm:gap-0 filtis "
              data-filter-key="STOCK"
              onClick={onFilterParam}
            >
              <List data={filterObj}>asdsd</List>
            </div>

            <div className="text-gray-500 right-0 absolute mr-4 top-4">
              {prodCount} products
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
