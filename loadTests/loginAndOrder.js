import { check, sleep, group, fail } from "k6";
import http from "k6/http";
import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js";

export const options = {
  cloud: {
    distribution: {
      "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 5, duration: "30s" },
        { target: 15, duration: "1m" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "30s" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};

export function scenario_1() {
  let response;

  const vars = {};

  group(
    "Login, order, and verify pizza - https://pizza.jordanhiatt.org/",
    function () {
      response = http.get("https://pizza.jordanhiatt.org/", {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "if-modified-since": "Tue, 31 Mar 2026 23:19:51 GMT",
          priority: "u=0, i",
          "sec-ch-ua":
            '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
      });
      sleep(0.5);

      response = http.post(
        "https://pizza.jordanhiatt.org/cdn-cgi/rum?",
        '{"memory":{"totalJSHeapSize":15810615,"usedJSHeapSize":13435311,"jsHeapSizeLimit":4294967296},"resources":[],"referrer":"","eventType":1,"firstPaint":0,"firstContentfulPaint":0,"startTime":1774999742073.9,"versions":{"fl":"2024.11.0","js":"2026.2.0","timings":2},"pageloadId":"ce9d10b0-6210-4e0b-a8a0-79d4055e6318","location":"https://pizza.jordanhiatt.org/","nt":"reload","timingsV2":{"nextHopProtocol":"h3","domainLookupStart":12.599999994039536,"domainLookupEnd":12.599999994039536,"connectStart":12.599999994039536,"connectEnd":37.79999999701977,"requestStart":37.899999998509884,"responseStart":306.59999999403954,"responseEnd":309.69999999552965,"domInteractive":399.3999999985099,"domComplete":493.3999999985099,"loadEventStart":493.59999999403954,"loadEventEnd":494.79999999701977,"finalResponseHeadersStart":306.59999999403954,"firstInterimResponseStart":0,"transferSize":300,"decodedBodySize":1020},"dt":"cache","siteToken":"23a7dc46bd374dfcbf19727b9868021c","st":2}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
        },
      );
      sleep(3.1);

      response = http.put(
        "https://pizza-service.jordanhiatt.org/api/auth",
        '{"email":"d@jwt.com","password":"diner"}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );

      if (
        !check(response, {
          "status equals 200": (response) =>
            response.status.toString() === "200",
        })
      ) {
        console.log(response.body);
        fail("Login code *not* 200");
      }

      vars["token1"] = jsonpath.query(response.json(), "$.token")[0];

      response = http.options(
        "https://pizza-service.jordanhiatt.org/api/auth",
        null,
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "content-type",
            "access-control-request-method": "PUT",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );
      sleep(0.7);

      response = http.post(
        "https://pizza.jordanhiatt.org/cdn-cgi/rum?",
        '{"resources":[],"referrer":"https://pizza.jordanhiatt.org/","eventType":1,"firstPaint":512,"firstContentfulPaint":512,"startTime":1774999742073.9,"versions":{"fl":"2024.11.0","js":"2026.2.0","timings":1},"pageloadId":"3679920a-978d-45d5-854d-be25728aefd0","location":"https://pizza.jordanhiatt.org/login","nt":"reload","timingsV2":{"nextHopProtocol":"h3","transferSize":300,"decodedBodySize":1020},"dt":"cache","siteToken":"23a7dc46bd374dfcbf19727b9868021c","st":2}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
        },
      );
      sleep(2.2);

      response = http.get(
        "https://pizza-service.jordanhiatt.org/api/order/menu",
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            authorization: `Bearer ${vars["token1"]}`,
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );

      response = http.options(
        "https://pizza-service.jordanhiatt.org/api/order/menu",
        null,
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization,content-type",
            "access-control-request-method": "GET",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );

      response = http.get(
        "https://pizza-service.jordanhiatt.org/api/franchise?page=0&limit=20&name=*",
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            authorization: `Bearer ${vars["token1"]}`,
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );

      response = http.options(
        "https://pizza-service.jordanhiatt.org/api/franchise?page=0&limit=20&name=*",
        null,
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization,content-type",
            "access-control-request-method": "GET",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );
      sleep(4);

      response = http.post(
        "https://pizza.jordanhiatt.org/cdn-cgi/rum?",
        '{"resources":[],"referrer":"https://pizza.jordanhiatt.org/","eventType":1,"firstPaint":512,"firstContentfulPaint":512,"startTime":1774999742073.9,"versions":{"fl":"2024.11.0","js":"2026.2.0","timings":1},"pageloadId":"12b03452-1c8f-47cf-bdc0-3dd170e4d689","location":"https://pizza.jordanhiatt.org/menu","nt":"reload","timingsV2":{"nextHopProtocol":"h3","transferSize":300,"decodedBodySize":1020},"dt":"cache","siteToken":"23a7dc46bd374dfcbf19727b9868021c","st":2}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
        },
      );

      response = http.get("https://pizza-service.jordanhiatt.org/api/user/me", {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          authorization: `Bearer ${vars["token1"]}`,
          "content-type": "application/json",
          origin: "https://pizza.jordanhiatt.org",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      });

      response = http.options(
        "https://pizza-service.jordanhiatt.org/api/user/me",
        null,
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization,content-type",
            "access-control-request-method": "GET",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );
      sleep(1.1);

      response = http.post(
        "https://pizza-service.jordanhiatt.org/api/order",
        '{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            authorization: `Bearer ${vars["token1"]}`,
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );

      if (
        !check(response, {
          "status equals 200": (response) =>
            response.status.toString() === "200",
        })
      ) {
        console.log(response.body);
        fail("Login code *not* 200");
      }

      vars["pizzaToken"] = response.json().jwt;
      console.log(`Pizza Token: ${vars["pizzaToken"]}`);

      response = http.options(
        "https://pizza-service.jordanhiatt.org/api/order",
        null,
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization,content-type",
            "access-control-request-method": "POST",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
        },
      );

      response = http.post(
        "https://pizza.jordanhiatt.org/cdn-cgi/rum?",
        '{"resources":[],"referrer":"https://pizza.jordanhiatt.org/menu","eventType":1,"firstPaint":512,"firstContentfulPaint":512,"startTime":1774999742073.9,"versions":{"fl":"2024.11.0","js":"2026.2.0","timings":1},"pageloadId":"4ab8d95e-fb2e-4d8f-acee-8227ec7c808b","location":"https://pizza.jordanhiatt.org/payment","nt":"reload","timingsV2":{"nextHopProtocol":"h3","transferSize":300,"decodedBodySize":1020},"dt":"cache","siteToken":"23a7dc46bd374dfcbf19727b9868021c","st":2}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
        },
      );
      sleep(3.5);

      response = http.post(
        "https://pizza.jordanhiatt.org/cdn-cgi/rum?",
        '{"resources":[],"referrer":"https://pizza.jordanhiatt.org/payment","eventType":1,"firstPaint":512,"firstContentfulPaint":512,"startTime":1774999742073.9,"versions":{"fl":"2024.11.0","js":"2026.2.0","timings":1},"pageloadId":"9f8ec206-0e50-42cc-b741-284dfddb9ae9","location":"https://pizza.jordanhiatt.org/delivery","nt":"reload","timingsV2":{"nextHopProtocol":"h3","transferSize":300,"decodedBodySize":1020},"dt":"cache","siteToken":"23a7dc46bd374dfcbf19727b9868021c","st":2}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
        },
      );

      response = http.post(
        "https://pizza.jordanhiatt.org/cdn-cgi/rum?",
        '{"referrer":"","eventType":3,"versions":{"js":"2026.2.0","fl":"2024.11.0"},"pageloadId":"9f8ec206-0e50-42cc-b741-284dfddb9ae9","location":"https://pizza.jordanhiatt.org/delivery","landingPath":"/","startTime":1774999742073.9,"nt":"reload","siteToken":"23a7dc46bd374dfcbf19727b9868021c","lcp":{"value":512,"path":"/login","element":"","size":230144,"url":"https://pizza.jordanhiatt.org/pizza-hero.jpg","rld":147.90000000596046,"rlt":0,"erd":57.5,"it":"css"},"fid":{"value":1.1000000014901161,"path":"/login","element":"a.font-medium.text-gray-400.focus:text-orange-600.active","name":"pointerdown"},"cls":{"value":0.06326128000339068,"path":"/delivery","element":"#root>div.bg-gray-800>footer.m-8.flex.justify-center","currentRect":{"x":0,"y":0,"width":0,"height":0,"top":0,"right":0,"bottom":0,"left":0},"previousRect":{"x":32,"y":582,"width":850,"height":72,"top":582,"right":882,"bottom":654,"left":32}},"fcp":{"value":512,"path":"/"},"ttfb":{"value":306.59999999403954,"path":"/"},"inp":{"value":904,"path":"/delivery","element":"","name":"pointerdown"},"timingsV2":{"nextHopProtocol":"h3","transferSize":300,"decodedBodySize":1020},"dt":"cache","st":1}',
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=4, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
        },
      );
      sleep(2.5);

      response = http.post(
        "https://pizza-factory.cs329.click/api/order/verify",
        { jwt: vars["pizzaToken"] },
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            authorization: `Bearer ${vars["token1"]}`,
            "content-type": "application/json",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-fetch-storage-access": "active",
          },
        },
      );

      response = http.options(
        "https://pizza-factory.cs329.click/api/order/verify",
        null,
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "access-control-request-headers": "authorization,content-type",
            "access-control-request-method": "POST",
            origin: "https://pizza.jordanhiatt.org",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
          },
        },
      );
    },
  );
}
