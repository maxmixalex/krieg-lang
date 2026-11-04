import { ScriptedEffect, type CountryScope } from "krieg-lang/hoi4";
const years = [
  1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915,
  1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931,
  1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947,
  1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960,
] as const;
const months = [
  { number: 1, offset: 0 },
  { number: 2, offset: 31 },
  { number: 3, offset: 59 },
  { number: 4, offset: 90 },
  { number: 5, offset: 120 },
  { number: 6, offset: 151 },
  { number: 7, offset: 181 },
  { number: 8, offset: 212 },
  { number: 9, offset: 243 },
  { number: 10, offset: 273 },
  { number: 11, offset: 304 },
  { number: 12, offset: 334 },
] as const;
export const calendar = ScriptedEffect("rq_calendar", (c: CountryScope) => {
  c.setVariable("rq_now_y", 1900);
  c.setVariable("rq_now_months", 22800);
  c.setTempVariable("rq_month_offset", 0);
  for (const year of years) {
    if (c.dateOnOrAfter(year + ".1.1")) c.setVariable("rq_now_y", year);
  }
  for (const year of years) {
    if (c.variable("rq_now_y") === year) {
      for (const month of months) {
        if (c.dateOnOrAfter(year + "." + month.number + ".1")) {
          c.setVariable("rq_now_months", year * 12 + month.number - 1);
          c.setTempVariable("rq_month_offset", month.offset);
        }
      }
    }
  }
  if (c.variable("rq_dom_m") !== c.variable("rq_now_months")) {
    c.setVariable("rq_dom", 0);
    if (c.variable("rq_dom_m") < 1) c.setVariable("rq_dom", 15);
    c.setVariable("rq_dom_m", c.variable("rq_now_months"));
  } else if (c.variable("rq_no_progress") !== 1) {
    c.addVariable("rq_dom", 1);
    c.clampVariable("rq_dom", { max: 30 });
  }
  c.setTempVariable(
    "rq_doy",
    (c.variable("global.num_days") % 365) - c.variable("rq_month_offset"),
  );
  if (c.variable("rq_doy") > -1 && c.variable("rq_doy") < 31)
    c.setVariable("rq_dom", c.variable("rq_doy"));
  c.setVariable("rq_now_doy", c.variable("rq_dom") + c.variable("rq_month_offset"));
});
