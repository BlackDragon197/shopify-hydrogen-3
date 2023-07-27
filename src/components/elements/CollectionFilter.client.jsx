import { Section, Text } from '~/components';
import { useState } from 'react';
import './css/custom.css';
import { FaArrowDown } from './FaArrowDown';
export function CollectionFilter({ minPrice, maxPrice, filterObj }) {
  const [minPriceRange, setminPriceRange] = useState(minPrice);
  const [maxPriceRange, setmaxPriceRange] = useState(maxPrice);

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

  const OnReset = (event) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.forEach((value, key) => {
      url.searchParams.delete(key, value);
    });
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

  const List = ({ data }) =>
    Object.entries(data).map(([key, value]) => {
      return (
        <ul className="ul-inline">
          <div className="nested-list solo">
            <p className="li-cap">
              <span>{key}</span>
              <span className="svg-sp">
                <FaArrowDown />
              </span>
            </p>
            {value.map((value) => (
              <li
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
      <div className="collection-filter-sorting-container">
        <div className="flex-row" onClick={OnClickFilter}>
          <p className="filter-title">Filter:</p>
          <div className="nested-availability-filter flex-row">
            <div
              className="collection-price-container"
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
              </div>
            </div>
            <div
              className="nested-list flex-row"
              data-filter-key="STOCK"
              onClick={onFilterParam}
            >
              <List data={filterObj}>asdsd</List>
            </div>
            <div className="reset" onClick={OnReset}>
              Reset
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
